export type Platform = "windows" | "macos" | "linux";

export interface DownloadRelease {
  version: string;
  releaseDate: string;
  isLatest: boolean;
  changelog: string[];
  platforms: {
    platform: Platform;
    url: string;
    size: string;
    checksum?: string;
  }[];
}

export interface SystemRequirement {
  label: string;
  minimum: string;
  recommended: string;
}
