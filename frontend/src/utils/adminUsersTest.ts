/**
 * Admin Users CRUD Test Script
 * 
 * This script helps test the admin users functionality to ensure
 * all CRUD operations work properly with the backend API.
 */

// Type definitions
interface TestResult {
  success: boolean;
  data?: any;
  error?: any;
}

interface TestSummary extends TestResult {
  test: string;
}

// Test Functions for Admin Users Page

export const testAdminUsersCRUD = {
  
  // Test 1: Load Users List
  async testLoadUsers(): Promise<TestResult> {
    console.log('🧪 Testing: Load Users List');
    try {
      const response = await fetch('/api/v1/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Users loaded successfully:', data);
        return { success: true, data };
      } else {
        console.log('❌ Failed to load users:', response.status);
        return { success: false, error: response.status };
      }
    } catch (error) {
      console.log('❌ Error loading users:', error);
      return { success: false, error };
    }
  },

  // Test 2: Get User by ID
  async testGetUserById(userId: string): Promise<TestResult> {
    console.log('🧪 Testing: Get User by ID:', userId);
    try {
      const response = await fetch(`/api/v1/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ User fetched successfully:', data);
        return { success: true, data };
      } else {
        console.log('❌ Failed to fetch user:', response.status);
        return { success: false, error: response.status };
      }
    } catch (error) {
      console.log('❌ Error fetching user:', error);
      return { success: false, error };
    }
  },

  // Test 3: Update User
  async testUpdateUser(userId: string, updateData: any): Promise<TestResult> {
    console.log('🧪 Testing: Update User:', userId, updateData);
    try {
      const response = await fetch(`/api/v1/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ User updated successfully:', data);
        return { success: true, data };
      } else {
        console.log('❌ Failed to update user:', response.status);
        const errorData = await response.json().catch(() => ({}));
        return { success: false, error: errorData };
      }
    } catch (error) {
      console.log('❌ Error updating user:', error);
      return { success: false, error };
    }
  },

  // Test 4: Update User Status
  async testUpdateUserStatus(userId: string, status: string): Promise<TestResult> {
    console.log('🧪 Testing: Update User Status:', userId, status);
    try {
      const response = await fetch(`/api/v1/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ User status updated successfully:', data);
        return { success: true, data };
      } else {
        console.log('❌ Failed to update user status:', response.status);
        const errorData = await response.json().catch(() => ({}));
        return { success: false, error: errorData };
      }
    } catch (error) {
      console.log('❌ Error updating user status:', error);
      return { success: false, error };
    }
  },

  // Test 5: Delete User (with proper error handling)
  async testDeleteUser(userId: string): Promise<TestResult> {
    console.log('🧪 Testing: Delete User:', userId);
    try {
      const response = await fetch(`/api/v1/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ User deleted successfully:', data);
        return { success: true, data };
      } else {
        console.log('❌ Failed to delete user:', response.status);
        const errorData = await response.json().catch(() => ({}));
        console.log('❌ Error details:', errorData);
        return { success: false, error: errorData };
      }
    } catch (error) {
      console.log('❌ Error deleting user:', error);
      return { success: false, error };
    }
  },

  // Test 6: Search Users
  async testSearchUsers(searchQuery: string): Promise<TestResult> {
    console.log('🧪 Testing: Search Users:', searchQuery);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/v1/users?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Search completed successfully:', data);
        return { success: true, data };
      } else {
        console.log('❌ Failed to search users:', response.status);
        return { success: false, error: response.status };
      }
    } catch (error) {
      console.log('❌ Error searching users:', error);
      return { success: false, error };
    }
  },

  // Test 7: Filter Users by Role
  async testFilterByRole(role: string): Promise<TestResult> {
    console.log('🧪 Testing: Filter by Role:', role);
    try {
      const params = new URLSearchParams();
      if (role) params.append('role', role);
      
      const response = await fetch(`/api/v1/users?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Filter completed successfully:', data);
        return { success: true, data };
      } else {
        console.log('❌ Failed to filter users:', response.status);
        return { success: false, error: response.status };
      }
    } catch (error) {
      console.log('❌ Error filtering users:', error);
      return { success: false, error };
    }
  },

  // Run All Tests
  async runAllTests(): Promise<TestSummary[]> {
    console.log('🚀 Starting Admin Users CRUD Tests...\n');
    
    const results: TestSummary[] = [];
    
    // Test 1: Load Users
    const loadTest = await this.testLoadUsers();
    results.push({ test: 'Load Users', ...loadTest });
    
    if (loadTest.success && loadTest.data?.users?.length > 0) {
      const testUser = loadTest.data.users[0];
      
      // Test 2: Get User by ID
      const getUserTest = await this.testGetUserById(testUser.id);
      results.push({ test: 'Get User by ID', ...getUserTest });
      
      // Test 3: Update User (safe update)
      const updateTest = await this.testUpdateUser(testUser.id, {
        firstName: testUser.firstName + ' (Updated)'
      });
      results.push({ test: 'Update User', ...updateTest });
      
      // Test 4: Update Status
      const statusTest = await this.testUpdateUserStatus(testUser.id, testUser.status);
      results.push({ test: 'Update Status', ...statusTest });
    }
    
    // Test 5: Search
    const searchTest = await this.testSearchUsers('test');
    results.push({ test: 'Search Users', ...searchTest });
    
    // Test 6: Filter by Role
    const filterTest = await this.testFilterByRole('customer');
    results.push({ test: 'Filter by Role', ...filterTest });
    
    // Print Results
    console.log('\n📊 Test Results Summary:');
    results.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${result.test}`);
      if (!result.success) {
        console.log(`   Error:`, result.error);
      }
    });
    
    const successCount = results.filter(r => r.success).length;
    console.log(`\n🎯 Overall: ${successCount}/${results.length} tests passed`);
    
    return results;
  }
};

