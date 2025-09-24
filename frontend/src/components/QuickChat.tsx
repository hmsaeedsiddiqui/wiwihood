'use client';

import { MessageCircle, Phone, Video } from 'lucide-react';

interface QuickChatProps {
  isVisible: boolean;
  onToggle: () => void;
  unreadCount?: number;
}

export function QuickChat({ isVisible, onToggle, unreadCount = 0 }: QuickChatProps) {
  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onToggle}
          className="relative bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Quick Chat Panel */}
      {isVisible && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Messages</h3>
              <div className="flex space-x-2">
                <button className="p-1 hover:bg-blue-700 rounded">
                  <Phone className="h-4 w-4" />
                </button>
                <button className="p-1 hover:bg-blue-700 rounded">
                  <Video className="h-4 w-4" />
                </button>
                <button
                  onClick={onToggle}
                  className="p-1 hover:bg-blue-700 rounded text-white"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm mb-2">No active conversations</p>
              <button
                onClick={() => window.location.href = '/customer/messages'}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All Messages
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}