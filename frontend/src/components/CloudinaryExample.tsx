'use client';

import { useState } from 'react';
import { ImageUpload } from './ImageUpload';
import { CloudinaryImage } from './CloudinaryImage';
import { toast, Toaster } from 'react-hot-toast';

export const CloudinaryExample: React.FC = () => {
  const [profileImage, setProfileImage] = useState({
    url: '',
    publicId: '',
  });
  
  const [serviceImage, setServiceImage] = useState({
    url: '',
    publicId: '',
  });
  
  const [shopLogo, setShopLogo] = useState({
    url: '',
    publicId: '',
  });
  
  const [shopCover, setShopCover] = useState({
    url: '',
    publicId: '',
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Toaster position="top-right" />
      
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Cloudinary Image Management
        </h1>
        <p className="text-gray-600">
          Upload and manage images with automatic optimization and transformations
        </p>
      </div>

      {/* Profile Image Upload */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Profile Image Upload</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Upload</h3>
            <ImageUpload
              currentImageUrl={profileImage.url}
              currentPublicId={profileImage.publicId}
              uploadType="profile-image"
              userId="123e4567-e89b-12d3-a456-426614174000"
              transformation="profileLarge"
              onUploadSuccess={(data) => {
                setProfileImage({
                  url: data.url,
                  publicId: data.publicId,
                });
              }}
              className="w-full"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
            {profileImage.url && (
              <CloudinaryImage
                src={profileImage.url}
                publicId={profileImage.publicId}
                alt="Profile Image"
                transformation="profileLarge"
                className="w-48 h-48 rounded-full border-4 border-white shadow-lg"
              />
            )}
          </div>
        </div>
      </div>

      {/* Service Image Upload */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Service Image Upload</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Upload</h3>
            <ImageUpload
              currentImageUrl={serviceImage.url}
              currentPublicId={serviceImage.publicId}
              uploadType="service-image"
              serviceId="service-123"
              providerId="f7577fe5-0cb8-4509-83ce-89f27fd5ed60"
              transformation="serviceLarge"
              onUploadSuccess={(data) => {
                setServiceImage({
                  url: data.url,
                  publicId: data.publicId,
                });
              }}
              className="w-full"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
            {serviceImage.url && (
              <CloudinaryImage
                src={serviceImage.url}
                publicId={serviceImage.publicId}
                alt="Service Image"
                transformation="serviceLarge"
                className="w-full h-48 rounded-lg shadow-md"
              />
            )}
          </div>
        </div>
      </div>

      {/* Shop Logo Upload */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Shop Logo Upload</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Upload</h3>
            <ImageUpload
              currentImageUrl={shopLogo.url}
              currentPublicId={shopLogo.publicId}
              uploadType="shop-logo"
              providerId="f7577fe5-0cb8-4509-83ce-89f27fd5ed60"
              transformation="shopLogo"
              onUploadSuccess={(data) => {
                setShopLogo({
                  url: data.url,
                  publicId: data.publicId,
                });
              }}
              className="w-full"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
            {shopLogo.url && (
              <CloudinaryImage
                src={shopLogo.url}
                publicId={shopLogo.publicId}
                alt="Shop Logo"
                transformation="shopLogo"
                className="w-32 h-32 rounded-lg shadow-md"
              />
            )}
          </div>
        </div>
      </div>

      {/* Shop Cover Upload */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Shop Cover Image Upload</h2>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Upload</h3>
            <ImageUpload
              currentImageUrl={shopCover.url}
              currentPublicId={shopCover.publicId}
              uploadType="shop-cover"
              providerId="f7577fe5-0cb8-4509-83ce-89f27fd5ed60"
              transformation="shopCover"
              onUploadSuccess={(data) => {
                setShopCover({
                  url: data.url,
                  publicId: data.publicId,
                });
              }}
              className="w-full"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
            {shopCover.url && (
              <CloudinaryImage
                src={shopCover.url}
                publicId={shopCover.publicId}
                alt="Shop Cover"
                transformation="shopCover"
                className="w-full h-64 rounded-lg shadow-md"
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Feature List */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Automatic image optimization
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Multiple transformation presets
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Drag and drop upload
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Image validation
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Secure cloud storage
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Responsive images
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Upload progress tracking
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Error handling
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
