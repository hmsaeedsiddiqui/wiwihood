export interface Provider {
  id: string;
  businessName: string;
  businessDescription: string;
  businessAddress: string;
  businessCity: string;
  businessPhoneNumber?: string;
  businessEmail?: string;
  websiteUrl?: string;
  logoUrl?: string;
  isVerified: boolean;
  averageRating: number;
  totalReviews: number;
  user: {
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
  services: Array<{
    id: string;
    name: string;
    basePrice: number;
    duration: number;
    category: { name: string };
  }>;
}
import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  icon?: string;
  bannerImage?: string;
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  duration: number;
  imageUrl?: string;
  category: Category;
  provider: {
    id: string;
    businessName: string;
    averageRating: number;
    totalReviews: number;
    businessAddress: string;
  };
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

// API Service methods
export const apiService = {
  // Bookings
  async createBooking(data: {
    serviceId: string;
    providerId: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
    platformFee?: number;
    notes?: string;
    status?: string;
  }): Promise<any> {
    try {
      const response = await apiClient.post('/bookings', data);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },
  // Providers
  async getProviders(params?: {
    search?: string;
    city?: string;
    minRating?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<{ data: Provider[]; pagination?: any }> {
    try {
      const response = await apiClient.get('/providers', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching providers:', error);
      throw error;
    }
  },
  // Categories
  async getCategories(isActive?: boolean): Promise<Category[]> {
    try {
      const params = isActive !== undefined ? { isActive } : {};
      const response = await apiClient.get('/categories', { params });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async getFeaturedCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get('/categories/featured');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching featured categories:', error);
      throw error;
    }
  },

  async getCategoryBySlug(slug: string): Promise<Category> {
    try {
      const response = await apiClient.get(`/categories/slug/${slug}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      throw error;
    }
  },

  // Services
  async getServices(params?: {
    search?: string;
    categoryId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<{ data: Service[]; pagination?: any }> {
    try {
      const response = await apiClient.get('/services', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  async getServicesByCategory(categoryId: string): Promise<Service[]> {
    try {
      const response = await apiClient.get(`/services/category/${categoryId}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching services by category:', error);
      throw error;
    }
  }
};

export default apiClient
