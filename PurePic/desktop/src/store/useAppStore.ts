import { create } from 'zustand';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ImageRating = 0 | 1 | 2 | 3 | 4 | 5;

export type ImageLabel =
  | 'none'
  | 'red'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple';

export type ImageStatus = 'none' | 'keep' | 'reject' | 'review' | 'favorite';

export interface ImageEntry {
  path: string;
  filename: string;
  size: number;
  modifiedAt: number;
  thumbnail: string | null;
  rating: ImageRating;
  label: ImageLabel;
  status: ImageStatus;
  analysed: boolean;
}

export type SortField = 'filename' | 'modifiedAt' | 'size' | 'rating' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export type ViewMode = 'grid' | 'list';

export type BackgroundTaskStatus =
  | 'idle'
  | 'scanning'
  | 'thumbnailing'
  | 'analysing'
  | 'exporting';

export interface RecentFolder {
  path: string;
  openedAt: number;
}

export type SidebarItemId =
  | 'all-folders'
  | 'recent'
  | 'collections'
  | 'favorites'
  | 'ai-albums'
  | 'rejected'
  | 'export-queue'
  | 'batch-queue';

// ─── Store Shape ──────────────────────────────────────────────────────────────

interface AppState {
  // Folder & images
  currentFolder: string | null;
  recentFolders: RecentFolder[];
  images: ImageEntry[];
  selectedImages: Set<string>;
  activeImage: string | null;

  // UI state
  sidebarActiveItem: SidebarItemId;
  sidebarWidth: number;

  // View
  viewMode: ViewMode;
  sort: SortConfig;
  zoom: number;

  // Background tasks
  taskStatus: BackgroundTaskStatus;
  taskProgress: number;
  taskTotal: number;
  taskLabel: string;

  // Actions — Folder
  setCurrentFolder: (folder: string | null) => void;
  removeRecentFolder: (path: string) => void;
  clearRecentFolders: () => void;
  setImages: (images: ImageEntry[]) => void;
  addImages: (images: ImageEntry[]) => void;
  updateImage: (path: string, update: Partial<ImageEntry>) => void;

  // Actions — Selection
  selectImage: (path: string) => void;
  selectImageRange: (from: string, to: string) => void;
  toggleImageSelection: (path: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setActiveImage: (path: string | null) => void;

  // Actions — UI
  setSidebarActiveItem: (id: SidebarItemId) => void;
  setSidebarWidth: (width: number) => void;

  // Actions — View
  setViewMode: (mode: ViewMode) => void;
  setSort: (sort: SortConfig) => void;
  setZoom: (zoom: number) => void;

  // Actions — Task
  setTaskStatus: (status: BackgroundTaskStatus, label?: string) => void;
  setTaskProgress: (progress: number, total: number) => void;
  resetTask: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_RECENT_FOLDERS = 8;

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  currentFolder: null,
  recentFolders: [],
  images: [],
  selectedImages: new Set(),
  activeImage: null,

  sidebarActiveItem: 'all-folders',
  sidebarWidth: 220,

  viewMode: 'grid',
  sort: { field: 'filename', direction: 'asc' },
  zoom: 1,

  taskStatus: 'idle',
  taskProgress: 0,
  taskTotal: 0,
  taskLabel: '',

  // ── Folder ───────────────────────────────────────────────────────────────────

  setCurrentFolder: (folder) => {
    const prev = get().recentFolders;
    const recentFolders = folder
      ? [
          { path: folder, openedAt: Date.now() },
          ...prev.filter((r) => r.path !== folder),
        ].slice(0, MAX_RECENT_FOLDERS)
      : prev;

    set({
      currentFolder: folder,
      recentFolders,
      images: [],
      selectedImages: new Set(),
      activeImage: null,
    });
  },

  removeRecentFolder: (path) =>
    set((s) => ({
      recentFolders: s.recentFolders.filter((r) => r.path !== path),
    })),

  clearRecentFolders: () => set({ recentFolders: [] }),

  setImages: (images) => set({ images }),

  addImages: (images) =>
    set((s) => ({ images: [...s.images, ...images] })),

  updateImage: (path, update) =>
    set((s) => ({
      images: s.images.map((img) =>
        img.path === path ? { ...img, ...update } : img
      ),
    })),

  // ── Selection ────────────────────────────────────────────────────────────────

  selectImage: (path) =>
    set({ selectedImages: new Set([path]), activeImage: path }),

  selectImageRange: (from, to) =>
    set((s) => {
      const paths = s.images.map((i) => i.path);
      const fi = paths.indexOf(from);
      const ti = paths.indexOf(to);
      if (fi === -1 || ti === -1) return {};
      const start = Math.min(fi, ti);
      const end   = Math.max(fi, ti);
      return {
        selectedImages: new Set(paths.slice(start, end + 1)),
        activeImage: to,
      };
    }),

  toggleImageSelection: (path) =>
    set((s) => {
      const next = new Set(s.selectedImages);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return {
        selectedImages: next,
        activeImage: next.size > 0 ? path : s.activeImage,
      };
    }),

  selectAll: () =>
    set((s) => ({
      selectedImages: new Set(s.images.map((i) => i.path)),
    })),

  clearSelection: () => set({ selectedImages: new Set(), activeImage: null }),

  setActiveImage: (path) => {
    const s = get();
    if (path && !s.selectedImages.has(path)) {
      set({ activeImage: path, selectedImages: new Set([path]) });
    } else {
      set({ activeImage: path });
    }
  },

  // ── UI ───────────────────────────────────────────────────────────────────────

  setSidebarActiveItem: (id) => set({ sidebarActiveItem: id }),

  setSidebarWidth: (width) =>
    set({ sidebarWidth: Math.max(180, Math.min(width, 360)) }),

  // ── View ─────────────────────────────────────────────────────────────────────

  setViewMode: (mode) => set({ viewMode: mode }),
  setSort: (sort) => set({ sort }),
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(zoom, 4)) }),

  // ── Task ─────────────────────────────────────────────────────────────────────

  setTaskStatus: (status, label = '') =>
    set({ taskStatus: status, taskLabel: label }),

  setTaskProgress: (progress, total) =>
    set({ taskProgress: progress, taskTotal: total }),

  resetTask: () =>
    set({ taskStatus: 'idle', taskProgress: 0, taskTotal: 0, taskLabel: '' }),
}));
