'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface GoogleCalendarSyncProps {
  onSyncComplete?: () => void;
}

export default function GoogleCalendarSync({ onSyncComplete }: GoogleCalendarSyncProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const token = localStorage.getItem('providerToken');
      const response = await fetch('http://localhost:8000/api/v1/calendar/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsConnected(data.connected);
        setLastSync(data.lastSync);
      }
    } catch (error) {
      console.error('Error checking calendar status:', error);
    }
  };

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('providerToken');
      const response = await fetch('http://localhost:8000/api/v1/calendar/auth-url', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Open Google OAuth in new window
        const authWindow = window.open(
          data.authUrl,
          'google-calendar-auth',
          'width=500,height=600,scrollbars=yes'
        );

        // Listen for auth completion
        const checkAuthComplete = setInterval(() => {
          if (authWindow?.closed) {
            clearInterval(checkAuthComplete);
            // Check if auth was successful
            setTimeout(() => {
              checkConnectionStatus();
            }, 1000);
          }
        }, 1000);
      } else {
        setError('Failed to get Google Calendar authorization URL');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to connect to Google Calendar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('providerToken');
      const response = await fetch('http://localhost:8000/api/v1/calendar/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setLastSync(new Date().toISOString());
        onSyncComplete?.();
      } else {
        setError('Failed to sync with Google Calendar');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to sync calendar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('providerToken');
      const response = await fetch('http://localhost:8000/api/v1/calendar/disconnect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setIsConnected(false);
        setLastSync(null);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to disconnect');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-medium text-gray-900">Google Calendar</h3>
            <p className="text-sm text-gray-500">
              {isConnected ? 'Connected' : 'Not connected'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isConnected ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-500" />
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {lastSync && (
        <div className="mb-4 text-sm text-gray-600">
          Last synced: {new Date(lastSync).toLocaleString()}
        </div>
      )}

      <div className="flex gap-2">
        {!isConnected ? (
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Calendar className="w-4 h-4" />
            )}
            Connect Google Calendar
          </button>
        ) : (
          <>
            <button
              onClick={handleSync}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              Sync Now
            </button>
            
            <button
              onClick={handleDisconnect}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Disconnect
            </button>
          </>
        )}
      </div>
    </div>
  );
}