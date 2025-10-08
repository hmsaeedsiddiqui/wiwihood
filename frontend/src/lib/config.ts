// API Configuration Utility
// Centralized configuration for all API base URLs

/**
 * Get the API base URL from environment variables
 * @returns {string} The complete API base URL with /api/v1 path
 */
export const getApiBaseUrl = (): string => {
  // Try to get from environment variable first
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Fall back to dynamic construction
  const backendPort = process.env.NEXT_PUBLIC_BACKEND_PORT || '8000';
  const backendHost = process.env.NEXT_PUBLIC_BACKEND_HOST || 'localhost';
  return `http://${backendHost}:${backendPort}/api/v1`;
};

/**
 * Get the backend base URL without the API path
 * @returns {string} The backend base URL without /api/v1
 */
export const getBackendBaseUrl = (): string => {
  const fullUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  // Remove /api/v1 if it exists at the end
  return fullUrl.replace(/\/api\/v1$/, '');
};

/**
 * Build a complete API URL with the given endpoint
 * @param {string} endpoint - The API endpoint (e.g., '/auth/login', '/users')
 * @returns {string} The complete API URL
 */
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

/**
 * Environment configuration
 */
export const config = {
  API_BASE_URL: getApiBaseUrl(),
  BACKEND_BASE_URL: getBackendBaseUrl(),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:7000',
  CLOUDINARY: {
    CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  }
} as const;

export default config;