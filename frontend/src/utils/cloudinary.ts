/**
 * Cloudinary utilities for handling image errors and fallbacks
 */

export const isValidCloudinaryId = (publicId: string): boolean => {
  if (!publicId || typeof publicId !== 'string') return false;
  if (publicId.trim() === '') return false;
  return true;
};

export const getCloudinaryUrl = (publicId: string, transformation?: string): string => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'reservista';
  
  if (!isValidCloudinaryId(publicId)) {
    return '';
  }

  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
  
  if (transformation) {
    return `${baseUrl}/${transformation}/${publicId}`;
  }
  
  return `${baseUrl}/${publicId}`;
};

export const cleanImageArray = (images: string[]): string[] => {
  return images.filter(isValidCloudinaryId);
};

export const testImageExists = async (publicId: string): Promise<boolean> => {
  try {
    const testUrl = getCloudinaryUrl(publicId, 'w_1,h_1');
    const response = await fetch(testUrl, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};