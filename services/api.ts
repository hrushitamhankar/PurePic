/**
 * Axios base client configuration.
 * All services import from here.
 * When backend is ready, update BASE_URL and add interceptors.
 */

import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.purepic.app";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor — attach auth token when available
apiClient.interceptors.request.use(
  (config) => {
    // TODO: retrieve token from auth store (Zustand) and attach
    // const token = useAuthStore.getState().token;
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ?? error.message ?? "An error occurred";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
