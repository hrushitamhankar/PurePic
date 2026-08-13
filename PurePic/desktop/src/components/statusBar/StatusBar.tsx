import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

// ─── Status segment ───────────────────────────────────────────────────────────

interface SegmentProps {
  label: string;
  value: string | number;
}

function Segment({ label, value }: SegmentProps) {
  return (
    <span className="flex items-center gap-1">
      <span className="text-[var(--pp-text-disabled)]">{label}</span>
      <span className="text-[var(--pp-text-secondary)]">{value}</span>
    </span>
  );
}

function Dot() {
  return (
    <span className="text-[var(--pp-border)] select-none" aria-hidden="true">
      ·
    </span>
  );
}

// ─── Task progress bar ────────────────────────────────────────────────────────

interface ProgressBarProps {
  progress: number;
  total: number;
}

function ProgressBar({ progress, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((progress / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-1 bg-[var(--pp-hover)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--pp-accent-blue)] transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[var(--pp-text-muted)] tabular-nums">{pct}%</span>
    </div>
  );
}

// ─── StatusBar ───────────────────────────────────────────────────────────────

export default function StatusBar() {
  const currentFolder = useAppStore((s) => s.currentFolder);
  const images        = useAppStore((s) => s.images);
  const selected      = useAppStore((s) => s.selectedImages);
  const zoom          = useAppStore((s) => s.zoom);
  const taskStatus    = useAppStore((s) => s.taskStatus);
  const taskLabel     = useAppStore((s) => s.taskLabel);
  const taskProgress  = useAppStore((s) => s.taskProgress);
  const taskTotal     = useAppStore((s) => s.taskTotal);

  const isWorking = taskStatus !== 'idle';
  const folderName = currentFolder
    ? currentFolder.split(/[\\/]/).pop() ?? currentFolder
    : null;

  return (
    <footer
      className={cn(
        'flex items-center justify-between',
        'h-[26px] px-3 shrink-0',
        'bg-[var(--pp-surface)] border-t border-[var(--pp-border)]',
        'text-[11px] select-none'
      )}
    >
      {/* ── Left ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {folderName ? (
          <>
            <Segment label="Folder" value={folderName} />
            <Dot />
            <Segment label="Images" value={images.length.toLocaleString()} />
            {selected.size > 0 && (
              <>
                <Dot />
                <Segment label="Selected" value={selected.size.toLocaleString()} />
              </>
            )}
          </>
        ) : (
          <span className="text-[var(--pp-text-disabled)]">No folder opened</span>
        )}
      </div>

      {/* ── Center: task progress ──────────────────────────────── */}
      {isWorking && (
        <div className="flex items-center gap-2 text-[var(--pp-text-muted)]">
          <span>{taskLabel}</span>
          <ProgressBar progress={taskProgress} total={taskTotal} />
        </div>
      )}

      {/* ── Right ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <Segment label="Zoom" value={`${Math.round(zoom * 100)}%`} />
      </div>
    </footer>
  );
}
