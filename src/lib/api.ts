
// If VITE_API_URL is set (production), use it.
// Otherwise, use empty string to rely on Vite's proxy (development).
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';
