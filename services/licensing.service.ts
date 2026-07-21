/**
 * Licensing Service
 * -------------------------------------------------------
 * @placeholder — replace with licensing backend
 */

import type { PlanTier } from "@/types/pricing.types";

export interface LicenseStatus {
  valid: boolean;
  tier: PlanTier;
  expiresAt?: string;
  licenseKey: string;
}

const licensingService = {
  /**
   * Validate a license key.
   * @placeholder — replace with: apiClient.post('/licensing/validate', { key })
   */
  async validateLicense(_key: string): Promise<LicenseStatus> {
    // TODO: apiClient.post('/licensing/validate', { key })
    throw new Error("Licensing backend not yet connected.");
  },

  /**
   * Activate a license on this machine.
   * @placeholder
   */
  async activateLicense(_key: string): Promise<LicenseStatus> {
    // TODO: apiClient.post('/licensing/activate', { key })
    throw new Error("Licensing backend not yet connected.");
  },
};

export default licensingService;
