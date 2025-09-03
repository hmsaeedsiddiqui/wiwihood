'use client';

import { useState } from 'react';
import { buildCloudinaryUrl, imageTransformations } from '../lib/cloudinary';

interface CloudinaryImageProps {
  publicId?: string;
  src?: string;
  alt: string;
  transformation?: keyof typeof imageTransformations | Record<string, any>;
  className?: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}

export const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  publicId,
  src,
  alt,
  transformation = 'serviceThumbnail',
  className = '',
  fallbackSrc = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=400&h=400&facepad=2',
  width,
  height,
  loading = 'lazy',
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Determine the image URL
  let imageUrl = '';
  
  if (src) {
    // Check if src is a full URL or a public ID
    if (src.startsWith('http')) {
      // Use provided src directly (for external URLs or full Cloudinary URLs)
      imageUrl = src;
    } else {
      // Treat src as a public ID and build Cloudinary URL
      const transformConfig = typeof transformation === 'string' 
        ? imageTransformations[transformation] 
        : transformation;
      
      imageUrl = buildCloudinaryUrl(src, transformConfig);
    }
  } else if (publicId) {
    // Build Cloudinary URL with transformations
    const transformConfig = typeof transformation === 'string' 
      ? imageTransformations[transformation] 
      : transformation;
    
    imageUrl = buildCloudinaryUrl(publicId, transformConfig);
  } else {
    // Use fallback
    imageUrl = fallbackSrc;
  }

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    console.error('Failed to load Cloudinary image:', { publicId, src, imageUrl });
    setImageError(true);
    setImageLoading(false);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        src={imageError ? fallbackSrc : imageUrl}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};
