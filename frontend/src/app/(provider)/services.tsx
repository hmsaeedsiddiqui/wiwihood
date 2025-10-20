import { skipToken } from '@reduxjs/toolkit/query';

import DashboardLayout from '../components/DashboardLayout';
import { useGetProviderInfoQuery, useGetServicesByProviderQuery } from '@/store/api/servicesApi';
import { skipToken } from '@reduxjs/toolkit/query';

export default function ProviderServices() {
  // Get current provider info (assumes authenticated)
  const { data: provider, isLoading: loadingProvider, error: providerError } = useGetProviderInfoQuery();
  const providerId = provider?.id;

  // Fetch provider's services
  const { data: services = [], isLoading, error } = useGetServicesByProviderQuery(
    providerId ? { providerId } : skipToken
  );

  return (
    <DashboardLayout role="provider">
      <div style={{ padding: 40 }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 24 }}>Manage Services</h1>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: 24 }}>
          {loadingProvider && <div>Loading provider info...</div>}
          {providerError && <div style={{ color: 'red' }}>Failed to load provider info.</div>}
          {isLoading && <div>Loading services...</div>}
          {error && <div style={{ color: 'red' }}>Failed to load services.</div>}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 700 }}>Service Name</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 700 }}>Category</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 700 }}>Price</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 700 }}>Duration</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 700 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(services) && services.length > 0 ? (
                services.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '10px 8px' }}>{s.name}</td>
                    <td style={{ padding: '10px 8px' }}>{s.category?.name || 'N/A'}</td>
                    <td style={{ padding: '10px 8px' }}>${s.basePrice}</td>
                    <td style={{ padding: '10px 8px' }}>{s.durationMinutes} min</td>
                    <td style={{ padding: '10px 8px' }}>
                      <button style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 700, marginRight: 8, cursor: 'pointer' }}>Edit</button>
                      <button style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 700, cursor: 'pointer' }}>Remove</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>No services found.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div style={{ marginTop: 24 }}>
            <button style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontWeight: 800, fontSize: 16, cursor: 'pointer' }}>Add New Service</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
