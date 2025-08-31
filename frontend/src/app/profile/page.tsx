"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const demoProfile = {
  id: 1,
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@example.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face',
  coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=300&fit=crop',
  joinDate: '2024-03-15',
  city: 'New York, NY',
  about: 'Love trying new beauty and wellness services. Always looking for the best providers in the city! Passionate about self-care and discovering amazing local businesses.',
  preferences: {
    notifications: true,
    marketing: false,
    reminders: true
  },
  stats: {
    totalBookings: 12,
    completedBookings: 8,
    favoriteProviders: 3,
    reviewsLeft: 5,
    loyaltyPoints: 250
  }
};

const demoRecentActivity = [
  {
    id: 1,
    type: 'booking',
    description: 'Booked Hair Cut & Styling at Elite Hair Studio',
    date: '2025-08-27',
    icon: 'fas fa-calendar-plus',
    color: 'text-blue-500'
  },
  {
    id: 2,
    type: 'review',
    description: 'Left a 5-star review for Zen Wellness Spa',
    date: '2025-08-25',
    icon: 'fas fa-star',
    color: 'text-yellow-500'
  },
  {
    id: 3,
    type: 'favorite',
    description: 'Added Glow Studio to favorites',
    date: '2025-08-23',
    icon: 'fas fa-heart',
    color: 'text-red-500'
  },
  {
    id: 4,
    type: 'booking',
    description: 'Completed Massage Therapy at Zen Wellness Spa',
    date: '2025-08-20',
    icon: 'fas fa-check-circle',
    color: 'text-green-500'
  }
];

const achievements = [
  { name: 'First Booking', icon: 'fas fa-trophy', description: 'Made your first booking' },
  { name: 'Review Master', icon: 'fas fa-medal', description: 'Left 5+ reviews' },
  { name: 'Loyal Customer', icon: 'fas fa-crown', description: 'Regular customer' }
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(demoProfile);
  const [activeTab, setActiveTab] = useState('overview');

  const handleSave = () => {
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData({ ...profileData, [field]: value });
  };

  return (
    <div className="profile-container">
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
              Member since {new Date(profileData.joinDate).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
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
                        <div className="stat-number">{profileData.stats.totalBookings}</div>
                        <div className="stat-label">Total Bookings</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">{profileData.stats.completedBookings}</div>
                        <div className="stat-label">Completed</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">{profileData.stats.favoriteProviders}</div>
                        <div className="stat-label">Favorites</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">{profileData.stats.loyaltyPoints}</div>
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
                  {demoRecentActivity.map(activity => (
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
                  {achievements.map((achievement, index) => (
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
