import { Minus, Maximize2, X, FolderOpen, ChevronRight } from 'lucide-react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { revealItemInDir } from '@tauri-apps/plugin-opener';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

// ─── Window control button ─────────────────────────────────────────────────────

interface WinBtnProps {
  onClick: () => void;
  label: string;
  variant?: 'default' | 'danger';
  children: React.ReactNode;
}

function WinBtn({ onClick, label, variant = 'default', children }: WinBtnProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          'no-drag flex items-center justify-center w-11 h-full transition-all duration-100',
          'outline-none focus-visible:ring-0',
          variant === 'danger'
            ? 'text-[var(--pp-text-disabled)] hover:bg-[var(--pp-accent-red)] hover:text-white'
            : 'text-[var(--pp-text-disabled)] hover:bg-[var(--pp-hover)] hover:text-[var(--pp-text-secondary)]'
        )}
        onClick={onClick}
        aria-label={label}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

// ─── Folder breadcrumb ────────────────────────────────────────────────────────

function FolderBreadcrumb({ path }: { path: string }) {
  const parts = path.replace(/\\/g, '/').split('/').filter(Boolean);
  const truncated = parts.length > 2 ? ['…', ...parts.slice(-2)] : parts;

  async function handleClick() {
    try {
      await revealItemInDir(path);
    } catch {
      // non-fatal
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger
        onClick={handleClick}
        className={cn(
          'no-drag flex items-center gap-0.5 max-w-[420px]',
          'text-[11px] text-[var(--pp-text-muted)]',
          'hover:text-[var(--pp-text-secondary)] transition-colors duration-100',
          'rounded px-1.5 py-0.5 hover:bg-[var(--pp-hover)]',
          'truncate cursor-pointer outline-none focus-visible:ring-0'
        )}
      >
        <FolderOpen size={12} className="shrink-0 mr-1 text-[var(--pp-accent-blue)]" />
        {truncated.map((part, i) => (
          <span key={i} className="flex items-center gap-0.5 shrink-0">
            {i > 0 && (
              <ChevronRight size={10} className="text-[var(--pp-text-disabled)] shrink-0" />
            )}
            <span
              className={
                i === truncated.length - 1
                  ? 'text-[var(--pp-text-secondary)] font-medium'
                  : ''
              }
            >
              {part}
            </span>
          </span>
        ))}
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[10px]">{path}</span>
          <span className="text-[var(--pp-text-muted)] text-[10px]">
            Click to reveal in Explorer
          </span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

// ─── TitleBar ─────────────────────────────────────────────────────────────────

export default function TitleBar() {
  const currentFolder = useAppStore((s) => s.currentFolder);
  const appWindow = getCurrentWindow();

  return (
    <header
      data-tauri-drag-region
      className={cn(
        'flex items-center justify-between shrink-0 select-none',
        'h-10',
        'bg-[var(--pp-surface)]',
        'border-b border-[var(--pp-border)]'
      )}
    >
      {/* ── Left: logo + wordmark ─────────────────────────────── */}
      <div
        className="flex items-center gap-2.5 pl-4 h-full"
        data-tauri-drag-region
      >
        {/* Logo mark — layered squares */}
        <div className="relative w-4 h-4 shrink-0" aria-hidden="true">
          <div className="absolute inset-0 border border-[var(--pp-text-secondary)] rounded-[2px]" />
          <div className="absolute inset-[3px] bg-[var(--pp-text-secondary)] rounded-[1px]" />
        </div>

        <span className="text-[var(--pp-text-primary)] text-[12px] font-semibold tracking-[0.08em] uppercase">
          PurePic
        </span>

        <div className="w-px h-4 bg-[var(--pp-border)] mx-1" />

        <span className="text-[10px] text-[var(--pp-text-disabled)] font-mono">
          v0.1
        </span>
      </div>

      {/* ── Center: folder path ───────────────────────────────── */}
      <div
        className="flex items-center gap-2 h-full"
        data-tauri-drag-region
      >
        {currentFolder ? (
          <FolderBreadcrumb path={currentFolder} />
        ) : (
          <span className="text-[11px] text-[var(--pp-text-disabled)] italic">
            No folder opened — click Open Folder to begin
          </span>
        )}
      </div>

      {/* ── Right: window controls ────────────────────────────── */}
      <div className="flex items-center h-full">
        <WinBtn onClick={() => appWindow.minimize()} label="Minimize">
          <Minus size={13} strokeWidth={1.5} />
        </WinBtn>
        <WinBtn onClick={() => appWindow.toggleMaximize()} label="Maximize / Restore">
          <Maximize2 size={12} strokeWidth={1.5} />
        </WinBtn>
        <WinBtn onClick={() => appWindow.close()} label="Close" variant="danger">
          <X size={13} strokeWidth={1.5} />
        </WinBtn>
      </div>
    </header>
  );
}
