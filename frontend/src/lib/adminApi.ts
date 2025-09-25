// Admin API Service - Centralized API calls for admin operations
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

class AdminApiService {
  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = localStorage.getItem('adminToken');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Dashboard APIs
  async getDashboardStats() {
    return this.request('/admin/dashboard/stats');
  }

  async getDashboardCharts() {
    return this.request('/admin/dashboard/charts');
  }

  async getRecentActivity() {
    return this.request('/admin/dashboard/recent-activity');
  }

  // Users APIs
  async getUsers(params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    role?: string; 
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return this.request(`/admin/users?${queryParams.toString()}`);
  }

  async getUser(id: string) {
    return this.request(`/admin/users/${id}`);
  }

  async createUser(userData: any) {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: any) {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  async updateUserStatus(id: string, status: string) {
    return this.request(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Providers APIs
  async getProviders(params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string;
    verified?: boolean;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return this.request(`/admin/providers?${queryParams.toString()}`);
  }

  async getProvider(id: string) {
    return this.request(`/admin/providers/${id}`);
  }

  async updateProviderStatus(id: string, status: string) {
    return this.request(`/admin/providers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async verifyProvider(id: string, verified: boolean) {
    return this.request(`/admin/providers/${id}/verify`, {
      method: 'PATCH',
      body: JSON.stringify({ verified }),
    });
  }

  async getProviderDocuments(id: string) {
    return this.request(`/admin/providers/${id}/documents`);
  }

  // Bookings APIs
  async getBookings(params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return this.request(`/admin/bookings?${queryParams.toString()}`);
  }

  async getBooking(id: string) {
    return this.request(`/admin/bookings/${id}`);
  }

  async updateBookingStatus(id: string, status: string) {
    return this.request(`/admin/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async refundBooking(id: string, amount?: number) {
    return this.request(`/admin/bookings/${id}/refund`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  // Analytics APIs
  async getAnalytics(params?: { 
    dateFrom?: string; 
    dateTo?: string; 
    granularity?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return this.request(`/admin/analytics?${queryParams.toString()}`);
  }

  async getRevenueAnalytics(params?: { dateFrom?: string; dateTo?: string }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return this.request(`/admin/analytics/revenue?${queryParams.toString()}`);
  }

  async getCategoryAnalytics() {
    return this.request('/admin/analytics/categories');
  }

  async getTopProviders(limit: number = 10) {
    return this.request(`/admin/analytics/top-providers?limit=${limit}`);
  }

  // Categories APIs
  async getCategories(params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    active?: boolean;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return this.request(`/admin/categories?${queryParams.toString()}`);
  }

  async getCategory(id: string) {
    return this.request(`/admin/categories/${id}`);
  }

  async createCategory(categoryData: any) {
    return this.request('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: string, categoryData: any) {
    return this.request(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: string) {
    return this.request(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
  }

  async updateCategoryStatus(id: string, isActive: boolean) {
    return this.request(`/admin/categories/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  }

  // Support Tickets APIs
  async getSupportTickets(params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string;
    priority?: string;
    category?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    return this.request(`/admin/support-tickets?${queryParams.toString()}`);
  }

  async getSupportTicket(id: string) {
    return this.request(`/admin/support-tickets/${id}`);
  }

  async updateTicketStatus(id: string, status: string) {
    return this.request(`/admin/support-tickets/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async assignTicket(id: string, assignedTo: string) {
    return this.request(`/admin/support-tickets/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ assignedTo }),
    });
  }

  async addTicketMessage(id: string, message: string) {
    return this.request(`/admin/support-tickets/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Settings APIs
  async getSettings() {
    return this.request('/admin/settings');
  }

  async updateSettings(settings: any) {
    return this.request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async getSystemStatus() {
    return this.request('/admin/system/status');
  }

  async toggleMaintenanceMode(enabled: boolean) {
    return this.request('/admin/system/maintenance', {
      method: 'POST',
      body: JSON.stringify({ enabled }),
    });
  }

  // Reports APIs
  async generateReport(type: string, params?: any) {
    return this.request('/admin/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ type, params }),
    });
  }

  async getReports() {
    return this.request('/admin/reports');
  }

  async downloadReport(id: string) {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/admin/reports/${id}/download`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to download report');
    }
    
    return response.blob();
  }
}

export const adminApi = new AdminApiService();
export default adminApi;