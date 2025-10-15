'use client';

import React, { useState } from 'react';
import { CloudinaryImage } from './cloudinary/CloudinaryImage';

export const CloudinaryDebug: React.FC = () => {
  const [testImageId, setTestImageId] = useState('reservista/services/pkz20qnzuun7pltjpsur');
  const [cloudName, setCloudName] = useState(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'reservista');

  const clearAllCaches = () => {
    // Clear localStorage
    localStorage.clear();
    // Clear sessionStorage  
    sessionStorage.clear();
    // Clear any RTK Query cache
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const testUrls = [
    // Test with your problematic image
    'reservista/services/pkz20qnzuun7pltjpsur',
    // Test without folder structure
    'pkz20qnzuun7pltjpsur',
    // Test a simple URL
    'sample',
    // Test with different folder
    'wiwihood/services/pkz20qnzuun7pltjpsur'
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Cloudinary Debug Tool</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cloud Name: {cloudName}
        </label>
        <input
          type="text"
          value={cloudName}
          onChange={(e) => setCloudName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Enter Cloudinary cloud name"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Test Image Public ID:
        </label>
        <input
          type="text"
          value={testImageId}
          onChange={(e) => setTestImageId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Enter image public ID to test"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Testing Different URL Patterns:</h3>
        
        {testUrls.map((publicId, index) => {
          const fullUrl = `https://res.cloudinary.com/${cloudName}/image/upload/w_100,h_100,c_fill,q_auto,f_auto/${publicId}`;
          
          return (
            <div key={index} className="border p-4 rounded-lg">
              <h4 className="font-medium mb-2">Test {index + 1}: {publicId}</h4>
              <p className="text-sm text-gray-600 mb-2 break-all">URL: {fullUrl}</p>
              
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm font-medium mb-1">CloudinaryImage Component:</p>
                  <CloudinaryImage
                    src={publicId}
                    alt={`Test image ${index + 1}`}
                    width={100}
                    height={100}
                    className="border border-gray-300 rounded"
                  />
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Direct IMG tag:</p>
                  <img
                    src={fullUrl}
                    alt={`Direct test ${index + 1}`}
                    width={100}
                    height={100}
                    className="border border-gray-300 rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.backgroundColor = '#fee2e2';
                      target.style.color = '#dc2626';
                      target.alt = '❌ Failed to load';
                    }}
                    onLoad={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.backgroundColor = '#dcfce7';
                      target.style.border = '2px solid #16a34a';
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        <div className="border p-4 rounded-lg bg-blue-50">
          <h4 className="font-medium mb-2">Custom Test:</h4>
          <p className="text-sm text-gray-600 mb-2 break-all">
            URL: https://res.cloudinary.com/{cloudName}/image/upload/w_100,h_100,c_fill,q_auto,f_auto/{testImageId}
          </p>
          
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm font-medium mb-1">CloudinaryImage Component:</p>
              <CloudinaryImage
                src={testImageId}
                alt="Custom test image"
                width={100}
                height={100}
                className="border border-gray-300 rounded"
              />
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Direct IMG tag:</p>
              <img
                src={`https://res.cloudinary.com/${cloudName}/image/upload/w_100,h_100,c_fill,q_auto,f_auto/${testImageId}`}
                alt="Custom direct test"
                width={100}
                height={100}
                className="border border-gray-300 rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.backgroundColor = '#fee2e2';
                  target.style.color = '#dc2626';
                  target.alt = '❌ Failed to load';
                }}
                onLoad={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.backgroundColor = '#dcfce7';
                  target.style.border = '2px solid #16a34a';
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Debug Information:</h4>
          <ul className="text-sm space-y-1">
            <li><strong>Environment:</strong> {process.env.NODE_ENV}</li>
            <li><strong>Cloud Name from ENV:</strong> {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}</li>
            <li><strong>Current Test Cloud Name:</strong> {cloudName}</li>
            <li><strong>Original Failing URL:</strong> https://res.cloudinary.com/wiwihood/image/upload/w_100,h_100,c_fill,q_auto,f_auto/reservista/services/pkz20qnzuun7pltjpsur</li>
          </ul>
          
          <div className="mt-4">
            <button
              onClick={clearAllCaches}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              🗑️ Clear All Caches & Reload
            </button>
            <p className="text-xs text-gray-600 mt-2">
              This will clear localStorage, sessionStorage, and reload the page
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};