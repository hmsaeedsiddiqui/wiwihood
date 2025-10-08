"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiService, Provider } from "@/lib/api";
import Link from "next/link";
import { CloudinaryImage } from "@/components/CloudinaryImage";

export default function ProviderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProvider() {
      setLoading(true);
      try {
        // There is no getProviderById in apiService, so fetch all and filter (for now)
        const result = await apiService.getProviders();
        const found = (result.providers || []).find((p: Provider) => p.id === id);
        setProvider(found || null);
      } catch (e) {
        setProvider(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProvider();
  }, [id]);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 60 }}>Loading provider...</div>;
  }
  if (!provider) {
    return <div style={{ textAlign: 'center', marginTop: 60, color: '#ef4444' }}>Provider not found.</div>;
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'Manrope, sans-serif', padding: '60px 0' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
        <Link href="/providers" style={{ color: '#10b981', fontWeight: 600, fontSize: 16, textDecoration: 'none', marginBottom: 24, display: 'inline-block' }}>&larr; Back to Providers</Link>
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', padding: 40, display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ height: 180, width: '100%', borderRadius: 12, marginBottom: 24, overflow: 'hidden', background: '#f3f4f6' }}>
              {provider.coverImagePublicId ? (
                <CloudinaryImage
                  publicId={provider.coverImagePublicId}
                  alt={`${provider.businessName} cover image`}
                  width={300}
                  height={180}
                  className="w-full h-full object-cover"
                />
              ) : provider.logoPublicId ? (
                <CloudinaryImage
                  publicId={provider.logoPublicId}
                  alt={`${provider.businessName} logo`}
                  width={300}
                  height={180}
                  className="w-full h-full object-contain bg-gray-100"
                />
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280',
                  fontSize: '48px',
                  fontWeight: 'bold'
                }}>
                  {provider.businessName.charAt(0)}
                </div>
              )}
            </div>
            <div style={{ color: '#6b7280', fontSize: 16, marginBottom: 8 }}>Verified: {provider.isVerified ? 'Yes' : 'No'}</div>
            <div style={{ color: '#6b7280', fontSize: 16, marginBottom: 8 }}>Rating: {provider.averageRating} ({provider.totalReviews} reviews)</div>
          </div>
          <div style={{ flex: 2, minWidth: 260 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#222', marginBottom: 16 }}>{provider.businessName}</h1>
            <div style={{ color: '#6b7280', fontSize: 18, marginBottom: 16 }}>{provider.businessDescription}</div>
            <div style={{ color: '#6b7280', fontSize: 16, marginBottom: 8 }}>Address: {provider.businessAddress}, {provider.businessCity}</div>
            <div style={{ color: '#6b7280', fontSize: 16, marginBottom: 8 }}>Phone: {provider.businessPhoneNumber || 'N/A'}</div>
            <div style={{ color: '#6b7280', fontSize: 16, marginBottom: 8 }}>Email: {provider.businessEmail || 'N/A'}</div>
            <div style={{ color: '#6b7280', fontSize: 16, marginBottom: 8 }}>Website: {provider.websiteUrl ? <a href={provider.websiteUrl} target="_blank" rel="noopener noreferrer">{provider.websiteUrl}</a> : 'N/A'}</div>
            <div style={{ color: '#6b7280', fontSize: 16, marginBottom: 24 }}>Owner: {provider.user?.firstName} {provider.user?.lastName}</div>
            
            {/* Message Provider Button */}
            <div style={{ marginBottom: 24 }}>
              <button
                onClick={() => {
                  router.push(`/customer/messages?providerId=${provider.id}`);
                }}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginRight: '12px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }}
              >
                💬 Message Provider
              </button>
              
              <button
                onClick={() => {
                  router.push(`/shop/${provider.id}`);
                }}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                }}
              >
                🏪 View Shop
              </button>
            </div>
            {/* List services offered by this provider */}
            <div style={{ marginTop: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#222', marginBottom: 12 }}>Services Offered</h2>
              {provider.services && provider.services.length > 0 ? (
                <ul style={{ paddingLeft: 18 }}>
                  {provider.services.map((service) => (
                    <li key={service.id} style={{ marginBottom: 8 }}>
                      <Link href={`/services/${service.id}`} style={{ color: '#10b981', fontWeight: 600, textDecoration: 'none' }}>{service.name}</Link> - ${service.basePrice} ({service.duration} min)
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ color: '#6b7280', fontSize: 16 }}>No services listed.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
