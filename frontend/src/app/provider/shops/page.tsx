"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ImageUpload } from "@/components/cloudinary/ImageUpload";
import { CloudinaryImage } from "@/components/cloudinary/CloudinaryImage";

interface Shop {
  id: string;
  businessName: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  website?: string;
  logo?: string;
  coverImage?: string;
  status: string;
  createdAt: string;
}

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phone: "",
    website: "",
    providerType: "individual",
    logo: "",
    coverImage: ""
  });

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const token = localStorage.getItem('providerToken');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/providers/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      
      // For now, we'll treat the provider profile as a "shop"
      // In a real app, you might have multiple shops per provider
      if (response.data) {
        setShops([response.data]);
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
      setError('Failed to load shops');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem('providerToken');
      
      // Clean the data before sending
      const submitData = {
        ...formData,
        // Remove website if empty (backend expects valid URL or no website)
        website: formData.website.trim() === '' ? undefined : formData.website
      };
      
      if (editingShop) {
        // Update existing shop
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/providers/me`,
          submitData,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      } else {
        // Create new shop/provider profile
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/providers`,
          submitData,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      }

      // Reset form and refresh list
      setFormData({
        businessName: "",
        description: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        phone: "",
        website: "",
        providerType: "individual",
        logo: "",
        coverImage: ""
      });
      setShowCreateForm(false);
      setEditingShop(null);
      await fetchShops();
    } catch (error: any) {
      console.error('Error saving shop:', error);
      setError(error.response?.data?.message || 'Failed to save shop');
    }
  };

  const handleEdit = (shop: Shop) => {
    setEditingShop(shop);
    setFormData({
      businessName: shop.businessName,
      description: shop.description || "",
      address: shop.address,
      city: shop.city || "",
      state: shop.state || "",
      country: shop.country || "",
      postalCode: shop.postalCode || "",
      phone: shop.phone || "",
      website: shop.website || "",
      providerType: "individual",
      logo: shop.logo || "",
      coverImage: shop.coverImage || ""
    });
    setShowCreateForm(true);
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingShop(null);
    setFormData({
      businessName: "",
      description: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      phone: "",
      website: "",
      providerType: "individual",
      logo: "",
      coverImage: ""
    });
    setError("");
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '16px', color: '#6b7280' }}>Loading shops...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px' 
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            Shop Management
          </h1>
          <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>
            Manage your business profile and shop information
          </p>
        </div>
        
        {shops.length === 0 && (
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '16px' }}>+</span>
            Create Shop Profile
          </button>
        )}
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
            {editingShop ? 'Edit Shop Profile' : 'Create Shop Profile'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {/* Business Name */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter business name"
                />
              </div>

              {/* Phone */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter phone number"
                />
              </div>

              {/* Country */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  Country *
                </label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter country"
                />
              </div>

              {/* Website */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            {/* Address */}
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="Enter full address"
              />
            </div>

            {/* City, State, Country, Postal Code */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="City"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="State"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  Country *
                </label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="Country"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  Postal Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="Postal Code"
                />
              </div>
            </div>

            {/* Description */}
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder="Describe your business..."
              />
            </div>

            {/* Logo Image */}
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                Business Logo
              </label>
              <div style={{ marginBottom: '12px' }}>
                <ImageUpload
                  uploadType="shop"
                  onImageUploaded={(publicId: string) => {
                    setFormData({
                      ...formData,
                      logo: publicId
                    });
                  }}
                  maxFiles={1}
                />
              </div>
              
              {/* Display current logo */}
              {formData.logo && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{ position: 'relative', width: '120px' }}>
                    <CloudinaryImage
                      src={formData.logo}
                      alt="Business logo"
                      width={120}
                      height={120}
                      style={{ borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          logo: ""
                        });
                      }}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(239, 68, 68, 0.9)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Remove logo"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cover Image */}
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                Cover Image
              </label>
              <div style={{ marginBottom: '12px' }}>
                <ImageUpload
                  uploadType="shop"
                  onImageUploaded={(publicId: string) => {
                    setFormData({
                      ...formData,
                      coverImage: publicId
                    });
                  }}
                  maxFiles={1}
                />
              </div>
              
              {/* Display current cover image */}
              {formData.coverImage && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{ position: 'relative', width: '300px' }}>
                    <CloudinaryImage
                      src={formData.coverImage}
                      alt="Cover image"
                      width={300}
                      height={180}
                      style={{ borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          coverImage: ""
                        });
                      }}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(239, 68, 68, 0.9)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Remove cover image"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {editingShop ? 'Update Profile' : 'Create Profile'}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Shops List */}
      {shops.length > 0 ? (
        <div style={{ display: 'grid', gap: '20px' }}>
          {shops.map((shop) => (
            <div
              key={shop.id}
              style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0' }}>
                    {shop.businessName}
                  </h3>
                  
                  {shop.description && (
                    <p style={{ color: '#6b7280', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                      {shop.description}
                    </p>
                  )}
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div>
                      <strong style={{ fontSize: '14px', color: '#374151' }}>Address:</strong>
                      <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                        {shop.address}
                        {shop.city && `, ${shop.city}`}
                        {shop.state && `, ${shop.state}`}
                        {shop.postalCode && ` ${shop.postalCode}`}
                        {shop.country && `, ${shop.country}`}
                      </p>
                    </div>
                    
                    {shop.phone && (
                      <div>
                        <strong style={{ fontSize: '14px', color: '#374151' }}>Phone:</strong>
                        <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                          {shop.phone}
                        </p>
                      </div>
                    )}
                    
                    {shop.website && (
                      <div>
                        <strong style={{ fontSize: '14px', color: '#374151' }}>Website:</strong>
                        <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                          <a href={shop.website} target="_blank" rel="noopener noreferrer" style={{ color: '#22c55e' }}>
                            {shop.website}
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Shop Images */}
                  {(shop.logo || shop.coverImage) && (
                    <div style={{ marginTop: '16px' }}>
                      <strong style={{ fontSize: '14px', color: '#374151', display: 'block', marginBottom: '8px' }}>
                        Images:
                      </strong>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {shop.logo && (
                          <div>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Logo:</p>
                            <CloudinaryImage
                              src={shop.logo}
                              alt="Business logo"
                              width={80}
                              height={80}
                              style={{ borderRadius: '6px', objectFit: 'cover' }}
                            />
                          </div>
                        )}
                        {shop.coverImage && (
                          <div>
                            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Cover:</p>
                            <CloudinaryImage
                              src={shop.coverImage}
                              alt="Cover image"
                              width={120}
                              height={80}
                              style={{ borderRadius: '6px', objectFit: 'cover' }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div style={{ marginTop: '16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      backgroundColor: shop.status === 'verified' ? '#dcfce7' : '#fef3c7',
                      color: shop.status === 'verified' ? '#16a34a' : '#d97706',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}>
                      {shop.status || 'Pending'}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleEdit(shop)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    marginLeft: '16px'
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : !showCreateForm && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏪</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            No Shop Profile Found
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            Create your business profile to start offering services
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Create Shop Profile
          </button>
        </div>
      )}
    </div>
  );
}
