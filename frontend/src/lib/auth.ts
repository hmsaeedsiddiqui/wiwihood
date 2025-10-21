// Utility function to get the auth token consistently across the app
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Check for customer token first, then fallback to other tokens
  return localStorage.getItem('accessToken') ||
         localStorage.getItem('customerToken') || 
         localStorage.getItem('auth-token') || 
         localStorage.getItem('providerToken') ||
         localStorage.getItem('token');
};

// Utility function to get auth headers
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Utility function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};