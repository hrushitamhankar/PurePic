/**
 * Auth Service
 * -------------------------------------------------------
 * All authentication API calls are abstracted here.
 * Currently returns placeholder data.
 * When backend is ready: replace placeholder returns with apiClient calls.
 */

import type {
  User,
  LoginCredentials,
  RegisterCredentials,
} from "@/types/user.types";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResult {
  user: User;
  tokens: AuthTokens;
}

const authService = {
  /**
   * Authenticate user with email and password.
   * @placeholder — replace with: apiClient.post('/auth/login', credentials)
   */
  async login(_credentials: LoginCredentials): Promise<AuthResult> {
    // TODO: return apiClient.post('/auth/login', credentials)
    throw new Error("Backend not yet connected. Login is coming soon.");
  },

  /**
   * Register a new user account.
   * @placeholder — replace with: apiClient.post('/auth/register', credentials)
   */
  async register(_credentials: RegisterCredentials): Promise<AuthResult> {
    // TODO: return apiClient.post('/auth/register', credentials)
    throw new Error("Backend not yet connected. Registration is coming soon.");
  },

  /**
   * Log out the current session.
   * @placeholder — replace with: apiClient.post('/auth/logout')
   */
  async logout(): Promise<void> {
    // TODO: apiClient.post('/auth/logout')
    return Promise.resolve();
  },

  /**
   * Request a password reset email.
   * @placeholder
   */
  async requestPasswordReset(_email: string): Promise<void> {
    // TODO: apiClient.post('/auth/password-reset', { email })
    return Promise.resolve();
  },

  /**
   * Refresh the access token.
   * @placeholder
   */
  async refreshToken(_refreshToken: string): Promise<AuthTokens> {
    // TODO: apiClient.post('/auth/refresh', { refreshToken })
    throw new Error("Not implemented");
  },

  /**
   * Google OAuth sign-in placeholder.
   * @placeholder
   */
  async loginWithGoogle(): Promise<AuthResult> {
    // TODO: redirect to OAuth flow
    throw new Error("Google login not yet connected.");
  },
};

export default authService;
