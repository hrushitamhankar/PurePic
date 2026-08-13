import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FolderOpen,
  ImageIcon,
  Star,
  Heart,
  CheckCircle2,
  X as XIcon,
  Eye,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  useAppStore,
  type ImageEntry,
  type ImageLabel,
  type ImageRating,
  type ImageStatus,
} from '../../store/useAppStore';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

// ─── Constants ────────────────────────────────────────────────────────────────

const LABEL_COLORS: Record<ImageLabel, string> = {
  none:   '',
  red:    '#EF4444',
  yellow: '#EAB308',
  green:  '#22C55E',
  blue:   '#3B82F6',
  purple: '#A855F7',
};

const STATUS_COLORS: Record<ImageStatus, string> = {
  none:     '',
  keep:     '#22C55E',
  review:   '#EAB308',
  reject:   '#EF4444',
  favorite: '#EC4899',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sortImages(images: ImageEntry[], field: string, direction: string): ImageEntry[] {
  const sorted = [...images].sort((a, b) => {
    let av: string | number = 0;
    let bv: string | number = 0;
    switch (field) {
      case 'filename':   av = a.filename.toLowerCase(); bv = b.filename.toLowerCase(); break;
      case 'modifiedAt': av = a.modifiedAt;             bv = b.modifiedAt;             break;
      case 'size':       av = a.size;                   bv = b.size;                   break;
      case 'rating':     av = a.rating;                 bv = b.rating;                 break;
      case 'status':     av = a.status;                 bv = b.status;                 break;
    }
    if (av < bv) return direction === 'asc' ? -1 : 1;
    if (av > bv) return direction === 'asc' ? 1 : -1;
    return 0;
  });
  return sorted;
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 select-none pointer-events-none">
      <div className="relative">
        {/* Main icon box */}
        <div className={cn(
          'w-20 h-20 rounded-2xl flex items-center justify-center',
          'bg-[var(--pp-panel)] border border-[var(--pp-border)]'
        )}>
          <ImageIcon size={32} strokeWidth={0.75} className="text-[var(--pp-border)]" />
        </div>
        {/* Badge */}
        <div className={cn(
          'absolute -bottom-2 -right-2 w-8 h-8 rounded-xl',
          'bg-[var(--pp-panel-alt)] border border-[var(--pp-border)]',
          'flex items-center justify-center'
        )}>
          <FolderOpen size={14} strokeWidth={1.5} className="text-[var(--pp-accent-blue)]" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="text-[13px] font-medium text-[var(--pp-text-secondary)]">
          No images loaded
        </p>
        <p className="text-[12px] text-[var(--pp-text-disabled)] max-w-[220px] leading-relaxed">
          Open a folder from the toolbar to browse your photos
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        <kbd className="text-[10px] text-[var(--pp-text-disabled)] font-mono bg-[var(--pp-panel)] border border-[var(--pp-border)] px-2 py-0.5 rounded">
          Ctrl
        </kbd>
        <span className="text-[10px] text-[var(--pp-text-disabled)]">+</span>
        <kbd className="text-[10px] text-[var(--pp-text-disabled)] font-mono bg-[var(--pp-panel)] border border-[var(--pp-border)] px-2 py-0.5 rounded">
          O
        </kbd>
        <span className="text-[10px] text-[var(--pp-text-disabled)] ml-1">Open folder</span>
      </div>
    </div>
  );
}

// ─── Thumbnail card ───────────────────────────────────────────────────────────

