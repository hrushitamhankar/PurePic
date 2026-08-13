import { useState } from 'react';
import { open as openFolderDialog } from '@tauri-apps/plugin-dialog';
import TitleBar   from '../components/titlebar/TitleBar';
import Toolbar    from '../components/toolbar/Toolbar';
import Sidebar    from '../components/sidebar/Sidebar';
import Browser    from '../components/browser/Browser';
import Inspector  from '../components/inspector/Inspector';
import Preview    from '../components/preview/Preview';
import Filmstrip  from '../components/filmstrip/Filmstrip';
import StatusBar  from '../components/statusBar/StatusBar';
import SortPanel  from '../components/sort/SortPanel';
import { useAppStore } from '../store/useAppStore';
import { useFolderScanner } from '../services/useFolderScanner';

export default function MainLayout() {
  const images           = useAppStore((s) => s.images);
  const sidebarWidth     = useAppStore((s) => s.sidebarWidth);
  const setCurrentFolder = useAppStore((s) => s.setCurrentFolder);

  const [sortPanelOpen, setSortPanelOpen] = useState(false);
  const { scanFolder } = useFolderScanner();

  // Opens native OS folder picker, then stores the selected path
  async function handleOpenFolder() {
    try {
      const selected = await openFolderDialog({
        directory: true,
        multiple: false,
        title: 'Open Image Folder',
      });

      if (typeof selected === 'string' && selected.length > 0) {
        setCurrentFolder(selected);
        // Scan the folder and generate thumbnails
        await scanFolder(selected);
      }
    } catch {
      // Dialog cancelled or failed — non-fatal
    }
  }

  return (
    <div
      className="w-screen h-screen overflow-hidden flex flex-col"
      style={{ background: 'var(--pp-bg)', color: 'var(--pp-text-primary)' }}
    >
      {/* ── Title bar ──────────────────────────────────────── */}
      <TitleBar />

      {/* ── Toolbar ────────────────────────────────────────── */}
      <Toolbar
        hasImages={images.length > 0}
        onOpenFolder={handleOpenFolder}
        onSort={() => setSortPanelOpen((p) => !p)}
        sortActive={sortPanelOpen}
      />

      {/* ── Sort panel (floating) ──────────────────────────── */}
      <SortPanel
        open={sortPanelOpen}
        onClose={() => setSortPanelOpen(false)}
      />

      {/* ── Middle workspace ───────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* Sidebar: dynamic width from store, min 180px, max 360px */}
        <div
          className="shrink-0 overflow-hidden flex flex-col"
          style={{
            width: `${sidebarWidth}px`,
            borderRight: '1px solid var(--pp-border)',
          }}
        >
          <Sidebar onOpenFolder={scanFolder} />
        </div>

        {/* Center column */}
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">

          {/* Top row: browser + inspector */}
          <div className="flex flex-1 overflow-hidden min-h-0">

            {/* Image Browser */}
            <div className="flex-1 overflow-hidden min-w-0">
              <Browser />
            </div>

            {/* Inspector: 272px fixed */}
            <div
              className="shrink-0 overflow-hidden"
              style={{
                width: '272px',
                borderLeft: '1px solid var(--pp-border)',
              }}
            >
              <Inspector />
            </div>

          </div>

          {/* Preview panel: 240px */}
          <div
            className="shrink-0 overflow-hidden"
            style={{
              height: '240px',
              borderTop: '1px solid var(--pp-border)',
            }}
          >
            <Preview />
          </div>

        </div>

      </div>

      {/* ── Filmstrip: 108px ───────────────────────────────── */}
      <div
        className="shrink-0 overflow-hidden"
        style={{
          height: '108px',
          borderTop: '1px solid var(--pp-border)',
        }}
      >
        <Filmstrip />
      </div>

      {/* ── Status bar ─────────────────────────────────────── */}
      <StatusBar />
    </div>
  );
}
