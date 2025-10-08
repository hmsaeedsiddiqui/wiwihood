'use client';

import { useEffect, useState } from 'react';
import { getAuthToken, getAuthHeaders, isAuthenticated } from '@/lib/auth';

export default function AuthDebugPage() {
  const [authInfo, setAuthInfo] = useState<any>({});

  useEffect(() => {
    const checkAuth = () => {
      const info = {
        isAuthenticated: isAuthenticated(),
        token: getAuthToken(),
        headers: getAuthHeaders(),
        allTokens: {
          customerToken: localStorage.getItem('customerToken'),
          authToken: localStorage.getItem('auth-token'),
          providerToken: localStorage.getItem('providerToken'),
          token: localStorage.getItem('token')
        }
      };
      setAuthInfo(info);
    };

    checkAuth();
  }, []);

  const testMessageAPI = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/messages/conversations', {
        headers: getAuthHeaders()
      });
      
      console.log('API Test Response:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API Data:', data);
        alert('API Success: ' + JSON.stringify(data));
      } else {
        const errorText = await response.text();
        console.log('API Error:', errorText);
        alert('API Error: ' + response.status + ' - ' + errorText);
      }
    } catch (error) {
      console.error('API Error:', error);
      alert('API Error: ' + error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Authentication Debug</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Auth Status:</h2>
        <pre>{JSON.stringify(authInfo, null, 2)}</pre>
      </div>
      
      <button 
        onClick={testMessageAPI}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#0066cc', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
      >
        Test Messages API
      </button>
      
      <button 
        onClick={() => window.location.href = '/auth/customer/login'}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#00cc66', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Go to Customer Login
      </button>
    </div>
  );
}