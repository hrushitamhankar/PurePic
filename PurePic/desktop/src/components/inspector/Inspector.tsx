import { useState } from 'react';
import {
  Info,
  Cpu,
  Star,
  FileImage,
  Camera,
  Tag,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppStore, type ImageEntry, type ImageRating } from '../../store/useAppStore';
import { Separator } from '../ui/separator';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes === 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(ms: number): string {
  if (!ms) return '—';
  return new Date(ms).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function formatTime(ms: number): string {
  if (!ms) return '—';
  return new Date(ms).toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit',
  });
}

function getExtension(filename: string): string {
  return filename.split('.').pop()?.toUpperCase() ?? '—';
}

// ─── Section ─────────────────────────────────────────────────────────────────

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, icon, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'w-full flex items-center gap-2 px-3 py-2',
          'hover:bg-[var(--pp-hover)] transition-colors group'
        )}
      >
        <span className="text-[var(--pp-text-disabled)] shrink-0">{icon}</span>
        <span className="flex-1 text-[10px] font-semibold tracking-[0.1em] uppercase text-[var(--pp-text-disabled)] text-left">
          {title}
        </span>
        <ChevronRight
          size={10}
          strokeWidth={2.5}
          className={cn(
            'text-[var(--pp-text-disabled)] transition-transform duration-150 shrink-0',
            open && 'rotate-90'
          )}
        />
      </button>
      {open && <div className="pb-2">{children}</div>}
    </div>
  );
}

// ─── Metadata row ─────────────────────────────────────────────────────────────

function MetaRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between px-3 py-[3px] gap-2">
      <span className="text-[11px] text-[var(--pp-text-disabled)] shrink-0">{label}</span>
      <span
        className={cn(
          'text-[11px] text-[var(--pp-text-secondary)] truncate text-right',
          mono && 'font-mono tabular-nums'
        )}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Interactive star rating ──────────────────────────────────────────────────

