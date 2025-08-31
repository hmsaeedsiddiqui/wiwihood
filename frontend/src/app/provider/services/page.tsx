"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  category?: Category;
  serviceType: string;
  pricingType: string;
  basePrice: number;
  duration: number;
  isActive: boolean;
  status: string;
  images?: string[];
  createdAt: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [error, setError] = useState("");
  const [providerId, setProviderId] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    categoryId: "",
    serviceType: "appointment",
    pricingType: "fixed",
    basePrice: "",
    duration: "",
    isActive: true
  });

  useEffect(() => {
    fetchProviderInfo();
    fetchCategories();
    fetchServices();
  }, []);

  const fetchProviderInfo = async () => {
    try {
      const token = localStorage.getItem('providerToken');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/auth/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      
      if (response.data) {
        setProviderId(response.data.id);
      }
    } catch (error) {
      console.error('Error fetching provider info:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/categories`
      );
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchServices = async () => {
    try {
      if (!providerId) return;
      
      const token = localStorage.getItem('providerToken');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/services/provider/${providerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setServices(response.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (providerId) {
      fetchServices();
    }
  }, [providerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!providerId) {
      setError("Provider information not found");
      return;
    }

    try {
      const token = localStorage.getItem('providerToken');
      const submitData = {
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        duration: parseInt(formData.duration)
      };
      
      if (editingService) {
        // Update existing service
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/services/${editingService.id}`,
          submitData,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      } else {
        // Create new service
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/services/provider/${providerId}`,
          submitData,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      }

      // Reset form and refresh list
      resetForm();
      await fetchServices();
    } catch (error: any) {
      console.error('Error saving service:', error);
      setError(error.response?.data?.message || 'Failed to save service');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      shortDescription: service.shortDescription,
      categoryId: service.categoryId,
      serviceType: service.serviceType,
      pricingType: service.pricingType,
      basePrice: service.basePrice.toString(),
      duration: service.duration.toString(),
      isActive: service.isActive
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const token = localStorage.getItem('providerToken');
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/services/${serviceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      await fetchServices();
    } catch (error: any) {
      console.error('Error deleting service:', error);
      setError(error.response?.data?.message || 'Failed to delete service');
    }
  };

  const toggleServiceStatus = async (serviceId: string) => {
    try {
      const token = localStorage.getItem('providerToken');
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/services/${serviceId}/toggle-active`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      await fetchServices();
    } catch (error: any) {
      console.error('Error toggling service status:', error);
      setError(error.response?.data?.message || 'Failed to update service status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      shortDescription: "",
      categoryId: "",
      serviceType: "appointment",
      pricingType: "fixed",
      basePrice: "",
      duration: "",
      isActive: true
    });
    setShowCreateForm(false);
    setEditingService(null);
    setError("");
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '16px', color: '#6b7280' }}>Loading services...</div>
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
            Service Management
          </h1>
          <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>
            Create and manage your services
          </p>
        </div>
        
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
          Create Service
        </button>
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
            {editingService ? 'Edit Service' : 'Create New Service'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {/* Service Name */}
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter service name"
                />
              </div>

              {/* Category */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  Category *
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Type */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  Service Type *
                </label>
                <select
                  required
                  value={formData.serviceType}
                  onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="appointment">Appointment</option>
                  <option value="package">Package</option>
                  <option value="consultation">Consultation</option>
                </select>
              </div>

              {/* Pricing Type */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  Pricing Type *
                </label>
                <select
                  required
                  value={formData.pricingType}
                  onChange={(e) => setFormData({...formData, pricingType: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                  <option value="package">Package Deal</option>
                </select>
              </div>

              {/* Base Price */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  Base Price ($) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="0.00"
                />
              </div>

              {/* Duration */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  required
                  min="5"
                  step="5"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  placeholder="60"
                />
              </div>

              {/* Active Status */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: '600', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Active Service
                </label>
              </div>
            </div>

            {/* Short Description */}
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                Short Description *
              </label>
              <input
                type="text"
                required
                value={formData.shortDescription}
                onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="Brief description for listings"
                maxLength={100}
              />
            </div>

            {/* Full Description */}
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                Full Description *
              </label>
              <textarea
                required
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
                placeholder="Detailed description of your service..."
              />
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
                {editingService ? 'Update Service' : 'Create Service'}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
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

      {/* Services List */}
      {services.length > 0 ? (
        <div style={{ display: 'grid', gap: '20px' }}>
          {services.map((service) => (
            <div
              key={service.id}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
                      {service.name}
                    </h3>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      backgroundColor: service.isActive ? '#dcfce7' : '#fee2e2',
                      color: service.isActive ? '#16a34a' : '#dc2626',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p style={{ color: '#6b7280', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                    {service.shortDescription}
                  </p>
                  
                  {service.description && (
                    <p style={{ color: '#374151', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                      {service.description}
                    </p>
                  )}
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div>
                      <strong style={{ fontSize: '14px', color: '#374151' }}>Category:</strong>
                      <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                        {service.category?.name || 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <strong style={{ fontSize: '14px', color: '#374151' }}>Price:</strong>
                      <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                        ${service.basePrice} ({service.pricingType})
                      </p>
                    </div>
                    
                    <div>
                      <strong style={{ fontSize: '14px', color: '#374151' }}>Duration:</strong>
                      <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                        {service.duration} minutes
                      </p>
                    </div>
                    
                    <div>
                      <strong style={{ fontSize: '14px', color: '#374151' }}>Type:</strong>
                      <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px', textTransform: 'capitalize' }}>
                        {service.serviceType}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                  <button
                    onClick={() => toggleServiceStatus(service.id)}
                    style={{
                      backgroundColor: service.isActive ? '#fee2e2' : '#dcfce7',
                      color: service.isActive ? '#dc2626' : '#16a34a',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {service.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  
                  <button
                    onClick={() => handleEdit(service)}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#6b7280',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  
                  <button
                    onClick={() => handleDelete(service.id)}
                    style={{
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
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
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛠️</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            No Services Found
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            Create your first service to start accepting bookings
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
            Create Your First Service
          </button>
        </div>
      )}
    </div>
  );
}
