import { useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useAppStore, type ImageEntry } from '../store/useAppStore';

// ─── Types from Rust ─────────────────────────────────────────────────────────

interface ScannedFile {
  path: string;
  filename: string;
  size: number;
  modified_at: number;
}

// ─── Image MIME type helper ───────────────────────────────────────────────────

function mimeFromExt(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    jpg:  'image/jpeg',
    jpeg: 'image/jpeg',
    png:  'image/png',
    webp: 'image/webp',
    gif:  'image/gif',
    bmp:  'image/bmp',
    tiff: 'image/tiff',
    tif:  'image/tiff',
    heic: 'image/heic',
    heif: 'image/heif',
    avif: 'image/avif',
  };
  return map[ext] ?? 'image/jpeg';
}

function isWebRenderable(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'avif'].includes(ext);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFolderScanner() {
  const setImages      = useAppStore((s) => s.setImages);
  const updateImage    = useAppStore((s) => s.updateImage);
  const setTaskStatus  = useAppStore((s) => s.setTaskStatus);
  const setTaskProgress = useAppStore((s) => s.setTaskProgress);
  const resetTask      = useAppStore((s) => s.resetTask);

  /**
   * Scan a folder for image files, populate the store, then generate
   * thumbnails in the background in batches.
   */
  const scanFolder = useCallback(async (folderPath: string) => {
    // 1. Show scanning state
    setTaskStatus('scanning', 'Scanning folder…');
    setTaskProgress(0, 0);

    let scanned: ScannedFile[] = [];

    try {
      scanned = await invoke<ScannedFile[]>('scan_folder', {
        folderPath,
      });
    } catch (err) {
      console.error('scan_folder failed:', err);
      resetTask();
      return;
    }

    if (scanned.length === 0) {
      resetTask();
      return;
    }

    // 2. Populate store with entries (no thumbnails yet)
    const entries: ImageEntry[] = scanned.map((f) => ({
      path:       f.path,
      filename:   f.filename,
      size:       f.size,
      modifiedAt: f.modified_at,
      thumbnail:  null,
      rating:     0,
      label:      'none',
      status:     'none',
      analysed:   false,
    }));

    setImages(entries);
    setTaskStatus('thumbnailing', 'Generating thumbnails…');
    setTaskProgress(0, entries.length);

    // 3. Generate thumbnails in background — batch of 8 at a time
    const BATCH = 8;
    let done = 0;

    for (let i = 0; i < entries.length; i += BATCH) {
      const batch = entries.slice(i, i + BATCH);

      await Promise.allSettled(
        batch
          .filter((e) => isWebRenderable(e.filename))
          .map(async (entry) => {
            try {
              const b64 = await invoke<string>('read_file_base64', {
                filePath: entry.path,
              });
              const mime = mimeFromExt(entry.filename);
              const dataUrl = `data:${mime};base64,${b64}`;
              updateImage(entry.path, { thumbnail: dataUrl });
            } catch {
              // Thumbnail failed — leave as null, not fatal
            }
          })
      );

      done += batch.length;
      setTaskProgress(done, entries.length);

      // Yield to the event loop so the UI can re-render
      await new Promise((r) => setTimeout(r, 0));
    }

    resetTask();
  }, [setImages, updateImage, setTaskStatus, setTaskProgress, resetTask]);

  return { scanFolder };
}
