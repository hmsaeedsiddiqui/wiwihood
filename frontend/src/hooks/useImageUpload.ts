import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface UploadOptions {
  endpoint: 'profile-image' | 'service-image' | 'shop-logo' | 'shop-cover';
  userId?: string;
  serviceId?: string;
  providerId?: string;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
}

interface UploadFromUrlOptions {
  imageUrl: string;
  folder?: string;
  type?: 'profile' | 'service' | 'shop-logo' | 'shop-cover';
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
}

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '');
  const baseUrlHasApiPrefix = BASE_URL.endsWith('/api/v1');
  const apiPrefix = baseUrlHasApiPrefix ? '' : '/api/v1';
  const apiBase = `${BASE_URL}${apiPrefix}`; // Ensures exactly one /api/v1

  const uploadImage = useCallback(async (file: File, options: UploadOptions) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (options.userId) formData.append('userId', options.userId);
      if (options.serviceId) formData.append('serviceId', options.serviceId);
      if (options.providerId) formData.append('providerId', options.providerId);

      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const response = await fetch(`${apiBase}/upload/${options.endpoint}`, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type header, let the browser set it with boundary
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success('Image uploaded successfully!');
        if (options.onSuccess) {
          options.onSuccess(result.data);
        }
        return result.data;
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
      if (options.onError) {
        options.onError(error);
      }
      throw error;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, []);

  const uploadFromUrl = useCallback(async (options: UploadFromUrlOptions) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const response = await fetch(`${apiBase}/upload/upload-from-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          imageUrl: options.imageUrl,
          folder: options.folder || 'reservista',
          type: options.type || 'service',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success('Image uploaded successfully!');
        if (options.onSuccess) {
          options.onSuccess(result.data);
        }
        return result.data;
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
      if (options.onError) {
        options.onError(error);
      }
      throw error;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, []);

  const deleteImage = useCallback(async (publicId: string) => {
    try {
      // Encode the publicId to handle slashes in the URL
      const encodedPublicId = encodeURIComponent(publicId);
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const response = await fetch(`${apiBase}/upload/image/${encodedPublicId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Delete failed');
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success('Image deleted successfully!');
        return result.data;
      } else {
        throw new Error(result.message || 'Delete failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Delete failed');
      throw error;
    }
  }, []);

  return {
    uploadImage,
    uploadFromUrl,
    deleteImage,
    uploading,
    uploadProgress,
  };
};
