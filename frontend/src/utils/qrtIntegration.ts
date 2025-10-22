// QRT Integration Service - Quick Real-Time API Integration
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export class QRTIntegration {
  
  // Notifications QRT
  static async getNotifications() {
    return this.qrtCall('/notifications', [
      {
        id: '1',
        title: 'New Appointment Booked',
        message: 'Sarah Johnson has booked Hair Styling for tomorrow at 2:00 PM',
        type: 'booking',
        timestamp: new Date().toISOString(),
        read: false
      },
      {
        id: '2',
        title: 'Payment Received',
        message: 'Payment of $85 received for appointment #1234',
        type: 'payment',
        timestamp: new Date().toISOString(),
        read: false
      }
    ]);
  }

  // Generic QRT method with smart error handling
  static async qrtCall(endpoint: string, fallbackData: any, options: any = {}) {
    try {
      const response = await axios.get(`${API_BASE}${endpoint}`, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      if (response.data) {
        console.log(`✅ QRT: Live data loaded from ${endpoint}`);
        return response.data;
      }
    } catch (error: any) {
      console.log(`⚠️ QRT: API call failed for ${endpoint}, using fallback`);
    }
    
    return fallbackData;
  }

  // Dashboard Stats QRT
  static async getDashboardStats() {
    return this.qrtCall('/dashboard/stats', {
      totalRevenue: 15420,
      totalAppointments: 156,
      totalCustomers: 89,
      growthRate: 12.5
    });
  }

  // Appointments QRT - Enhanced with multiple endpoint attempts
  static async getAppointments() {
    try {
      // Try multiple endpoints to get appointments
      const endpoints = [
        '/appointments',
        '/appointments?status=active',
        '/api/appointments',
        '/bookings',
        '/public/appointments'
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Fetching appointments from: ${API_BASE}${endpoint}`);
          const response = await axios.get(`${API_BASE}${endpoint}`, {
            timeout: 15000,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
          
          if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            console.log('Backend appointments loaded:', response.data.length, 'appointments');
            return response.data.map((appointment: any) => ({
              ...appointment,
              id: appointment.id || appointment._id,
              customerName: appointment.customerName || appointment.customer?.name || 'Unknown Customer',
              serviceName: appointment.serviceName || appointment.service?.name || 'Unknown Service',
              scheduledAt: appointment.scheduledAt || appointment.date || new Date().toISOString(),
              status: appointment.status || 'confirmed'
            }));
          } else if (response.data && response.data.appointments && Array.isArray(response.data.appointments)) {
            console.log('Backend appointments loaded from nested:', response.data.appointments.length, 'appointments');
            return response.data.appointments.map((appointment: any) => ({
              ...appointment,
              id: appointment.id || appointment._id,
              customerName: appointment.customerName || appointment.customer?.name || 'Unknown Customer',
              serviceName: appointment.serviceName || appointment.service?.name || 'Unknown Service',
              scheduledAt: appointment.scheduledAt || appointment.date || new Date().toISOString(),
              status: appointment.status || 'confirmed'
            }));
          }
        } catch (error: any) {
          console.log(`Failed to fetch appointments from ${endpoint}:`, error.message);
          continue;
        }
      }
      
      // If all API calls fail, return empty array instead of fallback data
      console.log('All appointment API endpoints failed, returning empty array');
      return [];
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  }

  // Staff QRT
  static async getStaff() {
    return this.qrtCall('/staff', [
      {
        id: '1',
        name: 'Maria Rodriguez',
        role: 'Senior Hair Stylist',
        email: 'maria@wiwihood.com',
        phone: '+1 (555) 123-4567',
        avatar: '/staff1.jpg',
        specialties: ['Hair Cutting', 'Hair Coloring', 'Hair Styling'],
        status: 'active',
        rating: 4.9,
        experience: '8 years'
      }
    ]);
  }

  // Services QRT - Enhanced with multiple endpoint attempts and dynamic processing
  static async getServices() {
    try {
      // Try multiple endpoints to get services
      const endpoints = [
        '/services',
        '/services?isActive=true',
        '/api/services',
        '/public/services'
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Fetching services from: ${API_BASE}${endpoint}`);
          const response = await axios.get(`${API_BASE}${endpoint}`, {
            timeout: 15000,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
          
          if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            console.log('✅ Backend services loaded:', response.data.length, 'services');
            
            // Process and enhance service data
            return response.data.map((service: any) => ({
              ...service,
              id: service.id || service._id,
              name: service.name || service.title || 'Unnamed Service',
              description: service.description || service.longDescription || 'No description available',
              shortDescription: service.shortDescription || service.summary || service.description?.substring(0, 100) || 'Brief service description',
              price: service.price || service.basePrice || service.cost || 0,
              duration: service.duration || service.durationMinutes || 60,
              category: service.category || service.categoryName || 'General',
              categoryId: service.categoryId || service.category_id || 'general',
              images: service.images && Array.isArray(service.images) ? service.images : 
                      service.image ? [service.image] :
                      service.thumbnail ? [service.thumbnail] :
                      service.photo ? [service.photo] : [],
              isActive: service.isActive !== undefined ? service.isActive : true,
              status: service.status || 'active'
            }));
          } else if (response.data && response.data.services && Array.isArray(response.data.services)) {
            console.log('✅ Backend services loaded from nested:', response.data.services.length, 'services');
            return response.data.services.map((service: any) => ({
              ...service,
              id: service.id || service._id,
              name: service.name || service.title || 'Unnamed Service',
              description: service.description || service.longDescription || 'No description available',
              shortDescription: service.shortDescription || service.summary || service.description?.substring(0, 100) || 'Brief service description',
              price: service.price || service.basePrice || service.cost || 0,
              duration: service.duration || service.durationMinutes || 60,
              category: service.category || service.categoryName || 'General',
              categoryId: service.categoryId || service.category_id || 'general',
              images: service.images && Array.isArray(service.images) ? service.images : 
                      service.image ? [service.image] :
                      service.thumbnail ? [service.thumbnail] :
                      service.photo ? [service.photo] : [],
              isActive: service.isActive !== undefined ? service.isActive : true,
              status: service.status || 'active'
            }));
          } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
            console.log('✅ Backend services loaded from data field:', response.data.data.length, 'services');
            return response.data.data.map((service: any) => ({
              ...service,
              id: service.id || service._id,
              name: service.name || service.title || 'Unnamed Service',
              description: service.description || service.longDescription || 'No description available',
              shortDescription: service.shortDescription || service.summary || service.description?.substring(0, 100) || 'Brief service description',
              price: service.price || service.basePrice || service.cost || 0,
              duration: service.duration || service.durationMinutes || 60,
              category: service.category || service.categoryName || 'General',
              categoryId: service.categoryId || service.category_id || 'general',
              images: service.images && Array.isArray(service.images) ? service.images : 
                      service.image ? [service.image] :
                      service.thumbnail ? [service.thumbnail] :
                      service.photo ? [service.photo] : [],
              isActive: service.isActive !== undefined ? service.isActive : true,
              status: service.status || 'active'
            }));
          }
        } catch (error: any) {
          console.log(`Failed to fetch services from ${endpoint}:`, error.message);
          continue;
        }
      }
      
      // If all API calls fail, return empty array instead of fallback data
      console.log('⚠️ All service API endpoints failed, returning empty array');
      return [];
    } catch (error: any) {
      console.error('❌ Error fetching services:', error);
      return [];
    }
  }

  // Services by Category QRT - Enhanced with multiple endpoint attempts
  static async getServicesByCategory(categoryId: string) {
    try {
      // Try multiple endpoints for category-specific services
      const endpoints = [
        `/services/category/${categoryId}`,
        `/services?categoryId=${categoryId}`,
        `/services?category=${categoryId}`,
        `/api/services?categoryId=${categoryId}`,
        `/public/services?category=${categoryId}`
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Fetching services by category from: ${API_BASE}${endpoint}`);
          const response = await axios.get(`${API_BASE}${endpoint}`, {
            timeout: 15000,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
          
          if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            console.log(`Backend category services loaded for ${categoryId}:`, response.data.length, 'services');
            return response.data.map((service: any) => ({
              ...service,
              id: service.id || service._id,
              name: service.name || service.title || 'Unnamed Service',
              description: service.description || service.longDescription || 'No description available',
              shortDescription: service.shortDescription || service.summary || service.description?.substring(0, 100) || 'Brief service description',
              price: service.price || service.basePrice || service.cost || 0,
              duration: service.duration || service.durationMinutes || 60,
              category: service.category || service.categoryName || 'General',
              categoryId: service.categoryId || service.category_id || categoryId,
              images: service.images && Array.isArray(service.images) ? service.images : 
                      service.image ? [service.image] :
                      service.thumbnail ? [service.thumbnail] :
                      service.photo ? [service.photo] : [],
              isActive: service.isActive !== undefined ? service.isActive : true,
              status: service.status || 'active'
            }));
          }
        } catch (error: any) {
          console.log(`Failed to fetch category services from ${endpoint}:`, error.message);
          continue;
        }
      }
      
      // If all API calls fail, return empty array instead of fallback data
      console.log(`All category service API endpoints failed for ${categoryId}, returning empty array`);
      return [];
    } catch (error: any) {
      console.error(`Error fetching services for category ${categoryId}:`, error);
      return [];
    }
  }

  // Categories QRT - Public endpoint (no auth required)
  static async getCategories() {
    try {
      // Try multiple endpoints to get categories
      const endpoints = [
        '/categories',
        '/categories?isActive=true',
        '/api/categories',
        '/public/categories'
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Fetching categories from: ${API_BASE}${endpoint}`);
          const response = await axios.get(`${API_BASE}${endpoint}`, {
            timeout: 15000,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
          
          if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            console.log('Backend categories loaded:', response.data.length, 'categories');
            return response.data.map((category: any) => ({
              ...category,
              id: category.id || category._id,
              name: category.name || category.title || 'Unnamed Category',
              slug: category.slug || category.name?.toLowerCase().replace(/\s+/g, '-') || 'unnamed'
            }));
          } else if (response.data && response.data.categories && Array.isArray(response.data.categories)) {
            console.log('Backend categories loaded from nested:', response.data.categories.length, 'categories');
            return response.data.categories.map((category: any) => ({
              ...category,
              id: category.id || category._id,
              name: category.name || category.title || 'Unnamed Category',
              slug: category.slug || category.name?.toLowerCase().replace(/\s+/g, '-') || 'unnamed'
            }));
          } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
            console.log('Backend categories loaded from data field:', response.data.data.length, 'categories');
            return response.data.data.map((category: any) => ({
              ...category,
              id: category.id || category._id,
              name: category.name || category.title || 'Unnamed Category',
              slug: category.slug || category.name?.toLowerCase().replace(/\s+/g, '-') || 'unnamed'
            }));
          }
        } catch (error: any) {
          console.log(`Failed to fetch categories from ${endpoint}:`, error.message);
          continue;
        }
      }
      
      // If all API calls fail, return empty array instead of fallback data
      console.log('All category API endpoints failed, returning empty array');
      return [];
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Calendar Bookings QRT
  static async getCalendarBookings(year: number, month: number) {
    return this.qrtCall(`/bookings/calendar?year=${year}&month=${month}`, {
      bookings: [
        {
          id: '1',
          customerName: 'Sarah Johnson',
          serviceName: 'Hair Styling',
          scheduledAt: '2025-10-08T14:00:00Z',
          duration: 60,
          status: 'confirmed'
        }
      ]
    });
  }

  // Auth Profile QRT - Try real API first, then localStorage, then mock
  static async getAuthProfile() {
    // First try real API call if we have token
    const token = typeof window !== 'undefined' ? localStorage.getItem('providerToken') : null;
    
    if (token) {
      try {
        const response = await axios.get(`${API_BASE}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        });
        
        if (response.data) {
          return response.data;
        }
      } catch (error: any) {
        // Continue to fallback
      }
    }
    
    // Fallback 1: Try localStorage data  
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('provider') : null;
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        
        if (userData && (userData.firstName || userData.lastName || userData.email)) {
          console.log('✅ Auth profile loaded from localStorage');
          return {
            id: userData.id || 'local-user',
            firstName: userData.firstName || 'Provider',
            lastName: userData.lastName || '',
            email: userData.email || 'provider@example.com',
            phone: userData.phone || '',
            avatar: userData.avatar || '/default-avatar.jpg',
            businessName: userData.businessName || 'My Business',
            isVerified: userData.isVerified || false,
            role: userData.role || 'provider',
            ...userData
          };
        }
      } catch (error) {
        console.log('Failed to parse stored user data');
      }
    }
    
    // Fallback 2: Mock data
    console.log('⚠️ Using mock auth profile data');
    return {
      id: 'mock-provider-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@wiwihood.com',
      phone: '+1 (555) 123-4567',
      avatar: '/default-avatar.jpg',
      businessName: 'Wiwihood Salon',
      address: '123 Main Street, New York, NY 10001',
      isVerified: true,
      role: 'provider',
      joinedAt: '2023-01-15T00:00:00Z',
      subscription: {
        plan: 'Professional',
        status: 'active',
        expiresAt: '2024-12-31T23:59:59Z'
      }
    };
  }

  // Provider Profile QRT
  static async getProviderProfile() {
    return this.qrtCall('/provider/profile', {
      id: '1',
      businessName: 'Wiwihood Beauty Salon',
      ownerName: 'Maria Garcia',
      email: 'maria@wiwihood.com',
      phone: '+1 (555) 123-4567',
      address: '123 Beauty Street, New York, NY 10001',
      description: 'Premier beauty salon offering comprehensive hair, beauty, and wellness services.',
      website: 'https://wiwihood.com',
      socialMedia: {
        instagram: '@wiwihood',
        facebook: 'WiwihoodSalon',
        twitter: '@wiwihood'
      },
      hours: {
        monday: '9:00 AM - 7:00 PM',
        tuesday: '9:00 AM - 7:00 PM',
        wednesday: '9:00 AM - 7:00 PM',
        thursday: '9:00 AM - 8:00 PM',
        friday: '9:00 AM - 8:00 PM',
        saturday: '8:00 AM - 6:00 PM',
        sunday: 'Closed'
      },
      images: [
        '/salon1.jpg',
        '/salon2.jpg',
        '/salon3.jpg'
      ],
      amenities: [
        'Free WiFi',
        'Complimentary Beverages',
        'Parking Available',
        'Wheelchair Accessible',
        'Air Conditioning'
      ],
      rating: 4.8,
      reviewCount: 247,
      established: '2018',
      staff: 8,
      services: 25
    });
  }

  // Venue Location QRT
  static async getVenueLocation() {
    return this.qrtCall('/venue/location', {
      id: '1',
      name: 'Wiwihood Beauty Salon',
      address: '123 Beauty Street, New York, NY 10001',
      coordinates: {
        lat: 40.7128,
        lng: -74.0060
      },
      phone: '+1 (555) 123-4567',
      email: 'info@wiwihood.com',
      website: 'https://wiwihood.com',
      hours: {
        monday: '9:00 AM - 7:00 PM',
        tuesday: '9:00 AM - 7:00 PM',
        wednesday: '9:00 AM - 7:00 PM',
        thursday: '9:00 AM - 8:00 PM',
        friday: '9:00 AM - 8:00 PM',
        saturday: '8:00 AM - 6:00 PM',
        sunday: 'Closed'
      },
      images: ['/venue1.jpg', '/venue2.jpg']
    });
  }

  // Service CRUD Operations
  static async createService(serviceData: any) {
    try {
      const response = await axios.post(`${API_BASE}/services`, serviceData, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('✅ QRT: Service created successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ QRT: Service creation failed:', error?.response?.data || error?.message);
      throw error;
    }
  }

  static async updateService(serviceId: string, serviceData: any) {
    try {
      const response = await axios.put(`${API_BASE}/services/${serviceId}`, serviceData, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('✅ QRT: Service updated successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ QRT: Service update failed:', error?.response?.data || error?.message);
      throw error;
    }
  }

  static async deleteService(serviceId: string) {
    try {
      const response = await axios.delete(`${API_BASE}/services/${serviceId}`, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log('✅ QRT: Service deleted successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ QRT: Service deletion failed:', error?.response?.data || error?.message);
      throw error;
    }
  }

  static async toggleServiceStatus(serviceId: string) {
    try {
      const response = await axios.patch(`${API_BASE}/services/${serviceId}/toggle`, {}, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('✅ QRT: Service status toggled successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ QRT: Service status toggle failed:', error?.response?.data || error?.message);
      throw error;
    }
  }
}

export default QRTIntegration;