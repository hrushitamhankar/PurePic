import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppStore } from '../../store/useAppStore';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

// ─── Zoom / pan state ─────────────────────────────────────────────────────────

interface Transform {
  scale: number;
  x: number;
  y: number;
}

const DEFAULT_TRANSFORM: Transform = { scale: 1, x: 0, y: 0 };

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 select-none pointer-events-none">
      <ImageIcon size={28} strokeWidth={0.75} className="text-[var(--pp-border)]" />
      <p className="text-[11px] text-[var(--pp-text-disabled)]">
        Select an image to preview
      </p>
    </div>
  );
}

// ─── Toolbar button ───────────────────────────────────────────────────────────

interface PreviewBtnProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

function PreviewBtn({ icon, label, onClick, active, disabled }: PreviewBtnProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className={cn(
          'flex items-center justify-center w-7 h-7 rounded-[var(--pp-radius-md)]',
          'transition-all duration-100 outline-none',
          active
            ? 'bg-[var(--pp-active)] text-[var(--pp-text-primary)]'
            : 'text-[var(--pp-text-muted)] hover:bg-[var(--pp-hover)] hover:text-[var(--pp-text-primary)]',
          disabled && 'opacity-30 pointer-events-none'
        )}
      >
        {icon}
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}

// ─── Preview ─────────────────────────────────────────────────────────────────

