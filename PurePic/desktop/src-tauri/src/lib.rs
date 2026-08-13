use std::path::Path;
use std::time::UNIX_EPOCH;
use serde::Serialize;

// ─── Types ────────────────────────────────────────────────────────────────────

#[derive(Debug, Serialize, Clone)]
pub struct ScannedFile {
    pub path: String,
    pub filename: String,
    pub size: u64,
    pub modified_at: u64, // milliseconds since Unix epoch
}

// ─── Commands ─────────────────────────────────────────────────────────────────

/// Recursively scan a directory for image files.
/// Returns a flat list of all matching files sorted by filename.
#[tauri::command]
fn scan_folder(folder_path: String) -> Result<Vec<ScannedFile>, String> {
    let image_extensions = [
        "jpg", "jpeg", "png", "webp", "tiff", "tif",
        "bmp", "gif", "heic", "heif", "avif",
        "cr2", "cr3", "nef", "arw", "orf", "rw2",
        "dng", "raf", "pef", "srw", "x3f",
    ];

    let root = Path::new(&folder_path);
    if !root.exists() {
        return Err(format!("Path does not exist: {}", folder_path));
    }
    if !root.is_dir() {
        return Err(format!("Path is not a directory: {}", folder_path));
    }

    let mut results: Vec<ScannedFile> = Vec::new();
    scan_dir_recursive(root, &image_extensions, &mut results)?;

    // Sort by filename ascending
    results.sort_by(|a, b| a.filename.to_lowercase().cmp(&b.filename.to_lowercase()));

    Ok(results)
}

fn scan_dir_recursive(
    dir: &Path,
    extensions: &[&str],
    results: &mut Vec<ScannedFile>,
) -> Result<(), String> {
    let entries = std::fs::read_dir(dir)
        .map_err(|e| format!("Cannot read directory {:?}: {}", dir, e))?;

    for entry in entries.flatten() {
        let path = entry.path();

        // Skip hidden files and directories (start with .)
        if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
            if name.starts_with('.') {
                continue;
            }
        }

        if path.is_dir() {
            // Recurse — ignore errors on individual subdirs
            let _ = scan_dir_recursive(&path, extensions, results);
        } else if path.is_file() {
            let ext = path
                .extension()
                .and_then(|e| e.to_str())
                .map(|e| e.to_lowercase())
                .unwrap_or_default();

            if extensions.contains(&ext.as_str()) {
                let metadata = match std::fs::metadata(&path) {
                    Ok(m) => m,
                    Err(_) => continue,
                };

                let size = metadata.len();
                let modified_at = metadata
                    .modified()
                    .ok()
                    .and_then(|t| t.duration_since(UNIX_EPOCH).ok())
                    .map(|d| d.as_millis() as u64)
                    .unwrap_or(0);

                let path_str = path.to_string_lossy().to_string();
                let filename = path
                    .file_name()
                    .and_then(|n| n.to_str())
                    .unwrap_or("")
                    .to_string();

                results.push(ScannedFile {
                    path: path_str,
                    filename,
                    size,
                    modified_at,
                });
            }
        }
    }

    Ok(())
}

/// Read a file as base64 — used for thumbnail generation on the frontend.
#[tauri::command]
fn read_file_base64(file_path: String) -> Result<String, String> {
    let bytes = std::fs::read(&file_path)
        .map_err(|e| format!("Cannot read file {}: {}", file_path, e))?;
    Ok(base64_encode(&bytes))
}

/// Simple base64 encoder (no external dependency needed)
fn base64_encode(input: &[u8]) -> String {
    const CHARS: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let mut out = String::with_capacity((input.len() + 2) / 3 * 4);
    for chunk in input.chunks(3) {
        let b0 = chunk[0] as usize;
        let b1 = if chunk.len() > 1 { chunk[1] as usize } else { 0 };
        let b2 = if chunk.len() > 2 { chunk[2] as usize } else { 0 };
        out.push(CHARS[b0 >> 2] as char);
        out.push(CHARS[((b0 & 3) << 4) | (b1 >> 4)] as char);
        if chunk.len() > 1 {
            out.push(CHARS[((b1 & 0xf) << 2) | (b2 >> 6)] as char);
        } else {
            out.push('=');
        }
        if chunk.len() > 2 {
            out.push(CHARS[b2 & 0x3f] as char);
        } else {
            out.push('=');
        }
    }
    out
}

// ─── Entry point ─────────────────────────────────────────────────────────────

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            scan_folder,
            read_file_base64,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