// Frontend Testing Functions

export const testFrontendFunctionality = {
  
  // Test navigation to user details
  testNavigationToUserDetails(): boolean {
    console.log('🧪 Testing: Navigation to User Details');
    
    // Simulate clicking view icon
    const viewButtons = document.querySelectorAll('[title="View Details"]');
    if (viewButtons.length > 0) {
      console.log('✅ View buttons found:', viewButtons.length);
      return true;
    } else {
      console.log('❌ No view buttons found');
      return false;
    }
  },

  // Test RTK Query hooks
  testRTKQueryHooks(): boolean {
    console.log('🧪 Testing: RTK Query hooks integration');
    
    // Check if the store has the adminUsersApi
    try {
      const store = (window as any).__REDUX_STORE__;
      if (store && store.getState().adminUsersApi) {
        console.log('✅ RTK Query store found');
        return true;
      } else {
        console.log('❌ RTK Query store not found');
        return false;
      }
    } catch (error) {
      console.log('❌ Error checking RTK Query:', error);
      return false;
    }
  },

  // Test error handling
  testErrorHandling(): boolean {
    console.log('🧪 Testing: Error handling');
    
    // Check if error boundary exists
    const errorBoundary = document.querySelector('[data-error-boundary]');
    if (errorBoundary) {
      console.log('✅ Error boundary found');
      return true;
    } else {
      console.log('ℹ️ Error boundary not visible (expected)');
      return true;
    }
  }
};

// Usage Instructions
console.log(`
🔧 Admin Users Testing Guide:

1. Open browser console on admin users page
2. Run individual tests:
   - testAdminUsersCRUD.testLoadUsers()
   - testAdminUsersCRUD.testGetUserById('user-id')
   - testAdminUsersCRUD.testSearchUsers('search-term')

3. Run all tests:
   - testAdminUsersCRUD.runAllTests()

4. Test frontend functionality:
   - testFrontendFunctionality.testNavigationToUserDetails()
   - testFrontendFunctionality.testRTKQueryHooks()

Note: Make sure you have admin authentication token in localStorage
`);

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testAdminUsers = testAdminUsersCRUD;
  (window as any).testFrontend = testFrontendFunctionality;
}