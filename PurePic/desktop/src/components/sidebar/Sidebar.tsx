import { useCallback, useRef, useState } from 'react';
import {
  HardDrive,
  BookMarked,
  Heart,
  Sparkles,
  Trash2,
  Download,
  Layers,
  ChevronRight,
  FolderOpen,
  X,
  MoreHorizontal,
  Plus,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppStore, type SidebarItemId, type RecentFolder } from '../../store/useAppStore';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Format timestamp as relative time ("2 hours ago", "Yesterday", etc.) */
function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 1)   return 'Just now';
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days  === 1) return 'Yesterday';
  if (days  < 7)   return `${days}d ago`;
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/** Get the last segment of a path for display */
function folderName(path: string): string {
  return path.replace(/\\/g, '/').split('/').filter(Boolean).pop() ?? path;
}

/** Shorten a full path for display: show drive + last 2 segments */
function shortenPath(path: string): string {
  const parts = path.replace(/\\/g, '/').split('/').filter(Boolean);
  if (parts.length <= 2) return parts.join(' / ');
  return `${parts[0]} / … / ${parts[parts.length - 1]}`;
}

// ─── Section header ───────────────────────────────────────────────────────────

interface SectionHeaderProps {
  label: string;
  collapsible?: boolean;
  collapsed: boolean;
  onToggle: () => void;
  onAdd?: () => void;
  addLabel?: string;
}

