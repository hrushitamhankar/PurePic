import { useEffect, useRef } from 'react';
import {
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  SlidersHorizontal,
  Star,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  useAppStore,
  type SortField,
  type SortDirection,
  type ImageStatus,
  type ImageLabel,
} from '../../store/useAppStore';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SortPanelProps {
  open: boolean;
  onClose: () => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[var(--pp-text-disabled)] mb-2">
        {title}
      </p>
      {children}
    </div>
  );
}

// ─── Sort field button ────────────────────────────────────────────────────────

interface SortFieldBtnProps {
  label: string;
  field: SortField;
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
}

function SortFieldBtn({ label, field: _field, active, direction, onClick }: SortFieldBtnProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center justify-between w-full px-3 py-2 rounded-[var(--pp-radius-md)]',
        'text-[12px] transition-all duration-100',
        active
          ? 'bg-[var(--pp-selected)]/60 text-[var(--pp-text-primary)]'
          : 'text-[var(--pp-text-muted)] hover:bg-[var(--pp-hover)] hover:text-[var(--pp-text-secondary)]'
      )}
    >
      <span className="font-medium">{label}</span>
      {active && (
        direction === 'asc'
          ? <ArrowUp size={12} strokeWidth={2} className="text-[var(--pp-accent-blue)]" />
          : <ArrowDown size={12} strokeWidth={2} className="text-[var(--pp-accent-blue)]" />
      )}
    </button>
  );
}

// ─── Filter chip ──────────────────────────────────────────────────────────────

interface FilterChipProps {
  label: string;
  active: boolean;
  color?: string;
  onClick: () => void;
}

function FilterChip({ label, active, color, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1 rounded-full',
        'text-[11px] font-medium transition-all duration-100 border',
        active
          ? 'bg-[var(--pp-selected)]/60 border-[var(--pp-accent-blue)]/40 text-[var(--pp-text-primary)]'
          : 'bg-transparent border-[var(--pp-border)] text-[var(--pp-text-muted)] hover:border-[var(--pp-active)] hover:text-[var(--pp-text-secondary)]'
      )}
    >
      {color && (
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: color }}
        />
      )}
      {label}
    </button>
  );
}

// ─── Rating filter ────────────────────────────────────────────────────────────

interface RatingFilterProps {
  minRating: number;
  onChange: (v: number) => void;
}

function RatingFilter({ minRating, onChange }: RatingFilterProps) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[11px] text-[var(--pp-text-disabled)] mr-1 w-16">Min stars</span>
      {[0, 1, 2, 3, 4, 5].map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={cn(
            'flex items-center justify-center w-6 h-6 rounded transition-all duration-100',
            r === 0
              ? cn(
                  'text-[10px] font-mono',
                  minRating === 0
                    ? 'bg-[var(--pp-active)] text-[var(--pp-text-primary)]'
                    : 'text-[var(--pp-text-disabled)] hover:text-[var(--pp-text-muted)]'
                )
              : cn(
                  minRating >= r
                    ? 'text-[var(--pp-accent-yellow)]'
                    : 'text-[var(--pp-text-disabled)] hover:text-[var(--pp-text-muted)]'
                )
          )}
          aria-label={r === 0 ? 'Any rating' : `${r} stars minimum`}
        >
          {r === 0 ? '✕' : <Star size={12} fill={minRating >= r ? 'currentColor' : 'none'} strokeWidth={1.5} />}
        </button>
      ))}
    </div>
  );
}

// ─── SortPanel ────────────────────────────────────────────────────────────────

const SORT_FIELDS: { field: SortField; label: string }[] = [
  { field: 'filename',   label: 'File Name' },
  { field: 'modifiedAt', label: 'Date Modified' },
  { field: 'size',       label: 'File Size' },
  { field: 'rating',     label: 'Rating' },
  { field: 'status',     label: 'Status' },
];

const STATUS_FILTERS: { value: ImageStatus | 'all'; label: string }[] = [
  { value: 'all',      label: 'All' },
  { value: 'keep',     label: 'Keep' },
  { value: 'review',   label: 'Review' },
  { value: 'reject',   label: 'Rejected' },
  { value: 'favorite', label: 'Favorites' },
];

const LABEL_COLORS: Record<ImageLabel, string> = {
  none:   '',
  red:    '#EF4444',
  yellow: '#EAB308',
  green:  '#22C55E',
  blue:   '#3B82F6',
  purple: '#A855F7',
};

const LABEL_FILTERS: { value: ImageLabel | 'all'; label: string }[] = [
  { value: 'all',    label: 'All' },
  { value: 'red',    label: 'Red' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'green',  label: 'Green' },
  { value: 'blue',   label: 'Blue' },
  { value: 'none',   label: 'No Label' },
];

