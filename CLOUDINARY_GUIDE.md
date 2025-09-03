# Cloudinary Integration Guide

## Overview

This guide covers the complete Cloudinary integration for the Reservista platform, enabling professional image management with automatic optimization, transformations, and cloud storage for user profiles, service images, and shop branding.

## Features

### ✅ Backend Features
- **Cloudinary SDK Integration**: Full Cloudinary v2 SDK implementation
- **Multiple Upload Endpoints**: Separate endpoints for different image types
- **Automatic Transformations**: Pre-configured image optimizations
- **File Validation**: Size and type validation with error handling
- **Organized Storage**: Folder-based organization in Cloudinary
- **URL Upload Support**: Upload images from external URLs
- **Delete Functionality**: Clean up unused images
- **TypeORM Integration**: Database fields for Cloudinary public IDs

### ✅ Frontend Features
- **React Components**: Pre-built upload and display components
- **Drag & Drop**: Intuitive file upload interface
- **Progress Tracking**: Real-time upload progress
- **Error Handling**: User-friendly error messages
- **Image Preview**: Instant preview of uploaded images
- **Responsive Images**: Automatic responsive image delivery
- **Custom Transformations**: Flexible image transformation options

## Setup Instructions

### 1. Cloudinary Account Setup
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Update the environment variables:

**Backend (.env):**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key_here
```

### 2. Database Migration
The system automatically adds Cloudinary public ID fields to existing entities:
- `users.profile_picture_public_id`
- `providers.logo_public_id`
- `providers.cover_image_public_id`
- `services.images_public_ids`

### 3. Backend Integration

#### Cloudinary Service Usage
```typescript
import { CloudinaryService } from '../modules/cloudinary/cloudinary.service';

// Upload from file buffer
const result = await this.cloudinaryService.uploadImage(
  file,
  'reservista/profiles/user123',
  this.cloudinaryService.getProfileImageTransformation()
);

// Upload from URL
const result = await this.cloudinaryService.uploadImageFromUrl(
  'https://example.com/image.jpg',
  'reservista/services',
  this.cloudinaryService.getServiceImageTransformation()
);

// Delete image
await this.cloudinaryService.deleteImage('reservista/profiles/user123/image_id');
```

#### Available Endpoints
- `POST /api/v1/upload/profile-image`
- `POST /api/v1/upload/service-image`
- `POST /api/v1/upload/shop-logo`
- `POST /api/v1/upload/shop-cover`
- `POST /api/v1/upload/upload-from-url`
- `DELETE /api/v1/upload/image/:publicId`

### 4. Frontend Integration

#### Using the ImageUpload Component
```tsx
import { ImageUpload } from '../components/ImageUpload';

<ImageUpload
  currentImageUrl={currentImageUrl}
  currentPublicId={currentPublicId}
  uploadType="profile-image"
  userId="user-id"
  transformation="profileLarge"
  onUploadSuccess={(data) => {
    // Handle successful upload
    console.log('Uploaded:', data.url, data.publicId);
  }}
  onUploadError={(error) => {
    // Handle upload error
    console.error('Upload failed:', error);
  }}
/>
```

#### Using the CloudinaryImage Component
```tsx
import { CloudinaryImage } from '../components/CloudinaryImage';

<CloudinaryImage
  publicId="reservista/profiles/user123/avatar"
  alt="User Profile"
  transformation="profileThumbnail"
  className="w-32 h-32 rounded-full"
  fallbackSrc="/default-avatar.png"
/>
```

#### Using the Custom Hook
```tsx
import { useImageUpload } from '../hooks/useImageUpload';

const { uploadImage, uploading, deleteImage } = useImageUpload();

const handleUpload = async (file: File) => {
  try {
    const result = await uploadImage(file, {
      endpoint: 'profile-image',
      userId: 'user-123',
      onSuccess: (data) => console.log('Success:', data),
      onError: (error) => console.error('Error:', error)
    });
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

## Image Transformations

### Predefined Transformations
- **Profile Thumbnail**: 100x100, face-centered, optimized
- **Profile Large**: 400x400, face-centered, optimized
- **Service Thumbnail**: 300x200, cropped and optimized
- **Service Large**: 800x600, cropped and optimized
- **Shop Logo**: 150x150, cropped and optimized
- **Shop Cover**: 1200x400, cropped and optimized
- **Shop Cover Mobile**: 800x300, cropped and optimized

### Custom Transformations
```typescript
import { buildCloudinaryUrl } from '../lib/cloudinary';

const customUrl = buildCloudinaryUrl(publicId, {
  width: 500,
  height: 300,
  crop: 'fill',
  quality: 'auto',
  format: 'webp'
});
```

## File Organization

Cloudinary folders are organized as:
```
reservista/
├── profiles/
│   └── {userId}/
│       └── profile_images
├── services/
│   └── {providerId}/
│       └── service_images
└── shops/
    └── {providerId}/
        ├── logo/
        └── cover/
```

## Security Features

- **File Type Validation**: Only image files accepted
- **File Size Limits**: Configurable size limits (default 5MB)
- **Secure Upload**: All uploads go through authenticated endpoints
- **Public ID Management**: Structured naming prevents conflicts
- **Error Handling**: Comprehensive error handling and user feedback

## Testing

Visit the test page to try the Cloudinary integration:
```
http://localhost:3000/test/cloudinary
```

## API Documentation

The Swagger documentation is automatically generated and includes all upload endpoints:
```
http://localhost:8000/api/docs
```

## Troubleshooting

### Common Issues

1. **Environment Variables**: Ensure all Cloudinary credentials are set correctly
2. **CORS Issues**: Make sure backend allows requests from frontend domain
3. **File Size**: Check that files don't exceed the configured size limit
4. **Network Issues**: Verify internet connection for Cloudinary uploads

### Error Codes
- `400 Bad Request`: Invalid file type or size
- `401 Unauthorized`: Missing or invalid Cloudinary credentials
- `413 Payload Too Large`: File exceeds size limit
- `500 Internal Server Error`: Cloudinary service error

## Performance Optimization

- **Automatic Format Selection**: Cloudinary automatically selects optimal format
- **Quality Optimization**: Auto quality based on content and viewport
- **Responsive Images**: Multiple sizes generated automatically
- **CDN Delivery**: Global CDN for fast image delivery
- **Lazy Loading**: Built-in lazy loading support

## Best Practices

1. **Always use transformations** for consistent image sizes
2. **Set appropriate quality levels** to balance file size and quality
3. **Use meaningful folder structures** for better organization
4. **Clean up unused images** regularly to manage storage costs
5. **Test with various file types and sizes** during development
6. **Monitor Cloudinary usage** through their dashboard

## Migration from Local Images

To migrate existing local images to Cloudinary:

1. Use the `upload-from-url` endpoint to migrate existing images
2. Update database records with new Cloudinary URLs and public IDs
3. Gradually phase out local image storage

## Support

For additional support:
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary React SDK](https://cloudinary.com/documentation/react_integration)
- [NestJS File Upload](https://docs.nestjs.com/techniques/file-upload)

---

*This integration provides a complete, production-ready image management solution for the Reservista platform.*
