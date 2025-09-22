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

  // Fetch user profile data
  useEffect(() => {
    // Force check auth store initialization
    const checkAuth = () => {
      const token = localStorage.getItem('auth-token');
      console.log('Profile page - Direct token check:', token ? 'exists' : 'missing');
      console.log('Profile page - Auth store state:', { isAuthenticated, hasToken: !!token, user });
      
      if (token) {
        fetchUserProfileWithToken(token);
      } else {
        console.log('No token found, using demo data');
        setDefaultProfileData();
      }
      fetchRecentActivity();
    };
    
    checkAuth();
  }, []);

  const fetchUserProfileWithToken = async (authToken: string) => {
    try {
      setLoading(true);
      
      console.log('Making API call to:', 'http://localhost:8000/api/v1/auth/profile');
      const response = await fetch('http://localhost:8000/api/v1/auth/profile', {
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
        console.log('Authentication failed, clearing token and using demo data');
        localStorage.removeItem('auth-token');
        setDefaultProfileData();
      } else {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load real profile data, using demo data');
      setDefaultProfileData();
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      await fetchUserProfileWithToken(token);
    } else {
      setDefaultProfileData();
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      await fetchUserStatsWithToken(token);
    }
  };

  const fetchUserStatsWithToken = async (authToken: string) => {
    try {
      // Fetch bookings count
      const bookingsResponse = await fetch('http://localhost:8000/api/v1/bookings/my-bookings', {
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
        // Set demo activity data when not authenticated
        setRecentActivity([
          {
            id: '1',
            type: 'booking',
            description: 'Booked Hair Styling at Elite Beauty Salon',
            date: '2025-09-20',
            icon: 'fas fa-calendar-plus',
            color: 'text-blue-500'
          },
          {
            id: '2', 
            type: 'review',
            description: 'Left review for Massage Therapy at Zen Wellness',
            date: '2025-09-18',
            icon: 'fas fa-star',
            color: 'text-yellow-500'
          }
        ]);
        return;
      }

      // Fetch recent bookings as activity
      const response = await fetch('http://localhost:8000/api/v1/bookings/my-bookings?limit=5', {
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
  };

  const fetchUserStats = async () => {
    try {
      if (!isAuthenticated || !token) return;

      // Fetch bookings count
      const bookingsResponse = await fetch('http://localhost:8000/api/v1/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        const bookings = bookingsData.bookings || [];
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
      if (!isAuthenticated || !token) {
        // Set demo activity data when not authenticated
        setRecentActivity([
          {
            id: '1',
            type: 'booking',
            description: 'Booked Hair Styling at Elite Beauty Salon',
            date: '2025-09-20',
            icon: 'fas fa-calendar-plus',
            color: 'text-blue-500'
          },
          {
            id: '2', 
            type: 'review',
            description: 'Left review for Massage Therapy at Zen Wellness',
            date: '2025-09-18',
            icon: 'fas fa-star',
            color: 'text-yellow-500'
          },
          {
            id: '3',
            type: 'booking',
            description: 'Completed Personal Training at FitZone Gym',
            date: '2025-09-15',
            icon: 'fas fa-check-circle',
            color: 'text-green-500'
          }
        ]);
        return;
      }

      // Fetch recent bookings as activity
      const response = await fetch('http://localhost:8000/api/v1/bookings/my-bookings?limit=5', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        const bookings = data.bookings || [];
        
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
        // Fallback to demo data if API fails
        setRecentActivity([
          {
            id: '1',
            type: 'booking', 
            description: 'Booked Hair Styling at Elite Beauty Salon',
            date: '2025-09-20',
            icon: 'fas fa-calendar-plus',
            color: 'text-blue-500'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      setRecentActivity([]);
    }
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
        <div className="text-center max-w-md">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="font-medium">Demo Mode</p>
            <p className="text-sm">{error || 'API not available. Showing demo profile data for preview.'}</p>
          </div>
          <button 
            onClick={fetchUserProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try API Connection
          </button>
          <div className="mt-4">
            <button 
              onClick={() => {
                setError(null);
                setDefaultProfileData();
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 ml-2"
            >
              Continue with Demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Debug Info - Remove in production */}
      <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-4 text-sm">
        <strong>Auth Status:</strong> {isAuthenticated ? '✅ Logged In' : '❌ Not Logged In'} | 
        <strong> Token:</strong> {token ? '✅ Present' : '❌ Missing'} |
        <strong> User:</strong> {user ? user.email : 'None'}
        {!isAuthenticated && (
          <div className="mt-2">
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              → Please log in to see real profile data
            </Link>
          </div>
        )}
      </div>
      
      {/* Cover Photo Section */}
      <div className="profile-cover">
        <img 
          src={profileData.coverImage} 
          alt="Cover" 
          className="cover-image"
        />
        <div className="cover-overlay"></div>
        
        {/* Profile Picture and Basic Info */}
        <div className="profile-header">
          <div className="profile-picture-container">
            <img 
              src={profileData.avatar} 
              alt="Profile" 
              className="profile-picture"
            />
            <div className="profile-status"></div>
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

      {/* Main Content */}
      <div className="profile-content">
        {/* Navigation Tabs */}
        <div className="profile-tabs">
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
          <button 
            className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            <i className="fas fa-trophy"></i>
            Achievements
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-content">
              <div className="content-grid">
                {/* Profile Details */}
                <div className="profile-details-card">
                  <div className="card-header">
                    <h3>
                      <i className="fas fa-user-circle"></i>
                      Profile Information
                    </h3>
                  </div>
                  
                  <div className="profile-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>First Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="profile-input"
                          />
                        ) : (
                          <div className="profile-value">{profileData.firstName}</div>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Last Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="profile-input"
                          />
                        ) : (
                          <div className="profile-value">{profileData.lastName}</div>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Email Address</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="profile-input"
                        />
                      ) : (
                        <div className="profile-value">{profileData.email}</div>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="profile-input"
                        />
                      ) : (
                        <div className="profile-value">{profileData.phone}</div>
                      )}
                    </div>

                    <div className="form-group">
                      <label>City</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="profile-input"
                        />
                      ) : (
                        <div className="profile-value">{profileData.city}</div>
                      )}
                    </div>

                    <div className="form-group">
                      <label>About Me</label>
                      {isEditing ? (
                        <textarea
                          value={profileData.about}
                          onChange={(e) => handleInputChange('about', e.target.value)}
                          rows={4}
                          className="profile-textarea"
                        />
                      ) : (
                        <div className="profile-value about-text">{profileData.about}</div>
                      )}
                    </div>

                    {isEditing && (
                      <div className="form-actions">
                        <button onClick={handleSave} className="save-btn">
                          <i className="fas fa-check"></i>
                          Save Changes
                        </button>
                        <button onClick={() => setIsEditing(false)} className="cancel-btn">
                          <i className="fas fa-times"></i>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats and Quick Actions */}
                <div className="sidebar-content">
                  {/* Profile Stats */}
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

                  {/* Quick Actions */}
                  <div className="quick-actions-card">
                    <div className="card-header">
                      <h3>
                        <i className="fas fa-bolt"></i>
                        Quick Actions
                      </h3>
                    </div>
                    <div className="quick-actions">
                      <Link href="/bookings" className="action-item">
                        <i className="fas fa-calendar"></i>
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
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="activity-content">
              <div className="activity-card">
                <div className="card-header">
                  <h3>
                    <i className="fas fa-history"></i>
                    Recent Activity
                  </h3>
                </div>
                <div className="activity-list">
                  {recentActivity.map((activity: RecentActivity) => (
                    <div key={activity.id} className="activity-item">
                      <div className={`activity-icon ${activity.color}`}>
                        <i className={activity.icon}></i>
                      </div>
                      <div className="activity-content-text">
                        <p className="activity-description">{activity.description}</p>
                        <p className="activity-date">
                          {new Date(activity.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="achievements-content">
              <div className="achievements-card">
                <div className="card-header">
                  <h3>
                    <i className="fas fa-trophy"></i>
                    Your Achievements
                  </h3>
                </div>
                <div className="achievements-grid">
                  {achievements.map((achievement: any, index: number) => (
                    <div key={index} className="achievement-item">
                      <div className="achievement-icon">
                        <i className={achievement.icon}></i>
                      </div>
                      <div className="achievement-info">
                        <h4>{achievement.name}</h4>
                        <p>{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