export default function Preview() {
  const images       = useAppStore((s) => s.images);
  const activeImage  = useAppStore((s) => s.activeImage);
  const selectImage  = useAppStore((s) => s.selectImage);
  const setActiveImage = useAppStore((s) => s.setActiveImage);

  const [transform, setTransform] = useState<Transform>(DEFAULT_TRANSFORM);
  const [fitMode, setFitMode]     = useState<'fit' | 'fill'>('fit');
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Find active image entry
  const activeEntry = activeImage
    ? images.find((img) => img.path === activeImage) ?? null
    : null;

  const activeIndex = activeImage
    ? images.findIndex((img) => img.path === activeImage)
    : -1;

  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < images.length - 1;

  // Reset transform when image changes
  useEffect(() => {
    setTransform(DEFAULT_TRANSFORM);
  }, [activeImage]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Only handle if preview is focused context (not in an input)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowLeft' && hasPrev) {
        const prev = images[activeIndex - 1];
        selectImage(prev.path);
        setActiveImage(prev.path);
      }
      if (e.key === 'ArrowRight' && hasNext) {
        const next = images[activeIndex + 1];
        selectImage(next.path);
        setActiveImage(next.path);
      }
      // Fit to view on Space
      if (e.key === ' ' && activeImage) {
        e.preventDefault();
        setTransform(DEFAULT_TRANSFORM);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeImage, activeIndex, hasPrev, hasNext, images, selectImage, setActiveImage]);

  // Scroll to zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta   = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(transform.scale * delta, 8));
    setTransform((t) => ({ ...t, scale: newScale }));
  }, [transform.scale]);

  // Drag to pan
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
  }, [transform.x, transform.y]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStart.current) return;
    setTransform((t) => ({
      ...t,
      x: e.clientX - dragStart.current!.x,
      y: e.clientY - dragStart.current!.y,
    }));
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
  }, []);

  function handleZoomIn() {
    setTransform((t) => ({ ...t, scale: Math.min(t.scale * 1.25, 8) }));
  }

  function handleZoomOut() {
    setTransform((t) => ({ ...t, scale: Math.max(t.scale * 0.8, 0.1) }));
  }

  function handleFitToggle() {
    setFitMode((m) => (m === 'fit' ? 'fill' : 'fit'));
    setTransform(DEFAULT_TRANSFORM);
  }

  function handleReset() {
    setTransform(DEFAULT_TRANSFORM);
  }

  function handlePrev() {
    if (!hasPrev) return;
    const prev = images[activeIndex - 1];
    selectImage(prev.path);
    setActiveImage(prev.path);
  }

  function handleNext() {
    if (!hasNext) return;
    const next = images[activeIndex + 1];
    selectImage(next.path);
    setActiveImage(next.path);
  }

  const zoomPct = Math.round(transform.scale * 100);

  return (
    <div className="flex flex-col h-full bg-[#080808] relative overflow-hidden">

      {/* ── Image area ───────────────────────────────── */}
      <div
        ref={containerRef}
        className={cn(
          'flex-1 flex items-center justify-center overflow-hidden relative',
          isDragging ? 'cursor-grabbing' : activeEntry ? 'cursor-grab' : 'cursor-default'
        )}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {!activeEntry ? (
          <EmptyState />
        ) : activeEntry.thumbnail ? (
          <img
            src={activeEntry.thumbnail}
            alt={activeEntry.filename}
            draggable={false}
            className="max-w-none select-none transition-transform duration-75"
            style={{
              transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
              transformOrigin: 'center center',
              objectFit: fitMode === 'fit' ? 'contain' : 'cover',
              maxHeight: fitMode === 'fit' ? '100%' : 'none',
              maxWidth:  fitMode === 'fit' ? '100%' : 'none',
              height:    fitMode === 'fill' ? '100%' : 'auto',
              width:     fitMode === 'fill' ? '100%' : 'auto',
            }}
          />
        ) : (
          /* No thumbnail yet — show filename */
          <div className="flex flex-col items-center gap-2 select-none">
            <ImageIcon size={24} strokeWidth={0.75} className="text-[var(--pp-border)]" />
            <p className="text-[11px] text-[var(--pp-text-disabled)] max-w-[200px] truncate text-center">
              {activeEntry.filename}
            </p>
            <p className="text-[10px] text-[var(--pp-text-disabled)]">
              Loading thumbnail…
            </p>
          </div>
        )}

        {/* Nav arrows — appear on hover */}
        {activeEntry && (
          <>
            <button
              onClick={handlePrev}
              disabled={!hasPrev}
              aria-label="Previous image"
              className={cn(
                'absolute left-2 top-1/2 -translate-y-1/2',
                'flex items-center justify-center w-8 h-8 rounded-full',
                'bg-black/50 backdrop-blur-sm border border-white/10',
                'text-white/60 hover:text-white hover:bg-black/70',
                'transition-all duration-100',
                'disabled:opacity-0 disabled:pointer-events-none'
              )}
            >
              <ChevronLeft size={16} strokeWidth={1.5} />
            </button>

            <button
              onClick={handleNext}
              disabled={!hasNext}
              aria-label="Next image"
              className={cn(
                'absolute right-2 top-1/2 -translate-y-1/2',
                'flex items-center justify-center w-8 h-8 rounded-full',
                'bg-black/50 backdrop-blur-sm border border-white/10',
                'text-white/60 hover:text-white hover:bg-black/70',
                'transition-all duration-100',
                'disabled:opacity-0 disabled:pointer-events-none'
              )}
            >
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>
          </>
        )}
      </div>

      {/* ── Bottom toolbar ───────────────────────────── */}
      {activeEntry && (
        <div className={cn(
          'shrink-0 flex items-center justify-between',
          'h-8 px-3',
          'bg-black/40 backdrop-blur-sm border-t border-white/5'
        )}>
          {/* Left: filename */}
          <span className="text-[10px] text-[var(--pp-text-disabled)] truncate max-w-[200px]">
            {activeEntry.filename}
          </span>

          {/* Center: zoom controls */}
          <div className="flex items-center gap-1">
            <PreviewBtn
              icon={<ZoomOut size={12} strokeWidth={1.5} />}
              label="Zoom out"
              onClick={handleZoomOut}
              disabled={zoomPct <= 10}
            />

            <button
              onClick={handleReset}
              className="text-[10px] font-mono text-[var(--pp-text-muted)] hover:text-[var(--pp-text-primary)] w-12 text-center transition-colors"
              aria-label="Reset zoom"
            >
              {zoomPct}%
            </button>

            <PreviewBtn
              icon={<ZoomIn size={12} strokeWidth={1.5} />}
              label="Zoom in"
              onClick={handleZoomIn}
              disabled={zoomPct >= 800}
            />

            <div className="w-px h-3 bg-white/10 mx-1" />

            <PreviewBtn
              icon={<Maximize2 size={12} strokeWidth={1.5} />}
              label={fitMode === 'fit' ? 'Switch to fill' : 'Switch to fit'}
              onClick={handleFitToggle}
              active={fitMode === 'fill'}
            />
          </div>

          {/* Right: position */}
          <span className="text-[10px] text-[var(--pp-text-disabled)] font-mono">
            {activeIndex + 1} / {images.length}
          </span>
        </div>
      )}
    </div>
  );
}
