'use client';

import React, { useState } from 'react';

const MyReviewsPage = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [filterRating, setFilterRating] = useState('all');

  const mockReceivedReviews = [
    {
      id: 1,
      rating: 5,
      title: "Excellent logo design work!",
      comment: "The designer exceeded my expectations. The logo perfectly captures our brand identity and the communication throughout the project was outstanding. Highly recommended!",
      reviewer: {
        name: "Sarah Johnson",
        avatar: "/api/placeholder/50/50",
        country: "United States"
      },
      gig: "Professional Logo Design",
      date: "2024-08-25",
      orderId: "#ORD-001",
      helpful: 12,
      verified: true
    },
    {
      id: 2,
      rating: 4,
      title: "Great work, minor revisions needed",
      comment: "The website development was solid. Good functionality and clean code. Had to request a few minor changes but overall very satisfied with the final result.",
      reviewer: {
        name: "Michael Chen",
        avatar: "/api/placeholder/50/50",
        country: "Canada"
      },
      gig: "Website Development with React",
      date: "2024-08-22",
      orderId: "#ORD-002",
      helpful: 8,
      verified: true
    },
    {
      id: 3,
      rating: 5,
      title: "Outstanding marketing strategy!",
      comment: "The social media marketing strategy delivered incredible results. Our engagement increased by 300% in just one month. Professional, creative, and results-driven approach.",
      reviewer: {
        name: "Emma Williams",
        avatar: "/api/placeholder/50/50",
        country: "United Kingdom"
      },
      gig: "Social Media Marketing Strategy",
      date: "2024-08-20",
      orderId: "#ORD-003",
      helpful: 15,
      verified: true
    },
    {
      id: 4,
      rating: 3,
      title: "Good work but communication could improve",
      comment: "The content was well-written and delivered on time. However, communication during the project could have been better. More updates would have been appreciated.",
      reviewer: {
        name: "David Rodriguez",
        avatar: "/api/placeholder/50/50",
        country: "Spain"
      },
      gig: "Content Writing & Copywriting",
      date: "2024-08-18",
      orderId: "#ORD-004",
      helpful: 5,
      verified: true
    },
    {
      id: 5,
      rating: 5,
      title: "Perfect execution!",
      comment: "Absolutely perfect work! The mobile app design is beautiful and user-friendly. The designer understood our requirements perfectly and delivered beyond expectations.",
      reviewer: {
        name: "Lisa Zhang",
        avatar: "/api/placeholder/50/50",
        country: "Singapore"
      },
      gig: "Mobile App UI/UX Design",
      date: "2024-08-15",
      orderId: "#ORD-005",
      helpful: 22,
      verified: true
    }
  ];

  const mockGivenReviews = [
    {
      id: 1,
      rating: 5,
      title: "Excellent buyer communication",
      comment: "Sarah was very clear about her requirements and provided quick feedback. Made the project smooth and enjoyable to work on.",
      reviewee: {
        name: "Sarah Johnson",
        avatar: "/api/placeholder/50/50",
        country: "United States"
      },
      project: "Logo Design Project",
      date: "2024-08-25",
      orderId: "#ORD-001"
    },
    {
      id: 2,
      rating: 4,
      title: "Good collaboration",
      comment: "Michael was professional and patient during the revision process. Clear communication and reasonable expectations.",
      reviewee: {
        name: "Michael Chen",
        avatar: "/api/placeholder/50/50",
        country: "Canada"
      },
      project: "Website Development",
      date: "2024-08-22",
      orderId: "#ORD-002"
    }
  ];

  const filteredReviews = activeTab === 'received' 
    ? mockReceivedReviews.filter(review => 
        filterRating === 'all' || review.rating.toString() === filterRating
      )
    : mockGivenReviews.filter(review => 
        filterRating === 'all' || review.rating.toString() === filterRating
      );

  const reviewStats = {
    totalReviews: mockReceivedReviews.length,
    averageRating: (mockReceivedReviews.reduce((sum, review) => sum + review.rating, 0) / mockReceivedReviews.length).toFixed(1),
    fiveStars: mockReceivedReviews.filter(r => r.rating === 5).length,
    fourStars: mockReceivedReviews.filter(r => r.rating === 4).length,
    threeStars: mockReceivedReviews.filter(r => r.rating === 3).length,
    twoStars: mockReceivedReviews.filter(r => r.rating === 2).length,
    oneStar: mockReceivedReviews.filter(r => r.rating === 1).length
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} style={{ 
        color: index < rating ? '#fbbf24' : '#e5e7eb',
        fontSize: '16px'
      }}>
        ★
      </span>
    ));
  };

  const getRatingPercentage = (stars) => {
    const starKeys = ['', 'oneStar', 'twoStars', 'threeStars', 'fourStars', 'fiveStars'];
    return reviewStats.totalReviews > 0 
      ? Math.round((reviewStats[starKeys[stars]] / reviewStats.totalReviews) * 100)
      : 0;
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: '#1e293b',
            marginBottom: '8px'
          }}>
            My Reviews
          </h1>
          <p style={{ 
            color: '#64748b', 
            fontSize: '16px'
          }}>
            Manage and track your reviews and ratings
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '300px 1fr', 
          gap: '30px'
        }}>
          {/* Sidebar - Review Stats */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            height: 'fit-content'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1e293b',
              marginBottom: '20px'
            }}>
              Review Overview
            </h3>

            {/* Overall Rating */}
            <div style={{ 
              textAlign: 'center',
              marginBottom: '24px',
              padding: '20px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px'
            }}>
              <div style={{ 
                fontSize: '48px', 
                fontWeight: '700', 
                color: '#1e293b',
                marginBottom: '8px'
              }}>
                {reviewStats.averageRating}
              </div>
              <div style={{ marginBottom: '8px' }}>
                {renderStars(Math.round(parseFloat(reviewStats.averageRating)))}
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#64748b'
              }}>
                Based on {reviewStats.totalReviews} reviews
              </div>
            </div>

            {/* Rating Breakdown */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#1e293b',
                marginBottom: '12px'
              }}>
                Rating Breakdown
              </h4>
              
              {[5, 4, 3, 2, 1].map(stars => (
                <div key={stars} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '12px', color: '#64748b', width: '20px' }}>
                    {stars}★
                  </span>
                  <div style={{ 
                    flex: '1',
                    height: '6px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${getRatingPercentage(stars)}%`,
                      height: '100%',
                      backgroundColor: '#fbbf24',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b', width: '30px' }}>
                    {getRatingPercentage(stars)}%
                  </span>
                </div>
              ))}
            </div>

            {/* Filter Options */}
            <div>
              <h4 style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#1e293b',
                marginBottom: '12px'
              }}>
                Filter by Rating
              </h4>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>

          {/* Main Content */}
          <div>
            {/* Tabs */}
            <div style={{ 
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              marginBottom: '24px'
            }}>
              {/* Tab Headers */}
              <div style={{ 
                display: 'flex', 
                borderBottom: '1px solid #e2e8f0'
              }}>
                <button
                  onClick={() => setActiveTab('received')}
                  style={{
                    padding: '16px 24px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    color: activeTab === 'received' ? '#22c55e' : '#64748b',
                    borderBottom: activeTab === 'received' ? '2px solid #22c55e' : '2px solid transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Reviews Received ({mockReceivedReviews.length})
                </button>
                <button
                  onClick={() => setActiveTab('given')}
                  style={{
                    padding: '16px 24px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    color: activeTab === 'given' ? '#22c55e' : '#64748b',
                    borderBottom: activeTab === 'given' ? '2px solid #22c55e' : '2px solid transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Reviews Given ({mockGivenReviews.length})
                </button>
              </div>

              {/* Tab Content */}
              <div style={{ padding: '24px' }}>
                {filteredReviews.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {filteredReviews.map(review => (
                      <div key={review.id} style={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid #e2e8f0'
                      }}>
                        {/* Review Header */}
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'start',
                          marginBottom: '16px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '50%',
                              backgroundColor: '#e2e8f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '18px',
                              fontWeight: '600',
                              color: '#64748b'
                            }}>
                              {(activeTab === 'received' ? review.reviewer.name : review.reviewee.name)
                                .split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h4 style={{ 
                                fontSize: '16px', 
                                fontWeight: '600', 
                                color: '#1e293b',
                                margin: '0 0 4px 0'
                              }}>
                                {activeTab === 'received' ? review.reviewer.name : review.reviewee.name}
                              </h4>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '12px', color: '#64748b' }}>
                                  📍 {activeTab === 'received' ? review.reviewer.country : review.reviewee.country}
                                </span>
                                {activeTab === 'received' && review.verified && (
                                  <span style={{
                                    backgroundColor: '#dcfce7',
                                    color: '#16a34a',
                                    padding: '2px 6px',
                                    borderRadius: '10px',
                                    fontSize: '10px',
                                    fontWeight: '500'
                                  }}>
                                    ✓ Verified
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ marginBottom: '4px' }}>
                              {renderStars(review.rating)}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                              {review.date}
                            </div>
                          </div>
                        </div>

                        {/* Review Content */}
                        <div style={{ marginBottom: '16px' }}>
                          <h3 style={{ 
                            fontSize: '16px', 
                            fontWeight: '600', 
                            color: '#1e293b',
                            marginBottom: '8px'
                          }}>
                            {review.title}
                          </h3>
                          <p style={{ 
                            fontSize: '14px', 
                            color: '#374151',
                            lineHeight: '1.6',
                            margin: '0'
                          }}>
                            {review.comment}
                          </p>
                        </div>

                        {/* Review Footer */}
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          paddingTop: '16px',
                          borderTop: '1px solid #e2e8f0'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>
                              {activeTab === 'received' ? 'Service:' : 'Project:'} {activeTab === 'received' ? review.gig : review.project}
                            </span>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>
                              Order: {review.orderId}
                            </span>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {activeTab === 'received' && (
                              <span style={{ fontSize: '12px', color: '#64748b' }}>
                                👍 {review.helpful} found helpful
                              </span>
                            )}
                            <button style={{
                              backgroundColor: 'transparent',
                              color: '#64748b',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              border: '1px solid #e2e8f0',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}>
                              {activeTab === 'received' ? 'Reply' : 'Edit'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                      No reviews found
                    </h3>
                    <p style={{ color: '#64748b', marginBottom: '24px' }}>
                      {filterRating !== 'all' 
                        ? `No ${filterRating}-star reviews found.`
                        : activeTab === 'received'
                          ? "You haven't received any reviews yet."
                          : "You haven't given any reviews yet."}
                    </p>
                    {filterRating !== 'all' && (
                      <button 
                        onClick={() => setFilterRating('all')}
                        style={{
                          backgroundColor: '#22c55e',
                          color: '#ffffff',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Show All Reviews
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Tips Section */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#1e293b',
                marginBottom: '16px'
              }}>
                💡 Tips for Better Reviews
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '16px'
              }}>
                <div style={{ 
                  backgroundColor: '#f0f9ff',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #bae6fd'
                }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0369a1', marginBottom: '8px' }}>
                    Clear Communication
                  </h4>
                  <p style={{ fontSize: '12px', color: '#0369a1', margin: '0' }}>
                    Always communicate clearly and promptly with your clients
                  </p>
                </div>
                
                <div style={{ 
                  backgroundColor: '#f0fdf4',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #bbf7d0'
                }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#166534', marginBottom: '8px' }}>
                    Exceed Expectations
                  </h4>
                  <p style={{ fontSize: '12px', color: '#166534', margin: '0' }}>
                    Deliver more than what's promised to get those 5-star reviews
                  </p>
                </div>
                
                <div style={{ 
                  backgroundColor: '#fefbf3',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #fed7aa'
                }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#ea580c', marginBottom: '8px' }}>
                    Follow Up
                  </h4>
                  <p style={{ fontSize: '12px', color: '#ea580c', margin: '0' }}>
                    Check in after delivery to ensure client satisfaction
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyReviewsPage;
