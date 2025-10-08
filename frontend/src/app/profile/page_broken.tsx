"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

// Interface for user profile data
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  coverImage?: string;
  joinDate?: string;
  city?: string;
  about?: string;
  preferences?: {
    notifications: boolean;
    marketing: boolean;
    reminders: boolean;
  };
  stats?: {
    totalBookings: number;
    completedBookings: number;
    favoriteProviders: number;
    reviewsLeft: number;
    loyaltyPoints: number;
  };
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  date: string;
  icon: string;
  color: string;
}

export default function ProfilePage() {
  const { user, token, isAuthenticated } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debug function to test token validity
  const testTokenValidity = async () => {
    const authToken = localStorage.getItem('auth-token');
    const regularToken = localStorage.getItem('token');
    
    console.log('=== TOKEN DEBUG ===');
    console.log('auth-token exists:', !!authToken);
    console.log('token exists:', !!regularToken);
    console.log('auth store token exists:', !!token);
    console.log('auth store isAuthenticated:', isAuthenticated);
    
    if (authToken) {
      console.log('Testing auth-token...');
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          }
        });
        
        console.log('auth-token test response:', response.status);
        if (!response.ok) {
          const errorText = await response.text();
          console.log('auth-token error:', errorText);
        } else {
          const userData = await response.json();
          console.log('auth-token SUCCESS:', userData);
          return userData;
        }
      } catch (error) {
        console.error('auth-token test failed:', error);
      }
    }
    
    return null;
  };

  // Fetch user profile data
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        console.log('Starting profile data fetch...');
        const userData = await testTokenValidity();
        
        if (userData) {
          console.log('Successfully got user data from token test');
          await handleUserData(userData);
          setError(null);
        } else {
          console.log('Token test failed, showing login prompt');
          setError('Please log in to view your profile');
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
      
      fetchRecentActivity();
    };
    
    checkAuthAndFetch();
  }, []);

  const handleUserData = async (userData: any) => {
    setProfileData({
      id: userData.id,
      firstName: userData.firstName || userData.name?.split(' ')[0] || 'User',
      lastName: userData.lastName || userData.name?.split(' ')[1] || '',
      email: userData.email,
      phone: userData.phone || userData.phoneNumber || '',
      avatar: userData.avatar || userData.profileImage || 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face',
      coverImage: userData.coverImage || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=300&fit=crop',
      joinDate: userData.createdAt || userData.joinDate || new Date().toISOString().split('T')[0],
      city: userData.city || userData.address || 'Not specified',
      about: userData.about || userData.bio || 'No description provided.',
      preferences: {
        notifications: userData.notifications ?? true,
        marketing: userData.marketing ?? false,
        reminders: userData.reminders ?? true
      },
      stats: {
        totalBookings: 0, // Will be fetched separately
        completedBookings: 0,
        favoriteProviders: 0,
        reviewsLeft: 0,
        loyaltyPoints: userData.loyaltyPoints || 0
      }
    });
    
    // Fetch user stats with same token approach
    const authToken = localStorage.getItem('auth-token');
    const regularToken = localStorage.getItem('token'); 
    const token = authToken || regularToken;
    if (token) {
      await fetchUserStatsWithToken(token);
    }
    setError(null);
    setLoading(false);
  };

  const fetchUserProfileWithToken = async (authToken: string) => {
    try {
      setLoading(true);
      
      console.log('Making API call to:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/profile`);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('API Response status:', response.status);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('Successfully fetched user data:', userData);
        setProfileData({
          id: userData.id,
          firstName: userData.firstName || userData.name?.split(' ')[0] || 'User',
          lastName: userData.lastName || userData.name?.split(' ')[1] || '',
          email: userData.email,
          phone: userData.phone || userData.phoneNumber || '',
          avatar: userData.avatar || userData.profileImage || 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face',
          coverImage: userData.coverImage || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=300&fit=crop',
          joinDate: userData.createdAt || userData.joinDate || new Date().toISOString().split('T')[0],
          city: userData.city || userData.address || 'Not specified',
          about: userData.about || userData.bio || 'No description provided.',
          preferences: {
            notifications: userData.notifications ?? true,
            marketing: userData.marketing ?? false,
            reminders: userData.reminders ?? true
          },
          stats: {
            totalBookings: 0, // Will be fetched separately
            completedBookings: 0,
            favoriteProviders: 0,
            reviewsLeft: 0,
            loyaltyPoints: userData.loyaltyPoints || 0
          }
        });
        
        // Fetch user stats
        await fetchUserStatsWithToken(authToken);
        setError(null);
      } else if (response.status === 401) {
        console.log('Authentication failed, token may be expired');
        localStorage.removeItem('auth-token');
        setError('Your session has expired. Please log in again.');
        setLoading(false);
      } else {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        setError(`Failed to load profile: ${response.status}`);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Unable to connect to server. Please check your connection.');
      setLoading(false);
    }
  };

  const fetchUserStatsWithToken = async (authToken: string) => {
    try {
      // Fetch bookings count
      const bookingsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/bookings/my-bookings`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        }
      });

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        const bookings = bookingsData.bookings || bookingsData || [];
        const completedBookings = bookings.filter((b: any) => b.status === 'completed').length;
        
        setProfileData(prev => prev ? {
          ...prev,
          stats: {
            ...prev.stats!,
            totalBookings: bookings.length,
            completedBookings: completedBookings,
            favoriteProviders: 3, // TODO: Implement favorites API
            reviewsLeft: 5, // TODO: Implement reviews API
          }
        } : null);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Stats will remain with default/demo values
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        console.log('No token for activity fetch, skipping...');
        setRecentActivity([]);
        return;
      }

      // Fetch recent bookings as activity
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/bookings/my-bookings?limit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        const bookings = data.bookings || data || [];
        
        const activities = bookings.map((booking: any) => ({
          id: booking.id,
          type: 'booking',
          description: `${booking.status === 'completed' ? 'Completed' : 'Booked'} ${booking.service?.name || 'Service'} at ${booking.provider?.businessName || 'Provider'}`,
          date: booking.startTime?.split('T')[0] || new Date().toISOString().split('T')[0],
          icon: booking.status === 'completed' ? 'fas fa-check-circle' : 'fas fa-calendar-plus',
          color: booking.status === 'completed' ? 'text-green-500' : 'text-blue-500'
        }));
        
        setRecentActivity(activities);
      } else {
        console.log('Failed to fetch activity:', response.status);
        setRecentActivity([]);
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      setRecentActivity([]);
    }
  };

  const setDefaultProfileData = () => {
    setProfileData({
      id: 'demo-user',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=300&fit=crop',
      joinDate: '2024-01-15',
      city: 'New York, NY',
      about: 'Passionate about wellness and self-care. Regular customer who loves trying new services and experiences.',
      preferences: {
        notifications: true,
        marketing: false,
        reminders: true
      },
      stats: {
        totalBookings: 12,
        completedBookings: 10,
        favoriteProviders: 3,
        reviewsLeft: 8,
        loyaltyPoints: 150
      }
    });
    setError(null); // Clear any previous errors
    setLoading(false);
  };

  const handleSave = () => {
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    if (profileData) {
      setProfileData({ ...profileData, [field]: value });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-6">
            <i className="fas fa-user-circle text-6xl text-gray-400 mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Access Required</h2>
            <p className="text-gray-600">
              {error || 'Please log in to view your profile information'}
            </p>
          </div>
          
          <div className="space-y-3">
            <Link 
              href="/auth/login"
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <i className="fas fa-sign-in-alt"></i>
              Log In to Continue
            </Link>
            
            <button 
              onClick={() => {
                const token = localStorage.getItem('auth-token');
                if (token) {
                  fetchUserProfileWithToken(token);
                } else {
                  setError('No authentication token found. Please log in.');
                }
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <i className="fas fa-refresh"></i>
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Cover Photo Section */}
      <div className="profile-cover">
        <img
          src={profileData.coverImage}
          alt="Cover"
          className="cover-image"
        />
        <div className="profile-header">
          <div className="profile-avatar">
            <img
              src={profileData.avatar}
              alt="Profile"
              className="avatar-image"
            />
          </div>
          <div className="profile-info">
            <h1 className="profile-name">
              {profileData.firstName} {profileData.lastName}
            </h1>
            <p className="profile-location">
              <i className="fas fa-map-marker-alt"></i>
              {profileData.city}
            </p>
            <p className="profile-member-since">
              Member since {profileData.joinDate ? new Date(profileData.joinDate).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              }) : 'Unknown'}
            </p>
          </div>
          
          <div className="profile-actions">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="edit-profile-btn"
            >
              <i className="fas fa-edit"></i>
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            <Link href="/settings" className="edit-profile-btn bg-blue-600 hover:bg-blue-700 text-white ml-2">
              <i className="fas fa-cog"></i>
              Settings
            </Link>
            <Link href="/reviews" className="edit-profile-btn bg-green-600 hover:bg-green-700 text-white ml-2">
              <i className="fas fa-star"></i>
              Reviews
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-nav">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-user"></i>
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          <i className="fas fa-chart-line"></i>
          Activity
        </button>
      </div>

      {/* Content Sections */}
      <div className="profile-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="profile-main">
              <div className="profile-section">
                <div className="section-header">
                  <h2>
                    <i className="fas fa-user"></i>
                    Profile Information
                  </h2>
                  {isEditing && (
                    <button onClick={handleSave} className="save-btn">
                      <i className="fas fa-save"></i>
                      Save Changes
                    </button>
                  )}
                </div>
                <div className="profile-fields">
                  <div className="field-row">
                    <div className="field-group">
                      <label>First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="profile-input"
                          value={profileData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                        />
                      ) : (
                        <div className="profile-value">{profileData.firstName}</div>
                      )}
                    </div>
                    <div className="field-group">
                      <label>Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="profile-input"
                          value={profileData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                        />
                      ) : (
                        <div className="profile-value">{profileData.lastName}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="field-group">
                    <label>Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        className="profile-input"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    ) : (
                      <div className="profile-value">{profileData.email}</div>
                    )}
                  </div>
                  
                  <div className="field-group">
                    <label>Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        className="profile-input"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    ) : (
                      <div className="profile-value">{profileData.phone}</div>
                    )}
                  </div>
                  
                  <div className="field-group">
                    <label>City</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="profile-input"
                        value={profileData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                      />
                    ) : (
                      <div className="profile-value">{profileData.city}</div>
                    )}
                  </div>
                  
                  <div className="field-group">
                    <label>About Me</label>
                    {isEditing ? (
                      <textarea
                        className="profile-input"
                        rows={4}
                        value={profileData.about}
                        onChange={(e) => handleInputChange('about', e.target.value)}
                      />
                    ) : (
                      <div className="profile-value about-text">{profileData.about}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-sidebar">
              <div className="stats-card">
                <div className="card-header">
                  <h3>
                    <i className="fas fa-chart-bar"></i>
                    Your Stats
                  </h3>
                </div>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-number">{profileData.stats?.totalBookings || 0}</div>
                    <div className="stat-label">Total Bookings</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{profileData.stats?.completedBookings || 0}</div>
                    <div className="stat-label">Completed</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{profileData.stats?.favoriteProviders || 0}</div>
                    <div className="stat-label">Favorites</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{profileData.stats?.loyaltyPoints || 0}</div>
                    <div className="stat-label">Points</div>
                  </div>
                </div>
              </div>

              <div className="quick-actions-card">
                <div className="card-header">
                  <h3>
                    <i className="fas fa-bolt"></i>
                    Quick Actions
                  </h3>
                </div>
                <div className="quick-actions">
                  <Link href="/bookings" className="action-item">
                    <i className="fas fa-calendar-alt"></i>
                    <span>My Bookings</span>
                  </Link>
                  <Link href="/wishlist" className="action-item">
                    <i className="fas fa-heart"></i>
                    <span>Wishlist</span>
                  </Link>
                  <Link href="/reviews" className="action-item">
                    <i className="fas fa-star"></i>
                    <span>Reviews</span>
                  </Link>
                  <Link href="/settings" className="action-item">
                    <i className="fas fa-cog"></i>
                    <span>Settings</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="activity-content">
            <div className="activity-card">
              <div className="card-header">
                <h3>
                  <i className="fas fa-clock"></i>
                  Recent Activity
                </h3>
              </div>
              <div className="activity-list">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity: RecentActivity) => (
                    <div key={activity.id} className="activity-item">
                      <div className={`activity-icon ${activity.color}`}>
                        <i className={activity.icon}></i>
                      </div>
                      <div className="activity-details">
                        <div className="activity-description">{activity.description}</div>
                        <div className="activity-date">{new Date(activity.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-activity">
                    <i className="fas fa-inbox"></i>
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .profile-container {
          min-height: 100vh;
          background: #f8fafc;
          padding-bottom: 2rem;
        }

        .profile-cover {
          position: relative;
          height: 300px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin-bottom: 2rem;
        }

        .cover-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-header {
          position: absolute;
          bottom: -50px;
          left: 0;
          right: 0;
          display: flex;
          align-items: flex-end;
          padding: 0 2rem;
          gap: 1.5rem;
        }

        .profile-avatar {
          flex-shrink: 0;
        }

        .avatar-image {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          object-fit: cover;
        }

        .profile-info {
          flex: 1;
          color: white;
          margin-bottom: 1rem;
        }

        .profile-name {
          font-size: 2rem;
          font-weight: bold;
          margin: 0 0 0.5rem 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .profile-location {
          font-size: 1rem;
          margin: 0.25rem 0;
          opacity: 0.9;
        }

        .profile-member-since {
          font-size: 0.875rem;
          margin: 0.25rem 0;
          opacity: 0.8;
        }

        .profile-actions {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .edit-profile-btn {
          background: white;
          color: #374151;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .edit-profile-btn:hover {
          background: #f3f4f6;
          transform: translateY(-1px);
        }

        .profile-nav {
          display: flex;
          background: white;
          border-radius: 0.5rem;
          margin: 3rem 2rem 2rem;
          padding: 0.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .tab-btn {
          flex: 1;
          background: none;
          border: none;
          padding: 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .tab-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .tab-btn.active {
          background: #3b82f6;
          color: white;
        }

        .profile-content {
          padding: 0 2rem;
        }

        .overview-content {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 2rem;
        }

        .profile-main {
          background: white;
          border-radius: 0.5rem;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .profile-section {
          margin-bottom: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: between;
          align-items: center;
          margin-bottom: 1.5rem;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 1rem;
        }

        .section-header h2 {
          font-size: 1.25rem;
          font-weight: bold;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
        }

        .save-btn {
          background: #10b981;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .save-btn:hover {
          background: #059669;
        }

        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .field-group {
          margin-bottom: 1rem;
        }

        .field-group label {
          display: block;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .profile-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 1rem;
        }

        .profile-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .profile-value {
          padding: 0.75rem 0;
          color: #1f2937;
          font-size: 1rem;
        }

        .about-text {
          line-height: 1.6;
        }

        .profile-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .stats-card, .quick-actions-card {
          background: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .card-header h3 {
          font-size: 1.125rem;
          font-weight: bold;
          color: #1f2937;
          margin: 0 0 1rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .stat-item {
          text-align: center;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 0.375rem;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: #3b82f6;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .quick-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .action-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 0.375rem;
          color: #374151;
          text-decoration: none;
          transition: background 0.2s;
        }

        .action-item:hover {
          background: #f3f4f6;
        }

        .activity-content {
          max-width: 800px;
        }

        .activity-card {
          background: white;
          border-radius: 0.5rem;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 0.5rem;
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-details {
          flex: 1;
        }

        .activity-description {
          font-weight: 500;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .activity-date {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .no-activity {
          text-align: center;
          padding: 3rem;
          color: #6b7280;
        }

        .no-activity i {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }

        @media (max-width: 768px) {
          .overview-content {
            grid-template-columns: 1fr;
          }
          
          .profile-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          
          .field-row {
            grid-template-columns: 1fr;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}