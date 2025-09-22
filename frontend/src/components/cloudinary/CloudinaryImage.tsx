'use client';

import React from 'react';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
}

export const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  src,
  alt,
  width = 300,
  height = 300,
  className = '',
  style = {},
  quality = 'auto',
  format = 'auto'
}) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    console.error('Cloudinary cloud name not configured');
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height, ...style }}
      >
        <span className="text-gray-500 text-sm">Image not available</span>
      </div>
    );
  }

  if (!src) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height, ...style }}
      >
        <span className="text-gray-500 text-sm">No image</span>
      </div>
    );
  }

  // If src is already a full URL, use it directly
  if (src.startsWith('http')) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={style}
        onError={(e) => {
          console.error('Failed to load image:', src);
          const target = e.target as HTMLImageElement;
          target.src = `data:image/svg+xml;base64,${btoa(`
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="#f3f4f6"/>
              <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="sans-serif" font-size="12">
                Image not found
              </text>
            </svg>
          `)}`;
        }}
      />
    );
  }

  // Build transformation string
  const transformations = [];
  
  if (width && height) {
    transformations.push(`w_${width},h_${height},c_fill`);
  } else if (width) {
    transformations.push(`w_${width}`);
  } else if (height) {
    transformations.push(`h_${height}`);
  }
  
  if (quality) {
    transformations.push(`q_${quality}`);
  }
  
  if (format) {
    transformations.push(`f_${format}`);
  }

  const transformationString = transformations.length > 0 ? transformations.join(',') : '';
  
  // Construct Cloudinary URL
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
  const imageUrl = transformationString 
    ? `${baseUrl}/${transformationString}/${src}`
    : `${baseUrl}/${src}`;

  return (
    <img
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      onError={(e) => {
        console.error('Failed to load Cloudinary image:', src);
        const target = e.target as HTMLImageElement;
        target.src = `data:image/svg+xml;base64,${btoa(`
          <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f3f4f6"/>
            <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="sans-serif" font-size="12">
              Image not found
            </text>
          </svg>
        `)}`;
      }}
    />
  );
};