export default function SortPanel({ open, onClose }: SortPanelProps) {
  const sort    = useAppStore((s) => s.sort);
  const setSort = useAppStore((s) => s.setSort);

  // Local filter state (will be wired to store in filter module)
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    // slight delay so the open click doesn't immediately close
    const id = setTimeout(() => window.addEventListener('pointerdown', onPointer), 100);
    return () => {
      clearTimeout(id);
      window.removeEventListener('pointerdown', onPointer);
    };
  }, [open, onClose]);

  function handleSortField(field: SortField) {
    if (sort.field === field) {
      // Toggle direction
      setSort({ field, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      setSort({ field, direction: 'asc' });
    }
  }

  function handleReset() {
    setSort({ field: 'filename', direction: 'asc' });
  }

  return (
    <>
      {/* Backdrop — subtle, non-blocking */}
      <div
        className={cn(
          'fixed inset-0 z-40 pointer-events-none',
          open && 'pointer-events-auto'
        )}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Sort & Filter"
        aria-modal="false"
        className={cn(
          'fixed top-[84px] left-[var(--sidebar-w,220px)] z-50',
          'w-[280px]',
          'bg-[var(--pp-panel)] border border-[var(--pp-border)]',
          'rounded-[var(--pp-radius-lg)] shadow-2xl',
          'flex flex-col overflow-hidden',
          'transition-all duration-200 origin-top-left',
          open
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        )}
        style={{
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)',
        }}
      >
        {/* ── Header ──────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--pp-border)]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={13} strokeWidth={1.5} className="text-[var(--pp-accent-blue)]" />
            <span className="text-[12px] font-semibold text-[var(--pp-text-primary)]">
              Sort & Filter
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-[var(--pp-text-disabled)] hover:text-[var(--pp-text-muted)] hover:bg-[var(--pp-hover)] transition-all"
            >
              <RotateCcw size={10} strokeWidth={2} />
              Reset
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-6 h-6 rounded hover:bg-[var(--pp-hover)] text-[var(--pp-text-disabled)] hover:text-[var(--pp-text-muted)] transition-all"
              aria-label="Close"
            >
              <X size={13} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────── */}
        <div className="overflow-y-auto p-4 space-y-1">

          {/* Sort by */}
          <PanelSection title="Sort By">
            <div className="space-y-px">
              {SORT_FIELDS.map(({ field, label }) => (
                <SortFieldBtn
                  key={field}
                  field={field}
                  label={label}
                  active={sort.field === field}
                  direction={sort.direction}
                  onClick={() => handleSortField(field)}
                />
              ))}
            </div>
          </PanelSection>

          {/* Direction toggle */}
          <PanelSection title="Direction">
            <div className="flex items-center bg-[var(--pp-bg)] rounded-[var(--pp-radius-md)] p-0.5 border border-[var(--pp-border)] w-fit">
              {(['asc', 'desc'] as SortDirection[]).map((dir) => (
                <button
                  key={dir}
                  onClick={() => setSort({ ...sort, direction: dir })}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1 rounded-[3px] text-[11px] font-medium transition-all duration-100',
                    sort.direction === dir
                      ? 'bg-[var(--pp-active)] text-[var(--pp-text-primary)]'
                      : 'text-[var(--pp-text-disabled)] hover:text-[var(--pp-text-muted)]'
                  )}
                >
                  {dir === 'asc'
                    ? <><ArrowUp size={11} strokeWidth={2} /> Ascending</>
                    : <><ArrowDown size={11} strokeWidth={2} /> Descending</>
                  }
                </button>
              ))}
            </div>
          </PanelSection>

          {/* Status filter */}
          <PanelSection title="Filter by Status">
            <div className="flex flex-wrap gap-1.5">
              {STATUS_FILTERS.map(({ value, label }) => (
                <FilterChip
                  key={value}
                  label={label}
                  active={false}
                  onClick={() => {}}
                />
              ))}
            </div>
          </PanelSection>

          {/* Rating filter */}
          <PanelSection title="Filter by Rating">
            <RatingFilter minRating={0} onChange={() => {}} />
          </PanelSection>

          {/* Color label filter */}
          <PanelSection title="Filter by Label">
            <div className="flex flex-wrap gap-1.5">
              {LABEL_FILTERS.map(({ value, label }) => (
                <FilterChip
                  key={value}
                  label={label}
                  active={false}
                  color={value !== 'all' && value !== 'none' ? LABEL_COLORS[value as ImageLabel] : undefined}
                  onClick={() => {}}
                />
              ))}
            </div>
          </PanelSection>

          {/* Show only */}
          <PanelSection title="Show Only">
            <div className="space-y-1.5">
              {[
                { id: 'analysed', label: 'AI Analysed only' },
                { id: 'unanalysed', label: 'Not yet analysed' },
                { id: 'labelled', label: 'Labelled only' },
              ].map(({ id, label }) => (
                <label key={id} className="flex items-center gap-2.5 cursor-pointer group">
                  <div className={cn(
                    'w-4 h-4 rounded border border-[var(--pp-border)]',
                    'bg-[var(--pp-bg)] flex items-center justify-center',
                    'group-hover:border-[var(--pp-active)] transition-colors'
                  )}>
                    <CheckCircle2 size={10} className="text-transparent" />
                  </div>
                  <span className="text-[11px] text-[var(--pp-text-muted)] group-hover:text-[var(--pp-text-secondary)] transition-colors">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </PanelSection>

        </div>

        {/* ── Footer: active summary ───────────────────── */}
        <div className="shrink-0 px-4 py-2.5 border-t border-[var(--pp-border)] bg-[var(--pp-bg)]">
          <div className="flex items-center gap-1.5">
            <ArrowUpDown size={11} strokeWidth={1.5} className="text-[var(--pp-text-disabled)]" />
            <span className="text-[11px] text-[var(--pp-text-muted)]">
              Sorted by{' '}
              <span className="text-[var(--pp-text-secondary)] font-medium">
                {SORT_FIELDS.find((f) => f.field === sort.field)?.label}
              </span>
              {' '}
              <span className="text-[var(--pp-text-disabled)]">
                ({sort.direction === 'asc' ? '↑ A→Z' : '↓ Z→A'})
              </span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