function StarRating({
  rating,
  path,
}: {
  rating: ImageRating;
  path: string;
}) {
  const updateImage = useAppStore((s) => s.updateImage);
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          onClick={() => updateImage(path, { rating: (s === rating ? 0 : s) as ImageRating })}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${s} star${s > 1 ? 's' : ''}`}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={15}
            strokeWidth={1.5}
            className={cn(
              'transition-colors',
              (hover ? s <= hover : s <= rating)
                ? 'text-[var(--pp-accent-yellow)] fill-[var(--pp-accent-yellow)]'
                : 'text-[var(--pp-border)] hover:text-[var(--pp-accent-yellow)]'
            )}
          />
        </button>
      ))}
      {rating > 0 && (
        <button
          onClick={() => updateImage(path, { rating: 0 })}
          className="text-[10px] text-[var(--pp-text-disabled)] hover:text-[var(--pp-accent-red)] ml-1 transition-colors"
          aria-label="Clear rating"
        >
          ✕
        </button>
      )}
    </div>
  );
}

// ─── Color label picker ───────────────────────────────────────────────────────

const LABELS = [
  { value: 'none',   color: 'var(--pp-border)',        label: 'None' },
  { value: 'red',    color: '#EF4444',                  label: 'Red' },
  { value: 'yellow', color: '#EAB308',                  label: 'Yellow' },
  { value: 'green',  color: '#22C55E',                  label: 'Green' },
  { value: 'blue',   color: '#3B82F6',                  label: 'Blue' },
  { value: 'purple', color: '#A855F7',                  label: 'Purple' },
] as const;

function LabelPicker({ current, path }: { current: string; path: string }) {
  const updateImage = useAppStore((s) => s.updateImage);
  return (
    <div className="flex items-center gap-1.5 px-3 py-2 flex-wrap">
      {LABELS.map(({ value, color, label }) => (
        <button
          key={value}
          onClick={() => updateImage(path, { label: value })}
          aria-label={label}
          title={label}
          className={cn(
            'w-5 h-5 rounded-full transition-all duration-100',
            'border-2',
            current === value
              ? 'border-white scale-110'
              : 'border-transparent hover:scale-110 hover:border-white/40'
          )}
          style={{ background: color }}
        />
      ))}
    </div>
  );
}

// ─── Status picker ────────────────────────────────────────────────────────────

const STATUSES = [
  { value: 'none',     label: 'None',      color: '' },
  { value: 'keep',     label: 'Keep',      color: '#22C55E' },
  { value: 'review',   label: 'Review',    color: '#EAB308' },
  { value: 'reject',   label: 'Reject',    color: '#EF4444' },
  { value: 'favorite', label: 'Favorite',  color: '#EC4899' },
] as const;

function StatusPicker({ current, path }: { current: string; path: string }) {
  const updateImage = useAppStore((s) => s.updateImage);
  return (
    <div className="flex items-center gap-1 px-3 py-2 flex-wrap">
      {STATUSES.map(({ value, label, color }) => (
        <button
          key={value}
          onClick={() => updateImage(path, { status: value })}
          className={cn(
            'flex items-center gap-1 px-2 py-0.5 rounded-full',
            'text-[10px] font-medium border transition-all duration-100',
            current === value
              ? 'border-white/30 text-white'
              : 'border-[var(--pp-border)] text-[var(--pp-text-disabled)] hover:border-[var(--pp-active)] hover:text-[var(--pp-text-muted)]'
          )}
          style={current === value && color ? { background: `${color}33`, borderColor: color } : {}}
        >
          {color && (
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: color || 'var(--pp-border)' }}
            />
          )}
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 px-4 select-none">
      <div className="w-10 h-10 rounded-lg border border-[var(--pp-border)] bg-[var(--pp-bg)] flex items-center justify-center">
        <Info size={18} strokeWidth={1} className="text-[var(--pp-text-disabled)]" />
      </div>
      <p className="text-[11px] text-[var(--pp-text-disabled)] text-center leading-relaxed">
        Select an image to see its metadata, AI analysis, and editing tools
      </p>
    </div>
  );
}

// ─── Inspector ────────────────────────────────────────────────────────────────

export default function Inspector() {
  const images      = useAppStore((s) => s.images);
  const activeImage = useAppStore((s) => s.activeImage);

  const entry: ImageEntry | null = activeImage
    ? (images.find((img) => img.path === activeImage) ?? null)
    : null;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[var(--pp-panel)]">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-3 h-10 border-b border-[var(--pp-border)] shrink-0">
        <Info size={13} strokeWidth={1.5} className="text-[var(--pp-text-disabled)]" />
        <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--pp-text-disabled)]">
          Inspector
        </span>
        {entry && (
          <span className="ml-auto text-[10px] text-[var(--pp-text-disabled)] font-mono truncate max-w-[120px]">
            {getExtension(entry.filename)}
          </span>
        )}
      </div>

      {/* ── Content ────────────────────────────────────── */}
      {!entry ? (
        <EmptyState />
      ) : (
        <div className="flex-1 overflow-y-auto">

          {/* File */}
          <Section title="File" icon={<FileImage size={11} strokeWidth={1.5} />}>
            <MetaRow label="Name"     value={entry.filename} />
            <MetaRow label="Size"     value={formatBytes(entry.size)} mono />
            <MetaRow label="Format"   value={getExtension(entry.filename)} mono />
            <MetaRow label="Date"     value={formatDate(entry.modifiedAt)} />
            <MetaRow label="Time"     value={formatTime(entry.modifiedAt)} mono />
          </Section>

          <Separator className="mx-3" />

          {/* Camera — placeholders until EXIF reading is implemented */}
          <Section title="Camera" icon={<Camera size={11} strokeWidth={1.5} />} defaultOpen={false}>
            <MetaRow label="Camera"       value="—" />
            <MetaRow label="Lens"         value="—" />
            <MetaRow label="Focal Length" value="—" />
            <MetaRow label="Aperture"     value="—" />
            <MetaRow label="Shutter"      value="—" />
            <MetaRow label="ISO"          value="—" />
          </Section>

          <Separator className="mx-3" />

          {/* Rating & Label */}
          <Section title="Rating & Label" icon={<Star size={11} strokeWidth={1.5} />}>
            <p className="text-[10px] text-[var(--pp-text-disabled)] px-3 pb-1">Star rating</p>
            <StarRating rating={entry.rating} path={entry.path} />
            <p className="text-[10px] text-[var(--pp-text-disabled)] px-3 pb-1">Color label</p>
            <LabelPicker current={entry.label} path={entry.path} />
          </Section>

          <Separator className="mx-3" />

          {/* Status */}
          <Section title="Workflow Status" icon={<Tag size={11} strokeWidth={1.5} />}>
            <StatusPicker current={entry.status} path={entry.path} />
          </Section>

          <Separator className="mx-3" />

          {/* AI Analysis */}
          <Section title="AI Analysis" icon={<Cpu size={11} strokeWidth={1.5} />} defaultOpen={false}>
            <div className="px-3 py-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--pp-border)]" />
                <span className="text-[11px] text-[var(--pp-text-disabled)]">
                  Not analysed yet
                </span>
              </div>
              <p className="text-[10px] text-[var(--pp-text-disabled)] leading-relaxed">
                Run AI Edit to analyse this image for scene detection, subject masking, and editing suggestions.
              </p>
            </div>
          </Section>

        </div>
      )}
    </div>
  );
}