interface ThumbnailCardProps {
  image: ImageEntry;
  selected: boolean;
  active: boolean;
  thumbSize: number;
  onClick: (e: React.MouseEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

function ThumbnailCard({
  image,
  selected,
  active,
  thumbSize,
  onClick,
  onContextMenu,
}: ThumbnailCardProps) {
  const [hovered, setHovered] = useState(false);
  const hasLabel   = image.label !== 'none';
  const hasStatus  = image.status !== 'none';
  const rating     = image.rating;

  return (
    <div
      style={{ width: thumbSize, height: thumbSize + 28 }}
      className="relative flex flex-col shrink-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Thumbnail area ──────────────────────────── */}
      <button
        onClick={onClick}
        onContextMenu={onContextMenu}
        className={cn(
          'relative w-full overflow-hidden rounded-[var(--pp-radius-md)]',
          'transition-all duration-100 outline-none',
          'focus-visible:ring-1 focus-visible:ring-[var(--pp-accent-blue)]',
          selected
            ? 'ring-2 ring-[var(--pp-accent-blue)]'
            : 'hover:ring-1 hover:ring-[var(--pp-active)]'
        )}
        style={{ height: thumbSize }}
        aria-label={image.filename}
        aria-pressed={selected}
      >
        {/* Image / placeholder */}
        {image.thumbnail ? (
          <img
            src={image.thumbnail}
            alt={image.filename}
            className="w-full h-full object-cover"
            loading="lazy"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full bg-[var(--pp-panel)] flex items-center justify-center">
            <ImageIcon
              size={thumbSize > 100 ? 28 : 18}
              strokeWidth={0.75}
              className="text-[var(--pp-border)]"
            />
          </div>
        )}

        {/* Color label bar — top edge */}
        {hasLabel && (
          <div
            className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[var(--pp-radius-md)]"
            style={{ background: LABEL_COLORS[image.label] }}
          />
        )}

        {/* Status dot — top right */}
        {hasStatus && (
          <div
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-black/30"
            style={{ background: STATUS_COLORS[image.status] }}
          />
        )}

        {/* Selected overlay */}
        {selected && (
          <div className="absolute inset-0 bg-[var(--pp-accent-blue)]/10 rounded-[var(--pp-radius-md)]" />
        )}

        {/* Hover: selection checkbox */}
        {(hovered || selected) && (
          <div
            className={cn(
              'absolute top-1.5 left-1.5 w-5 h-5 rounded flex items-center justify-center',
              'transition-all duration-100',
              selected
                ? 'bg-[var(--pp-accent-blue)] border border-[var(--pp-accent-blue)]'
                : 'bg-black/40 border border-white/20 backdrop-blur-sm'
            )}
          >
            {selected && <CheckCircle2 size={12} className="text-white" strokeWidth={2.5} />}
          </div>
        )}

        {/* Hover: active indicator */}
        {active && !selected && (
          <div className="absolute inset-0 ring-2 ring-[var(--pp-accent-blue)]/50 rounded-[var(--pp-radius-md)]" />
        )}

        {/* Reject overlay */}
        {image.status === 'reject' && (
          <div className="absolute inset-0 bg-[var(--pp-accent-red)]/15 flex items-center justify-center rounded-[var(--pp-radius-md)]">
            <XIcon size={20} strokeWidth={1.5} className="text-[var(--pp-accent-red)]/60" />
          </div>
        )}
      </button>

      {/* ── Caption bar ─────────────────────────────── */}
      <div className="flex items-center justify-between px-0.5 pt-1 gap-1">
        {/* Star rating */}
        <div className="flex items-center gap-px shrink-0">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={9}
              strokeWidth={1.5}
              className={cn(
                'cursor-pointer transition-colors',
                s <= rating
                  ? 'text-[var(--pp-accent-yellow)] fill-[var(--pp-accent-yellow)]'
                  : 'text-[var(--pp-border)]'
              )}
            />
          ))}
        </div>

        {/* Filename */}
        <span className="text-[10px] text-[var(--pp-text-disabled)] truncate flex-1 text-right">
          {image.filename.replace(/\.[^.]+$/, '')}
        </span>

        {/* Favorite */}
        {image.status === 'favorite' && (
          <Heart size={9} className="shrink-0 text-pink-500 fill-pink-500" />
        )}
      </div>
    </div>
  );
}

// ─── Context menu ─────────────────────────────────────────────────────────────

interface ContextMenuProps {
  x: number;
  y: number;
  image: ImageEntry;
  onClose: () => void;
}

