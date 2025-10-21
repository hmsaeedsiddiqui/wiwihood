// Cloudinary Configuration for Frontend
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  // Note: API Secret should not be exposed on frontend, use backend endpoints for uploads
};

// Cloudinary URL builder helper
export const buildCloudinaryUrl = (
  publicId: string,
  transformations: Record<string, any> = {}
) => {
  if (!publicId) {
    console.warn('buildCloudinaryUrl called with empty publicId');
    return '';
  }

  // If it's already a full URL or data/blob URI, return as-is to avoid 414 and bad requests
  const lower = publicId.toLowerCase();
  if (lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('data:') || lower.startsWith('blob:')) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('buildCloudinaryUrl: bypassing transformation for non-publicId source', { publicIdType: lower.slice(0, lower.indexOf(':') + 1) });
    }
    return publicId;
  }
  if (!cloudinaryConfig.cloudName) {
    console.error('Cloudinary cloudName missing. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local');
    return '';
  }
  
  const baseUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload`;
  
  // Build transformation string
  const transformParts = [];
  
  if (transformations.width) transformParts.push(`w_${transformations.width}`);
  if (transformations.height) transformParts.push(`h_${transformations.height}`);
  if (transformations.crop) transformParts.push(`c_${transformations.crop}`);
  if (transformations.quality) transformParts.push(`q_${transformations.quality}`);
  if (transformations.format) transformParts.push(`f_${transformations.format}`);
  if (transformations.gravity) transformParts.push(`g_${transformations.gravity}`);
  
  const transformString = transformParts.length > 0 ? `${transformParts.join(',')}/` : '';
  
  const finalUrl = `${baseUrl}/${transformString}${publicId}`;
  if (process.env.NODE_ENV !== 'production') {
    console.log('buildCloudinaryUrl result:', { publicId, cloudName: cloudinaryConfig.cloudName, finalUrl });
  }
  
  return finalUrl;
};

// Common transformation presets
export const imageTransformations = {
  profileThumbnail: {
    width: 100,
    height: 100,
    crop: 'fill',
    gravity: 'face',
    quality: 'auto',
    format: 'jpg'
  },
  profileLarge: {
    width: 400,
    height: 400,
    crop: 'fill',
    gravity: 'face',
    quality: 'auto',
    format: 'jpg'
  },
  serviceThumbnail: {
    width: 300,
    height: 200,
    crop: 'fill',
    quality: 'auto',
    format: 'jpg'
  },
  serviceLarge: {
    width: 800,
    height: 600,
    crop: 'fill',
    quality: 'auto',
    format: 'jpg'
  },
  shopLogo: {
    width: 150,
    height: 150,
    crop: 'fill',
    quality: 'auto',
    format: 'jpg'
  },
  shopCover: {
    width: 1200,
    height: 400,
    crop: 'fill',
    quality: 'auto',
    format: 'jpg'
  },
  shopCoverMobile: {
    width: 800,
    height: 300,
    crop: 'fill',
    quality: 'auto',
    format: 'jpg'
  }
};
