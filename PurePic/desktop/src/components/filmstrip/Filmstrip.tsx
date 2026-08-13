import { useEffect, useRef } from 'react';
import { ImageIcon, Star } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppStore, type ImageEntry } from '../../store/useAppStore';

// ─── Constants ────────────────────────────────────────────────────────────────

const THUMB_W = 86;
const THUMB_H = 68;
const THUMB_GAP = 4;

// ─── Status dot colors ────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, string> = {
  keep:     '#22C55E',
  review:   '#EAB308',
  reject:   '#EF4444',
  favorite: '#EC4899',
};

const LABEL_COLOR: Record<string, string> = {
  red:    '#EF4444',
  yellow: '#EAB308',
  green:  '#22C55E',
  blue:   '#3B82F6',
  purple: '#A855F7',
};

// ─── Filmstrip thumbnail ──────────────────────────────────────────────────────

interface ThumbProps {
  image: ImageEntry;
  active: boolean;
  selected: boolean;
  onClick: () => void;
}

function FilmstripThumb({ image, active, selected, onClick }: ThumbProps) {
  return (
    <button
      onClick={onClick}
      aria-label={image.filename}
      aria-pressed={active}
      className={cn(
        'relative shrink-0 rounded-[var(--pp-radius-md)] overflow-hidden',
        'border transition-all duration-100 outline-none',
        'bg-[var(--pp-bg)] flex flex-col',
        active
          ? 'border-[var(--pp-accent-blue)] ring-1 ring-[var(--pp-accent-blue)]'
          : selected
          ? 'border-[var(--pp-accent-blue)]/50'
          : 'border-[var(--pp-border)] hover:border-[var(--pp-active)]'
      )}
      style={{ width: THUMB_W, height: THUMB_H + 16 }}
    >
      {/* Image */}
      <div
        className="w-full overflow-hidden bg-[var(--pp-panel)] flex items-center justify-center"
        style={{ height: THUMB_H }}
      >
        {image.thumbnail ? (
          <img
            src={image.thumbnail}
            alt={image.filename}
            draggable={false}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageIcon
            size={14}
            strokeWidth={1}
            className="text-[var(--pp-border)]"
          />
        )}

        {/* Reject overlay */}
        {image.status === 'reject' && (
          <div className="absolute inset-0 bg-red-500/20" />
        )}

        {/* Color label bar */}
        {image.label !== 'none' && LABEL_COLOR[image.label] && (
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: LABEL_COLOR[image.label] }}
          />
        )}

        {/* Status dot */}
        {image.status !== 'none' && STATUS_COLOR[image.status] && (
          <div
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full border border-black/20"
            style={{ background: STATUS_COLOR[image.status] }}
          />
        )}

        {/* Active indicator */}
        {active && (
          <div className="absolute inset-0 bg-[var(--pp-accent-blue)]/10" />
        )}
      </div>

      {/* Caption */}
      <div className="flex items-center justify-between px-1 h-4 shrink-0">
        {/* Mini stars */}
        <div className="flex items-center gap-px">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              size={6}
              strokeWidth={1}
              className={
                s <= image.rating
                  ? 'text-[var(--pp-accent-yellow)] fill-[var(--pp-accent-yellow)]'
                  : 'text-transparent'
              }
            />
          ))}
        </div>
      </div>
    </button>
  );
}

// ─── Filmstrip ────────────────────────────────────────────────────────────────

export default function Filmstrip() {
  const images       = useAppStore((s) => s.images);
  const activeImage  = useAppStore((s) => s.activeImage);
  const selectedImages = useAppStore((s) => s.selectedImages);
  const selectImage  = useAppStore((s) => s.selectImage);
  const setActiveImage = useAppStore((s) => s.setActiveImage);

  const scrollRef    = useRef<HTMLDivElement>(null);
  const hasImages    = images.length > 0;
  const activeIndex  = activeImage
    ? images.findIndex((i) => i.path === activeImage)
    : -1;

  // Auto-scroll active thumb into view
  useEffect(() => {
    if (activeIndex < 0 || !scrollRef.current) return;
    const el = scrollRef.current;
    const thumbLeft  = activeIndex * (THUMB_W + THUMB_GAP);
    const thumbRight = thumbLeft + THUMB_W;
    const { scrollLeft, clientWidth } = el;

    if (thumbLeft < scrollLeft) {
      el.scrollTo({ left: thumbLeft - THUMB_GAP, behavior: 'smooth' });
    } else if (thumbRight > scrollLeft + clientWidth) {
      el.scrollTo({ left: thumbRight - clientWidth + THUMB_GAP, behavior: 'smooth' });
    }
  }, [activeIndex]);

  // Keyboard ← → navigation (filmstrip area handles its own keys when focused)
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!activeImage || images.length === 0) return;
    let next = activeIndex;
    if (e.key === 'ArrowLeft')  next = Math.max(0, activeIndex - 1);
    if (e.key === 'ArrowRight') next = Math.min(images.length - 1, activeIndex + 1);
    if (next !== activeIndex) {
      e.preventDefault();
      selectImage(images[next].path);
      setActiveImage(images[next].path);
    }
  }

  return (
    <div className="flex items-stretch h-full overflow-hidden bg-[var(--pp-panel)]">

      {/* ── Left cap ──────────────────────────────────── */}
      <div className="shrink-0 flex flex-col items-center justify-center w-7 border-r border-[var(--pp-border)] gap-1">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-0.5 h-0.5 rounded-full bg-[var(--pp-border)]" />
        ))}
      </div>

      {/* ── Scroll area ───────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto overflow-y-hidden focus:outline-none"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#3A3A3A transparent' }}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Filmstrip"
      >
        <div
          className="flex items-center h-full"
          style={{
            padding: '8px 8px',
            gap: THUMB_GAP,
            width: hasImages
              ? `${images.length * (THUMB_W + THUMB_GAP) + 16}px`
              : '100%',
          }}
        >
          {hasImages ? (
            images.map((img) => (
              <FilmstripThumb
                key={img.path}
                image={img}
                active={activeImage === img.path}
                selected={selectedImages.has(img.path)}
                onClick={() => {
                  selectImage(img.path);
                  setActiveImage(img.path);
                }}
              />
            ))
          ) : (
            /* Skeleton placeholders */
            [...Array(14)].map((_, i) => (
              <div
                key={i}
                className="shrink-0 rounded-[var(--pp-radius-md)] bg-[var(--pp-hover)] border border-[var(--pp-border)] opacity-20"
                style={{ width: THUMB_W, height: THUMB_H + 16 }}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Right cap: count ──────────────────────────── */}
      <div className="shrink-0 flex flex-col items-center justify-center w-12 border-l border-[var(--pp-border)] gap-0.5">
        <span className="text-[10px] text-[var(--pp-text-disabled)] font-mono tabular-nums">
          {hasImages ? images.length.toLocaleString() : '—'}
        </span>
        {activeIndex >= 0 && (
          <span className="text-[9px] text-[var(--pp-text-disabled)] font-mono">
            #{activeIndex + 1}
          </span>
        )}
      </div>
    </div>
  );
}
