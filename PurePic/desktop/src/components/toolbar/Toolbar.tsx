import {
  FolderOpen,
  ArrowUpDown,
  Sparkles,
  Columns2,
  Download,
  Settings,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

// ─── Tooltip-wrapped icon button ──────────────────────────────────────────────

interface IconBtnProps {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
}

function IconBtn({ icon, label, shortcut, onClick, disabled, active }: IconBtnProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        aria-pressed={active}
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-[var(--pp-radius-md)]',
          'transition-all duration-100 outline-none',
          'focus-visible:ring-1 focus-visible:ring-[var(--pp-accent-blue)]',
          active
            ? 'bg-[var(--pp-active)] text-[var(--pp-text-primary)]'
            : 'text-[var(--pp-text-muted)] hover:bg-[var(--pp-hover)] hover:text-[var(--pp-text-primary)]',
          disabled && 'opacity-30 cursor-not-allowed pointer-events-none'
        )}
      >
        {icon}
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <span>{label}</span>
        {shortcut && (
          <kbd className="ml-2 text-[10px] text-[var(--pp-text-disabled)] font-mono bg-[var(--pp-hover)] px-1.5 py-0.5 rounded border border-[var(--pp-border)]">
            {shortcut}
          </kbd>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

interface ToolbarProps {
  onOpenFolder?: () => void;
  onSort?: () => void;
  onAIEdit?: () => void;
  onCompare?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
  hasImages?: boolean;
  sortActive?: boolean;
}

export default function Toolbar({
  onOpenFolder,
  onSort,
  onAIEdit,
  onCompare,
  onExport,
  onSettings,
  hasImages = false,
  sortActive = false,
}: ToolbarProps) {
  const viewMode    = useAppStore((s) => s.viewMode);
  const setViewMode = useAppStore((s) => s.setViewMode);

  return (
    <div
      className={cn(
        'flex items-center justify-between shrink-0',
        'h-11 px-2',
        'bg-[var(--pp-panel)]',
        'border-b border-[var(--pp-border)]'
      )}
    >
      {/* ── Left: primary workflow ────────────────────────────── */}
      <div className="flex items-center gap-0.5">

        {/* Open Folder — labelled primary action */}
        <Tooltip>
          <TooltipTrigger
            onClick={onOpenFolder}
            aria-label="Open Folder"
            className={cn(
              'flex items-center gap-1.5 h-7 px-3 rounded-[var(--pp-radius-md)]',
              'text-[12px] font-medium outline-none',
              'border border-[var(--pp-border)]',
              'bg-[var(--pp-panel-alt)] text-[var(--pp-text-secondary)]',
              'hover:bg-[var(--pp-hover)] hover:text-[var(--pp-text-primary)] hover:border-[var(--pp-active)]',
              'transition-all duration-100'
            )}
          >
            <FolderOpen size={13} strokeWidth={1.5} />
            <span>Open Folder</span>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <span>Open image folder</span>
            <kbd className="ml-2 text-[10px] font-mono bg-[var(--pp-hover)] px-1.5 py-0.5 rounded border border-[var(--pp-border)] text-[var(--pp-text-disabled)]">
              Ctrl+O
            </kbd>
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-5 mx-1.5 bg-[var(--pp-border)]" />

        <IconBtn
          icon={<ArrowUpDown size={14} strokeWidth={1.5} />}
          label="Sort & Filter"
          shortcut="S"
          onClick={onSort}
          disabled={!hasImages}
          active={sortActive}
        />
        <IconBtn
          icon={<Sparkles size={14} strokeWidth={1.5} />}
          label="AI Edit"
          shortcut="A"
          onClick={onAIEdit}
          disabled={!hasImages}
        />
        <IconBtn
          icon={<Columns2 size={14} strokeWidth={1.5} />}
          label="Compare"
          shortcut="C"
          onClick={onCompare}
          disabled={!hasImages}
        />

        <Separator orientation="vertical" className="h-5 mx-1.5 bg-[var(--pp-border)]" />

        <IconBtn
          icon={<Download size={14} strokeWidth={1.5} />}
          label="Export"
          shortcut="Ctrl+E"
          onClick={onExport}
          disabled={!hasImages}
        />
      </div>

      {/* ── Right: view toggle + settings ────────────────────── */}
      <div className="flex items-center gap-0.5">
        {/* View mode pill */}
        <div
          className={cn(
            'flex items-center rounded-[var(--pp-radius-md)] p-0.5',
            'bg-[var(--pp-bg)] border border-[var(--pp-border)]'
          )}
        >
          <Tooltip>
            <TooltipTrigger
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
              className={cn(
                'flex items-center justify-center w-6 h-6 rounded-[3px] transition-all duration-100 outline-none',
                viewMode === 'grid'
                  ? 'bg-[var(--pp-active)] text-[var(--pp-text-primary)]'
                  : 'text-[var(--pp-text-disabled)] hover:text-[var(--pp-text-muted)]'
              )}
            >
              <LayoutGrid size={12} strokeWidth={1.5} />
            </TooltipTrigger>
            <TooltipContent side="bottom">Grid view</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              onClick={() => setViewMode('list')}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
              className={cn(
                'flex items-center justify-center w-6 h-6 rounded-[3px] transition-all duration-100 outline-none',
                viewMode === 'list'
                  ? 'bg-[var(--pp-active)] text-[var(--pp-text-primary)]'
                  : 'text-[var(--pp-text-disabled)] hover:text-[var(--pp-text-muted)]'
              )}
            >
              <List size={12} strokeWidth={1.5} />
            </TooltipTrigger>
            <TooltipContent side="bottom">List view</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-5 mx-1.5 bg-[var(--pp-border)]" />

        <IconBtn
          icon={<Settings size={14} strokeWidth={1.5} />}
          label="Settings"
          shortcut=","
          onClick={onSettings}
        />
      </div>
    </div>
  );
}
