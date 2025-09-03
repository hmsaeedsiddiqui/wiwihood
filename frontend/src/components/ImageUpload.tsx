'use client';

import { useState, useRef } from 'react';
import { CloudinaryImage } from './CloudinaryImage';
import { useImageUpload } from '../hooks/useImageUpload';
import { toast } from 'react-hot-toast';

interface ImageUploadProps {
  currentImageUrl?: string;
  currentPublicId?: string;
  uploadType: 'profile-image' | 'service-image' | 'shop-logo' | 'shop-cover';
  userId?: string;
  serviceId?: string;
  providerId?: string;
  onUploadSuccess?: (result: any) => void;
  onUploadError?: (error: any) => void;
  transformation?: string;
  className?: string;
  allowDrop?: boolean;
  maxFileSizeMB?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  currentPublicId,
  uploadType,
  userId,
  serviceId,
  providerId,
  onUploadSuccess,
  onUploadError,
  transformation = 'serviceThumbnail',
  className = '',
  allowDrop = true,
  maxFileSizeMB = 5,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const { uploadImage, uploading, deleteImage } = useImageUpload();

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return false;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSizeMB) {
      toast.error(`File size must be less than ${maxFileSizeMB}MB`);
      return false;
    }

    return true;
  };

  const handleFileSelect = async (file: File) => {
    if (!validateFile(file)) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const result = await uploadImage(file, {
        endpoint: uploadType,
        userId,
        serviceId,
        providerId,
        onSuccess: (data) => {
          setPreviewUrl('');
          if (onUploadSuccess) {
            onUploadSuccess(data);
          }
        },
        onError: (error) => {
          setPreviewUrl('');
          if (onUploadError) {
            onUploadError(error);
          }
        },
      });
    } catch (error) {
      setPreviewUrl('');
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (allowDrop) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (!allowDrop) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDelete = async () => {
    if (!currentPublicId) return;

    try {
      await deleteImage(currentPublicId);
      if (onUploadSuccess) {
        onUploadSuccess({ url: '', publicId: '' });
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const displayImageUrl = previewUrl || currentImageUrl;

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div
        className={`
          relative group cursor-pointer rounded-lg overflow-hidden border-2 border-dashed transition-all duration-200
          ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'pointer-events-none' : ''}
        `}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {displayImageUrl ? (
          <div className="relative">
            <CloudinaryImage
              src={displayImageUrl}
              publicId={previewUrl ? undefined : currentPublicId}
              alt="Upload preview"
              transformation={transformation as any}
              className="w-full h-48 object-cover"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                  className="px-3 py-1 bg-white text-gray-700 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Change
                </button>
                {currentPublicId && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <div className="text-sm">Uploading...</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500">
            {uploading ? (
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
                <div className="text-sm">Uploading...</div>
              </div>
            ) : (
              <>
                <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <div className="text-center">
                  <div className="text-sm font-medium">Click to upload or drag and drop</div>
                  <div className="text-xs text-gray-400">PNG, JPG up to {maxFileSizeMB}MB</div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
