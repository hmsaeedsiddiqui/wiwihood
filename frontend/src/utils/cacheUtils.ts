// Cache clearing utility for development
export const clearAllCaches = () => {
  // Clear localStorage
  if (typeof window !== 'undefined') {
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear any Redux/RTK Query cache
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    console.log('🗑️ All caches cleared');
    
    // Force reload
    window.location.reload();
  }
};

// Check for old Cloudinary URLs and fix them
export const fixCloudinaryUrls = (images: string[]): string[] => {
  return images.map(img => {
    if (img.includes('reservista/services/')) {
      // Remove the duplicate reservista/ prefix
      return img.replace('reservista/services/', 'services/');
    }
    if (img.includes('reservista/profiles/')) {
      return img.replace('reservista/profiles/', 'profiles/');
    }
    if (img.includes('reservista/shops/')) {
      return img.replace('reservista/shops/', 'shops/');
    }
    return img;
  });
};