function ContextMenu({ x, y, image, onClose }: ContextMenuProps) {
  const updateImage = useAppStore((s) => s.updateImage);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    const id = setTimeout(() => window.addEventListener('pointerdown', handler), 50);
    return () => { clearTimeout(id); window.removeEventListener('pointerdown', handler); };
  }, [onClose]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function item(
    icon: React.ReactNode,
    label: string,
    action: () => void,
    danger = false
  ) {
    return (
      <button
        key={label}
        onClick={() => { action(); onClose(); }}
        className={cn(
          'flex items-center gap-2.5 w-full px-3 py-1.5 text-[12px] rounded-[var(--pp-radius-sm)]',
          'transition-colors duration-75',
          danger
            ? 'text-[var(--pp-accent-red)] hover:bg-[var(--pp-accent-red)]/10'
            : 'text-[var(--pp-text-secondary)] hover:bg-[var(--pp-hover)] hover:text-[var(--pp-text-primary)]'
        )}
      >
        <span className="shrink-0">{icon}</span>
        {label}
      </button>
    );
  }

  const statuses: ImageStatus[] = ['keep', 'review', 'reject', 'favorite', 'none'];

  return (
    <div
      ref={ref}
      className={cn(
        'fixed z-[100] w-48 py-1 px-1',
        'bg-[var(--pp-panel)] border border-[var(--pp-border)]',
        'rounded-[var(--pp-radius-lg)] shadow-2xl',
      )}
      style={{
        left: x,
        top: y,
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      }}
    >
      {item(<Eye size={13} strokeWidth={1.5} />, 'Preview', () => {})}
      <div className="h-px bg-[var(--pp-border)] my-1 mx-1" />
      <p className="text-[10px] text-[var(--pp-text-disabled)] px-3 pt-1 pb-0.5 font-semibold uppercase tracking-wider">
        Set Status
      </p>
      {statuses.map((s) =>
        item(
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: STATUS_COLORS[s] || 'var(--pp-border)' }}
          />,
          s === 'none' ? 'Clear Status' : s.charAt(0).toUpperCase() + s.slice(1),
          () => updateImage(image.path, { status: s }),
          s === 'reject'
        )
      )}
      <div className="h-px bg-[var(--pp-border)] my-1 mx-1" />
      <p className="text-[10px] text-[var(--pp-text-disabled)] px-3 pt-1 pb-0.5 font-semibold uppercase tracking-wider">
        Color Label
      </p>
      {(Object.keys(LABEL_COLORS) as ImageLabel[]).map((lbl) =>
        item(
          <span
            className="w-3 h-3 rounded-full border border-white/10"
            style={{ background: LABEL_COLORS[lbl] || 'var(--pp-border)' }}
          />,
          lbl === 'none' ? 'Clear Label' : lbl.charAt(0).toUpperCase() + lbl.slice(1),
          () => updateImage(image.path, { label: lbl })
        )
      )}
      <div className="h-px bg-[var(--pp-border)] my-1 mx-1" />
      <p className="text-[10px] text-[var(--pp-text-disabled)] px-3 pt-1 pb-0.5 font-semibold uppercase tracking-wider">
        Rating
      </p>
      <div className="flex items-center gap-1 px-3 py-1.5">
        {([0,1,2,3,4,5] as ImageRating[]).map((r) => (
          <button
            key={r}
            onClick={() => { updateImage(image.path, { rating: r }); onClose(); }}
            className={cn(
              'flex items-center justify-center w-6 h-6 rounded transition-colors',
              r === 0
                ? 'text-[10px] text-[var(--pp-text-disabled)] hover:text-[var(--pp-accent-red)] font-mono'
                : cn(
                    r <= image.rating
                      ? 'text-[var(--pp-accent-yellow)]'
                      : 'text-[var(--pp-border)] hover:text-[var(--pp-accent-yellow)]'
                  )
            )}
          >
            {r === 0
              ? '✕'
              : <Star size={12} fill={r <= image.rating ? 'currentColor' : 'none'} strokeWidth={1.5} />
            }
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Browser header ───────────────────────────────────────────────────────────

interface BrowserHeaderProps {
  total: number;
  selected: number;
  thumbSize: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

function BrowserHeader({
  total, selected, thumbSize,
  onZoomIn, onZoomOut, onSelectAll, onClearSelection,
}: BrowserHeaderProps) {
  return (
    <div className={cn(
      'flex items-center justify-between shrink-0',
      'h-8 px-3',
      'bg-[var(--pp-surface)] border-b border-[var(--pp-border)]'
    )}>
      {/* Left: counts */}
      <div className="flex items-center gap-2 text-[11px]">
        <span className="text-[var(--pp-text-muted)]">
          {total.toLocaleString()} images
        </span>
        {selected > 0 && (
          <>
            <span className="text-[var(--pp-border)]">·</span>
            <span className="text-[var(--pp-accent-blue)]">
              {selected} selected
            </span>
            <button
              onClick={onClearSelection}
              className="text-[var(--pp-text-disabled)] hover:text-[var(--pp-text-muted)] transition-colors"
            >
              <XIcon size={11} strokeWidth={2} />
            </button>
          </>
        )}
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-0.5">
        {/* Select all */}
        <Tooltip>
          <TooltipTrigger
            onClick={selected === total ? onClearSelection : onSelectAll}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-[var(--pp-text-disabled)] hover:text-[var(--pp-text-muted)] hover:bg-[var(--pp-hover)] transition-all"
          >
            <CheckCircle2 size={11} strokeWidth={1.5} />
            {selected === total ? 'Deselect all' : 'Select all'}
          </TooltipTrigger>
          <TooltipContent side="bottom">
            Ctrl+A
          </TooltipContent>
        </Tooltip>

        <div className="w-px h-3 bg-[var(--pp-border)] mx-1" />

        {/* Zoom */}
        <Tooltip>
          <TooltipTrigger
            onClick={onZoomOut}
            disabled={thumbSize <= 80}
            className="flex items-center justify-center w-6 h-6 rounded text-[var(--pp-text-disabled)] hover:text-[var(--pp-text-muted)] hover:bg-[var(--pp-hover)] transition-all disabled:opacity-30"
          >
            <ZoomOut size={12} strokeWidth={1.5} />
          </TooltipTrigger>
          <TooltipContent side="bottom">Smaller thumbnails</TooltipContent>
        </Tooltip>

        <div className={cn(
          'w-12 h-1 bg-[var(--pp-hover)] rounded-full mx-1 relative overflow-hidden'
        )}>
          <div
            className="h-full bg-[var(--pp-text-disabled)] rounded-full transition-all"
            style={{ width: `${((thumbSize - 80) / (240 - 80)) * 100}%` }}
          />
        </div>

        <Tooltip>
          <TooltipTrigger
            onClick={onZoomIn}
            disabled={thumbSize >= 240}
            className="flex items-center justify-center w-6 h-6 rounded text-[var(--pp-text-disabled)] hover:text-[var(--pp-text-muted)] hover:bg-[var(--pp-hover)] transition-all disabled:opacity-30"
          >
            <ZoomIn size={12} strokeWidth={1.5} />
          </TooltipTrigger>
          <TooltipContent side="bottom">Larger thumbnails</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

// ─── Browser ─────────────────────────────────────────────────────────────────

export default function Browser() {
  const images           = useAppStore((s) => s.images);
  const currentFolder    = useAppStore((s) => s.currentFolder);
  const selectedImages   = useAppStore((s) => s.selectedImages);
  const activeImage      = useAppStore((s) => s.activeImage);
  const sort             = useAppStore((s) => s.sort);
  const viewMode         = useAppStore((s) => s.viewMode);
  const selectImage      = useAppStore((s) => s.selectImage);
  const toggleImageSelection = useAppStore((s) => s.toggleImageSelection);
  const selectImageRange = useAppStore((s) => s.selectImageRange);
  const selectAll        = useAppStore((s) => s.selectAll);
  const clearSelection   = useAppStore((s) => s.clearSelection);
  const setActiveImage   = useAppStore((s) => s.setActiveImage);

  const [thumbSize, setThumbSize] = useState(140);
  const [contextMenu, setContextMenu] = useState<{
    x: number; y: number; image: ImageEntry;
  } | null>(null);

  const lastClickedRef = useRef<string | null>(null);

  // Apply sort
  const sortedImages = useMemo(
    () => sortImages(images, sort.field, sort.direction),
    [images, sort]
  );

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        if (selectedImages.size === images.length) clearSelection();
        else selectAll();
      }
      if (e.key === 'Escape') clearSelection();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [images.length, selectedImages.size, selectAll, clearSelection]);

  const handleClick = useCallback(
    (image: ImageEntry, e: React.MouseEvent) => {
      if (e.shiftKey && lastClickedRef.current) {
        selectImageRange(lastClickedRef.current, image.path);
      } else if (e.ctrlKey || e.metaKey) {
        toggleImageSelection(image.path);
        lastClickedRef.current = image.path;
      } else {
        selectImage(image.path);
        lastClickedRef.current = image.path;
      }
      setActiveImage(image.path);
    },
    [selectImage, toggleImageSelection, selectImageRange, setActiveImage]
  );

  const handleContextMenu = useCallback(
    (image: ImageEntry, e: React.MouseEvent) => {
      e.preventDefault();
      if (!selectedImages.has(image.path)) {
        selectImage(image.path);
      }
      setContextMenu({ x: e.clientX, y: e.clientY, image });
    },
    [selectedImages, selectImage]
  );

  if (!currentFolder && images.length === 0) {
    return (
      <div className="flex flex-col h-full overflow-hidden bg-[var(--pp-bg)]">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[var(--pp-bg)]">
      {/* ── Browser header ───────────────────────────── */}
      <BrowserHeader
        total={sortedImages.length}
        selected={selectedImages.size}
        thumbSize={thumbSize}
        onZoomIn={() => setThumbSize((s) => Math.min(s + 20, 240))}
        onZoomOut={() => setThumbSize((s) => Math.max(s - 20, 80))}
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
      />

      {/* ── Grid ─────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden"
        onClick={(e) => {
          // Click on background clears selection
          if ((e.target as HTMLElement).dataset.bg === 'true') clearSelection();
        }}
      >
        {sortedImages.length === 0 ? (
          <EmptyState />
        ) : viewMode === 'grid' ? (
          <div
            data-bg="true"
            className="p-3"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fill, minmax(${thumbSize}px, 1fr))`,
              gap: '6px',
            }}
          >
            {sortedImages.map((image) => (
              <ThumbnailCard
                key={image.path}
                image={image}
                selected={selectedImages.has(image.path)}
                active={activeImage === image.path}
                thumbSize={thumbSize}
                onClick={(e) => handleClick(image, e)}
                onContextMenu={(e) => handleContextMenu(image, e)}
              />
            ))}
          </div>
        ) : (
          /* List view */
          <div data-bg="true" className="py-1">
            {sortedImages.map((image) => (
              <button
                key={image.path}
                onClick={(e) => handleClick(image, e)}
                onContextMenu={(e) => handleContextMenu(image, e)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2',
                  'text-left transition-all duration-75 outline-none',
                  selectedImages.has(image.path)
                    ? 'bg-[var(--pp-selected)]/60'
                    : 'hover:bg-[var(--pp-hover)]'
                )}
              >
                {/* Mini thumb */}
                <div className="w-10 h-10 rounded shrink-0 overflow-hidden bg-[var(--pp-panel)]">
                  {image.thumbnail
                    ? <img src={image.thumbnail} alt="" className="w-full h-full object-cover" />
                    : <ImageIcon size={14} className="m-auto mt-3 text-[var(--pp-border)]" />
                  }
                </div>

                {/* Name */}
                <span className="flex-1 text-[12px] text-[var(--pp-text-secondary)] truncate">
                  {image.filename}
                </span>

                {/* Rating */}
                <div className="flex items-center gap-px shrink-0">
                  {[1,2,3,4,5].map((s) => (
                    <Star
                      key={s}
                      size={10}
                      strokeWidth={1.5}
                      className={s <= image.rating ? 'text-[var(--pp-accent-yellow)] fill-[var(--pp-accent-yellow)]' : 'text-[var(--pp-border)]'}
                    />
                  ))}
                </div>

                {/* Status dot */}
                {image.status !== 'none' && (
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: STATUS_COLORS[image.status] }}
                  />
                )}

                {/* Label */}
                {image.label !== 'none' && (
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: LABEL_COLORS[image.label] }}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Context menu ─────────────────────────────── */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          image={contextMenu.image}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
