/**
 * Download Service
 * -------------------------------------------------------
 * Manages download links, version info, and release notes.
 * Currently returns static data.
 * When backend is ready: replace with apiClient calls.
 */

import type { DownloadRelease, Platform } from "@/types/download.types";

const LATEST_VERSION = "0.1.0-beta";

const releases: DownloadRelease[] = [
  {
    version: "0.1.0-beta",
    releaseDate: "2025-01-15",
    isLatest: true,
    changelog: [
      "Initial public beta release",
      "AI culling engine with multi-dimensional scoring",
      "Genre-aware sorting (wildlife, wedding, portrait, events)",
      "RAW file support via embedded preview extraction",
      "Parallel multi-core batch processing",
      "Aesthetic deep learning model (ONNX + TFLite)",
      "CSV report generation",
    ],
    platforms: [
      {
        platform: "windows",
        url: "#",
        size: "48 MB",
        checksum: "sha256:placeholder",
      },
      {
        platform: "macos",
        url: "#",
        size: "52 MB",
        checksum: "sha256:placeholder",
      },
      {
        platform: "linux",
        url: "#",
        size: "45 MB",
        checksum: "sha256:placeholder",
      },
    ],
  },
];

const downloadService = {
  /**
   * Get the latest release info.
   * @placeholder — replace with: apiClient.get('/releases/latest')
   */
  async getLatestRelease(): Promise<DownloadRelease> {
    return releases[0];
  },

  /**
   * Get all releases.
   * @placeholder — replace with: apiClient.get('/releases')
   */
  async getAllReleases(): Promise<DownloadRelease[]> {
    return releases;
  },

  /**
   * Get download URL for a specific platform.
   * @placeholder — replace with: apiClient.get(`/releases/${version}/download/${platform}`)
   */
  async getDownloadUrl(
    platform: Platform,
    version: string = LATEST_VERSION
  ): Promise<string> {
    const release = releases.find((r) => r.version === version);
    const dl = release?.platforms.find((p) => p.platform === platform);
    return dl?.url ?? "#";
  },
};

export default downloadService;
