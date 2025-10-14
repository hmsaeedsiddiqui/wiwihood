// Utility functions for provider authentication check
export const checkProviderAuth = () => {
  if (typeof window === 'undefined') return { isProvider: false, user: null, isRegistered: false };
  
  const providerToken = localStorage.getItem('providerToken');
  const provider = localStorage.getItem('provider');
  const wasRegistered = localStorage.getItem('providerWasRegistered') === 'true';
  
  if (providerToken && provider) {
    try {
      const userData = JSON.parse(provider);
      return {
        isProvider: true,
        user: userData,
        token: providerToken,
        isRegistered: true
      };
    } catch (error) {
      console.error('Error parsing provider data:', error);
      return { isProvider: false, user: null, isRegistered: wasRegistered };
    }
  }
  
  return { isProvider: false, user: null, isRegistered: wasRegistered };
};

export const getProviderRedirectUrl = () => {
  const { isProvider, isRegistered } = checkProviderAuth();
  
  if (isProvider) {
    // If already logged in as provider, go to dashboard
    return '/provider/dashboard';
  } else if (isRegistered) {
    // If was registered but token expired, show login page
    return '/auth/provider/login';
  } else {
    // If never registered, show signup page
    return '/auth/provider/signup';
  }
};

export const markProviderAsRegistered = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('providerWasRegistered', 'true');
  }
};

// Development helper to clear all provider data (for testing)
export const clearProviderData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('providerToken');
    localStorage.removeItem('provider');
    localStorage.removeItem('providerWasRegistered');
    console.log('🧹 All provider data cleared');
  }
};