function SectionHeader({
  label,
  collapsible,
  collapsed,
  onToggle,
  onAdd,
  addLabel,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between px-2 py-1 group/section">
      <button
        onClick={collapsible ? onToggle : undefined}
        className={cn(
          'flex items-center gap-1 flex-1 min-w-0',
          collapsible && 'cursor-pointer'
        )}
      >
        {collapsible && (
          <ChevronRight
            size={10}
            strokeWidth={2.5}
            className={cn(
              'shrink-0 text-[var(--pp-text-disabled)] transition-transform duration-150',
              !collapsed && 'rotate-90'
            )}
          />
        )}
        <span className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[var(--pp-text-disabled)] truncate">
          {label}
        </span>
      </button>

      {onAdd && (
        <Tooltip>
          <TooltipTrigger
            onClick={onAdd}
            className={cn(
              'flex items-center justify-center w-4 h-4 rounded',
              'text-[var(--pp-text-disabled)] hover:text-[var(--pp-text-muted)]',
              'hover:bg-[var(--pp-hover)] transition-all duration-100',
              'opacity-0 group-hover/section:opacity-100'
            )}
          >
            <Plus size={10} strokeWidth={2} />
          </TooltipTrigger>
          <TooltipContent side="right">{addLabel ?? 'Add'}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

// ─── Nav item ─────────────────────────────────────────────────────────────────

interface NavItemProps {
  id: SidebarItemId;
  icon: React.ReactNode;
  label: string;
  count?: number;
  dimCount?: boolean; // show count even if 0
  active: boolean;
  onClick: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

function NavItem({
  icon,
  label,
  count,
  dimCount,
  active,
  onClick,
  onContextMenu,
}: NavItemProps) {
  return (
    <button
      onClick={onClick}
      onContextMenu={onContextMenu}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group/item w-full flex items-center gap-2 px-2.5 py-[5px] rounded-[var(--pp-radius-md)]',
        'text-left text-[12px] font-medium transition-all duration-100 outline-none',
        active
          ? 'bg-[var(--pp-selected)]/60 text-[var(--pp-text-primary)]'
          : 'text-[var(--pp-text-muted)] hover:bg-[var(--pp-hover)] hover:text-[var(--pp-text-secondary)]'
      )}
    >
      <span
        className={cn(
          'shrink-0 transition-colors',
          active
            ? 'text-[var(--pp-accent-blue)]'
            : 'text-[var(--pp-text-disabled)] group-hover/item:text-[var(--pp-text-muted)]'
        )}
      >
        {icon}
      </span>

      <span className="flex-1 truncate">{label}</span>

      {(typeof count === 'number' && (count > 0 || dimCount)) && (
        <span
          className={cn(
            'shrink-0 text-[10px] font-mono tabular-nums px-1.5 py-px rounded-full',
            active
              ? 'bg-[var(--pp-accent-blue)]/15 text-[var(--pp-accent-blue)]'
              : 'bg-[var(--pp-hover)] text-[var(--pp-text-disabled)]'
          )}
        >
          {count > 9999 ? '9999+' : count}
        </span>
      )}
    </button>
  );
}

// ─── Recent folder item ───────────────────────────────────────────────────────

interface RecentItemProps {
  entry: RecentFolder;
  active: boolean;
  onClick: () => void;
  onRemove: () => void;
}

function RecentItem({ entry, active, onClick, onRemove }: RecentItemProps) {
  const [hovering, setHovering] = useState(false);

  return (
    <div
      className="relative group/recent"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <button
        onClick={onClick}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'w-full flex items-center gap-2 pl-7 pr-7 py-[4px] rounded-[var(--pp-radius-md)]',
          'text-left transition-all duration-100 outline-none',
          active
            ? 'bg-[var(--pp-selected)]/60 text-[var(--pp-text-primary)]'
            : 'text-[var(--pp-text-muted)] hover:bg-[var(--pp-hover)] hover:text-[var(--pp-text-secondary)]'
        )}
      >
        <FolderOpen
          size={12}
          strokeWidth={1.5}
          className={cn(
            'shrink-0',
            active ? 'text-[var(--pp-accent-blue)]' : 'text-[var(--pp-text-disabled)]'
          )}
        />

        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-medium truncate leading-tight">
            {folderName(entry.path)}
          </p>
          <p className="text-[10px] text-[var(--pp-text-disabled)] truncate leading-tight mt-px">
            {shortenPath(entry.path)}
          </p>
        </div>

        <span className="shrink-0 text-[10px] text-[var(--pp-text-disabled)] font-mono whitespace-nowrap">
          {relativeTime(entry.openedAt)}
        </span>
      </button>

      {/* Remove button — appears on hover */}
      {hovering && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          aria-label="Remove from recent"
          className={cn(
            'absolute right-1 top-1/2 -translate-y-1/2',
            'flex items-center justify-center w-5 h-5 rounded',
            'text-[var(--pp-text-disabled)] hover:text-[var(--pp-accent-red)]',
            'hover:bg-[var(--pp-hover)] transition-all duration-100'
          )}
        >
          <X size={10} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

// ─── Resize handle ────────────────────────────────────────────────────────────

interface ResizeHandleProps {
  onResize: (delta: number) => void;
}

function ResizeHandle({ onResize }: ResizeHandleProps) {
  const dragging = useRef(false);
  const lastX    = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      lastX.current = e.clientX;

      function onMove(ev: MouseEvent) {
        if (!dragging.current) return;
        const delta = ev.clientX - lastX.current;
        lastX.current = ev.clientX;
        onResize(delta);
      }

      function onUp() {
        dragging.current = false;
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }

      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [onResize]
  );

  return (
    <div
      onMouseDown={onMouseDown}
      className={cn(
        'absolute top-0 right-0 w-1 h-full z-10',
        'cursor-col-resize',
        'hover:bg-[var(--pp-accent-blue)]/40 transition-colors duration-150',
        'active:bg-[var(--pp-accent-blue)]/60'
      )}
      aria-hidden="true"
    />
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

interface SidebarProps {
  onOpenFolder?: (path: string) => void;
}

export default function Sidebar({ onOpenFolder }: SidebarProps) {
  const currentFolder       = useAppStore((s) => s.currentFolder);
  const recentFolders       = useAppStore((s) => s.recentFolders);
  const images              = useAppStore((s) => s.images);
  const activeItem          = useAppStore((s) => s.sidebarActiveItem);
  const sidebarWidth        = useAppStore((s) => s.sidebarWidth);
  const setCurrentFolder    = useAppStore((s) => s.setCurrentFolder);
  const removeRecentFolder  = useAppStore((s) => s.removeRecentFolder);
  const clearRecentFolders  = useAppStore((s) => s.clearRecentFolders);
  const setSidebarActiveItem = useAppStore((s) => s.setSidebarActiveItem);
  const setSidebarWidth     = useAppStore((s) => s.setSidebarWidth);

  // Collapsed state per section
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [showRecentMore, setShowRecentMore] = useState(false);

  // Derived counts
  const favoriteCount = images.filter((i) => i.status === 'favorite').length;
  const rejectedCount = images.filter((i) => i.status === 'reject').length;

  function toggleSection(id: string) {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleSelectItem(id: SidebarItemId) {
    setSidebarActiveItem(id);
  }

  function handleOpenRecent(path: string) {
    setCurrentFolder(path);
    setSidebarActiveItem('all-folders');
    onOpenFolder?.(path);
  }

  const visibleRecent = showRecentMore
    ? recentFolders
    : recentFolders.slice(0, 4);

  return (
    <div className="flex flex-col h-full overflow-hidden relative bg-[var(--pp-panel)]">

      {/* ── Drag-to-resize handle ───────────────────────────── */}
      <ResizeHandle
        onResize={(delta) => setSidebarWidth(sidebarWidth + delta)}
      />

      {/* ── Header ─────────────────────────────────────────── */}
      <div
        className={cn(
          'flex items-center justify-between',
          'px-3 h-10 shrink-0',
          'border-b border-[var(--pp-border)]'
        )}
      >
        <div className="flex items-center gap-2">
          <HardDrive size={13} strokeWidth={1.5} className="text-[var(--pp-text-disabled)]" />
          <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--pp-text-disabled)]">
            Library
          </span>
        </div>
      </div>

      {/* ── Nav ────────────────────────────────────────────── */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden py-1.5 px-1.5"
        style={{ scrollbarWidth: 'thin' }}
      >

        {/* ─ Library ─────────────────────────────────────────── */}
        <div className="mb-1">
          <SectionHeader
            label="Library"
            collapsed={!!collapsed.library}
            onToggle={() => toggleSection('library')}
          />
          {!collapsed.library && (
            <div className="mt-0.5 space-y-px">
              <NavItem
                id="all-folders"
                icon={<HardDrive size={13} strokeWidth={1.5} />}
                label="All Folders"
                count={images.length}
                active={activeItem === 'all-folders'}
                onClick={() => handleSelectItem('all-folders')}
              />
            </div>
          )}
        </div>

        {/* ─ Current folder indicator ────────────────────────── */}
        {currentFolder && (
          <div className="mx-2 mb-2 px-2 py-1.5 rounded-[var(--pp-radius-md)] bg-[var(--pp-bg)] border border-[var(--pp-border)]">
            <div className="flex items-center gap-1.5 min-w-0">
              <FolderOpen
                size={11}
                strokeWidth={1.5}
                className="shrink-0 text-[var(--pp-accent-blue)]"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-[var(--pp-text-secondary)] truncate leading-tight">
                  {folderName(currentFolder)}
                </p>
                <p className="text-[10px] text-[var(--pp-text-disabled)] truncate leading-tight mt-px">
                  {images.length} {images.length === 1 ? 'image' : 'images'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─ Recent ──────────────────────────────────────────── */}
        <div className="mb-1">
          <SectionHeader
            label="Recent"
            collapsible
            collapsed={!!collapsed.recent}
            onToggle={() => toggleSection('recent')}
          />
          {!collapsed.recent && (
            <div className="mt-0.5 space-y-px">
              {recentFolders.length === 0 ? (
                <p className="px-7 py-1 text-[11px] text-[var(--pp-text-disabled)] italic">
                  No recent folders
                </p>
              ) : (
                <>
                  {visibleRecent.map((entry) => (
                    <RecentItem
                      key={entry.path}
                      entry={entry}
                      active={currentFolder === entry.path}
                      onClick={() => handleOpenRecent(entry.path)}
                      onRemove={() => removeRecentFolder(entry.path)}
                    />
                  ))}

                  {/* Show more / clear */}
                  {recentFolders.length > 4 && (
                    <div className="flex items-center gap-2 px-7 pt-1">
                      <button
                        onClick={() => setShowRecentMore((p) => !p)}
                        className="text-[10px] text-[var(--pp-accent-blue)] hover:underline"
                      >
                        {showRecentMore
                          ? 'Show less'
                          : `${recentFolders.length - 4} more…`}
                      </button>
                      <span className="text-[var(--pp-border)]">·</span>
                      <button
                        onClick={clearRecentFolders}
                        className="text-[10px] text-[var(--pp-text-disabled)] hover:text-[var(--pp-accent-red)] transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* ─ Collections ─────────────────────────────────────── */}
        <div className="mb-1">
          <SectionHeader
            label="Collections"
            collapsible
            collapsed={!!collapsed.collections}
            onToggle={() => toggleSection('collections')}
            onAdd={() => {}}
            addLabel="New Collection"
          />
          {!collapsed.collections && (
            <div className="mt-0.5 space-y-px">
              <NavItem
                id="collections"
                icon={<BookMarked size={13} strokeWidth={1.5} />}
                label="Collections"
                count={0}
                dimCount
                active={activeItem === 'collections'}
                onClick={() => handleSelectItem('collections')}
              />
              <NavItem
                id="favorites"
                icon={<Heart size={13} strokeWidth={1.5} />}
                label="Favorites"
                count={favoriteCount}
                dimCount
                active={activeItem === 'favorites'}
                onClick={() => handleSelectItem('favorites')}
              />
            </div>
          )}
        </div>

        {/* ─ AI ──────────────────────────────────────────────── */}
        <div className="mb-1">
          <SectionHeader
            label="AI"
            collapsible
            collapsed={!!collapsed.ai}
            onToggle={() => toggleSection('ai')}
          />
          {!collapsed.ai && (
            <div className="mt-0.5 space-y-px">
              <NavItem
                id="ai-albums"
                icon={<Sparkles size={13} strokeWidth={1.5} />}
                label="AI Albums"
                active={activeItem === 'ai-albums'}
                onClick={() => handleSelectItem('ai-albums')}
              />
            </div>
          )}
        </div>

        {/* ─ Workflow ────────────────────────────────────────── */}
        <div className="mb-1">
          <SectionHeader
            label="Workflow"
            collapsible
            collapsed={!!collapsed.workflow}
            onToggle={() => toggleSection('workflow')}
          />
          {!collapsed.workflow && (
            <div className="mt-0.5 space-y-px">
              <NavItem
                id="rejected"
                icon={<Trash2 size={13} strokeWidth={1.5} />}
                label="Rejected"
                count={rejectedCount}
                dimCount
                active={activeItem === 'rejected'}
                onClick={() => handleSelectItem('rejected')}
              />
              <NavItem
                id="export-queue"
                icon={<Download size={13} strokeWidth={1.5} />}
                label="Export Queue"
                count={0}
                dimCount
                active={activeItem === 'export-queue'}
                onClick={() => handleSelectItem('export-queue')}
              />
              <NavItem
                id="batch-queue"
                icon={<Layers size={13} strokeWidth={1.5} />}
                label="Batch Queue"
                count={0}
                dimCount
                active={activeItem === 'batch-queue'}
                onClick={() => handleSelectItem('batch-queue')}
              />
            </div>
          )}
        </div>

      </nav>

      {/* ── Footer ─────────────────────────────────────────── */}
      <div
        className={cn(
          'shrink-0 border-t border-[var(--pp-border)]',
          'px-3 py-2'
        )}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-[var(--pp-text-disabled)]">
            {images.length > 0
              ? `${images.length.toLocaleString()} images loaded`
              : 'No images loaded'}
          </span>
          <button className="text-[var(--pp-text-disabled)] hover:text-[var(--pp-text-muted)] transition-colors">
            <MoreHorizontal size={12} strokeWidth={1.5} />
          </button>
        </div>
        {/* Storage bar — will be populated once fs module is in */}
        <div className="h-[2px] bg-[var(--pp-hover)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--pp-accent-blue)] rounded-full transition-all duration-500"
            style={{ width: images.length > 0 ? '30%' : '0%' }}
          />
        </div>
      </div>
    </div>
  );
}
