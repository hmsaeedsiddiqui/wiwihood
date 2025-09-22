export default function MyReviewsPage() {export default function MyReviewsPage() {'use client';'use client';'use client';

  return (

    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>  return (

      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>

        My Reviews    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>

      </h1>

      <div style={{       <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>

        backgroundColor: 'white', 

        padding: '40px',         My Reviewsimport React, { useState, useEffect } from 'react';

        borderRadius: '8px',

        textAlign: 'center'       </h1>

      }}>

        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>      <div style={{ 

        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>

          No reviews yet        backgroundColor: 'white', 

        </h3>

        <p style={{ color: '#6b7280' }}>        padding: '40px', interface Review {import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';

          Complete more bookings to start receiving reviews from customers!

        </p>        borderRadius: '8px',

      </div>

    </div>        textAlign: 'center'   id: string;

  );

}      }}>

        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>  rating: number;

        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>

          No reviews yet  title?: string;

        </h3>

        <p style={{ color: '#6b7280' }}>  comment?: string;interface Review {interface Review {

          Complete more bookings to start receiving reviews from customers!

        </p>  providerResponse?: string;

      </div>

    </div>  createdAt: string;  id: string;  id: string;

  );

}  customer: {

    firstName: string;  rating: number;  rating: number;

    lastName: string;

  };  title?: string;  title?: string;

  booking: {

    service: {  comment?: string;  comment?: string;

      name: string;

    };  isPublished: boolean;  isPublished: boolean;

  };

}  isVerified: boolean;  isVerified: boolean;



const MyReviewsPage = () => {  providerResponse?: string;  providerResponse?: string;

  const [reviews, setReviews] = useState<Review[]>([]);

  const [loading, setLoading] = useState(true);  providerResponseAt?: string;  providerResponseAt?: string;

  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const [replyText, setReplyText] = useState('');  createdAt: string;  createdAt: string;



  useEffect(() => {  updatedAt: string;  updatedAt: string;

    // Simulated API call - replace with real API

    setTimeout(() => {  customer: {  customer: {

      setReviews([]);

      setLoading(false);    id: string;    id: string;

    }, 1000);

  }, []);    firstName: string;    firstName: string;



  const renderStars = (rating: number) => {    lastName: string;    lastName: string;

    return Array.from({ length: 5 }, (_, i) => (

      <span key={i} style={{ color: i < rating ? '#fbbf24' : '#e5e7eb' }}>★</span>    profileImage?: string;    profileImage?: string;

    ));

  };  };  };



  return (  booking: {  booking: {

    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px' }}>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>    id: string;    id: string;

        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>

          My Reviews    service: {    service: {

        </h1>

        <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '30px' }}>      name: string;      name: string;

          Manage and respond to customer reviews

        </p>    };    };



        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px' }}>    startDateTime: string;    startDateTime: string;

          {loading ? (

            <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>  };  };

              Loading reviews...

            </div>}}

          ) : reviews.length === 0 ? (

            <div style={{ textAlign: 'center', padding: '60px' }}>

              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>

              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>const MyReviewsPage = () => {const MyReviewsPage = () => {

                No reviews yet

              </h3>  const [reviews, setReviews] = useState<Review[]>([]);  const [reviews, setReviews] = useState<Review[]>([]);

              <p style={{ color: '#64748b' }}>

                Complete more bookings to start receiving reviews from customers!  const [loading, setLoading] = useState(true);  const [loading, setLoading] = useState(true);

              </p>

            </div>  const [filterRating, setFilterRating] = useState('all');  const [filterRating, setFilterRating] = useState('all');

          ) : (

            <div>  const [replyingTo, setReplyingTo] = useState<string | null>(null);  const [replyingTo, setReplyingTo] = useState<string | null>(null);

              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' }}>

                Customer Reviews ({reviews.length})  const [replyText, setReplyText] = useState('');  const [replyText, setReplyText] = useState('');

              </h2>

              {/* Reviews will be displayed here when available */}  const [submittingReply, setSubmittingReply] = useState(false);  const [submittingReply, setSubmittingReply] = useState(false);

            </div>

          )}

        </div>

      </div>  // Fetch provider reviews  // Fetch provider reviews

    </div>

  );  useEffect(() => {  useEffect(() => {

};

    fetchProviderReviews();    fetchProviderReviews();

export default MyReviewsPage;
  }, []);  }, []);



  const fetchProviderReviews = async () => {  const fetchProviderReviews = async () => {

    setLoading(true);    setLoading(true);

    try {    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/my-reviews`, {      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/my-reviews`, {

        headers: {        headers: {

          'Authorization': `Bearer ${localStorage.getItem('token')}`,          'Authorization': `Bearer ${localStorage.getItem('token')}`,

          'Content-Type': 'application/json',          'Content-Type': 'application/json',

        },        },

      });      });

            

      if (response.ok) {      if (response.ok) {

        const data = await response.json();        const data = await response.json();

        setReviews(data.data || data || []);        setReviews(data.data || data || []);

      } else {      } else {

        console.error('Failed to fetch reviews');        console.error('Failed to fetch reviews');

        setReviews([]);        setReviews([]);

      }      }

    } catch (error) {    } catch (error) {

      console.error('Error fetching reviews:', error);      console.error('Error fetching reviews:', error);

      setReviews([]);      setReviews([]);

    } finally {    } finally {

      setLoading(false);      setLoading(false);

    }    }

  };  };



  const submitReply = async (reviewId: string) => {  const submitReply = async (reviewId: string) => {

    if (!replyText.trim()) return;    if (!replyText.trim()) return;

        

    setSubmittingReply(true);    setSubmittingReply(true);

    try {    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}/respond`, {      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}/respond`, {

        method: 'POST',        method: 'POST',

        headers: {        headers: {

          'Authorization': `Bearer ${localStorage.getItem('token')}`,          'Authorization': `Bearer ${localStorage.getItem('token')}`,

          'Content-Type': 'application/json',          'Content-Type': 'application/json',

        },        },

        body: JSON.stringify({        body: JSON.stringify({

          response: replyText.trim()          response: replyText.trim()

        }),        }),

      });      });

            

      if (response.ok) {      if (response.ok) {

        // Refresh reviews to show the new response        // Refresh reviews to show the new response

        await fetchProviderReviews();        await fetchProviderReviews();

        setReplyingTo(null);        setReplyingTo(null);

        setReplyText('');        setReplyText('');

      } else {      } else {

        console.error('Failed to submit reply');        console.error('Failed to submit reply');

      }      }

    } catch (error) {    } catch (error) {

      console.error('Error submitting reply:', error);      console.error('Error submitting reply:', error);

    } finally {    } finally {

      setSubmittingReply(false);      setSubmittingReply(false);

    }    }

  };  };



  // Calculate review statistics from real data  // Calculate review statistics from real data

  const reviewStats = {  const reviewStats = {

    totalReviews: reviews.length,    totalReviews: reviews.length,

    averageRating: reviews.length > 0     averageRating: reviews.length > 0 

      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)

      : '0.0'      : '0.0'

  };  };



  // Filter reviews based on selected rating  // Filter reviews based on selected rating

  const filteredReviews = reviews.filter(review => {  const filteredReviews = reviews.filter(review => {

    if (filterRating === 'all') return true;    if (filterRating === 'all') return true;

    return review.rating === parseInt(filterRating);    return review.rating === parseInt(filterRating);

  });  });



  // Calculate rating breakdown percentages  // Calculate rating breakdown percentages

  const getRatingPercentage = (stars: number) => {  const getRatingPercentage = (stars: number) => {

    if (reviews.length === 0) return 0;    if (reviews.length === 0) return 0;

    const count = reviews.filter(review => review.rating === stars).length;    const count = reviews.filter(review => review.rating === stars).length;

    return Math.round((count / reviews.length) * 100);    return Math.round((count / reviews.length) * 100);

  };  };



  // Render star rating  // Render star rating

  const renderStars = (rating: number) => {  const renderStars = (rating: number) => {

    return Array.from({ length: 5 }, (_, index) => (    return Array.from({ length: 5 }, (_, index) => (

      <span      <span

        key={index}        key={index}

        style={{        style={{

          color: index < rating ? '#fbbf24' : '#e5e7eb',          color: index < rating ? '#fbbf24' : '#e5e7eb',

          fontSize: '16px'          fontSize: '16px'

        }}        }}

      >      >

        ★        ★

      </span>      </span>

    ));    ));

  };  };

        country: "United States"

  return (      },

    <div style={{       project: "Logo Design Project",

      minHeight: '100vh',       date: "2024-08-25",

      backgroundColor: '#f8fafc',      orderId: "#ORD-001"

      padding: '20px'    },

    }}>    {

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>      id: 2,

        {/* Header */}      rating: 4,

        <div style={{ marginBottom: '30px' }}>      title: "Good collaboration",

          <h1 style={{       comment: "Michael was professional and patient during the revision process. Clear communication and reasonable expectations.",

            fontSize: '28px',       reviewee: {

            fontWeight: '700',         name: "Michael Chen",

            color: '#1e293b',        avatar: "/api/placeholder/50/50",

            marginBottom: '8px'        country: "Canada"

          }}>      },

            My Reviews      project: "Website Development",

          </h1>      date: "2024-08-22",

          <p style={{       orderId: "#ORD-002"

            color: '#64748b',     }

            fontSize: '16px'  ];

          }}>

            Manage and respond to customer reviews  const filteredReviews = activeTab === 'received' 

          </p>    ? mockReceivedReviews.filter(review => 

        </div>        filterRating === 'all' || review.rating.toString() === filterRating

      )

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px' }}>    : mockGivenReviews.filter(review => 

          {/* Main Content */}        filterRating === 'all' || review.rating.toString() === filterRating

          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px' }}>      );

            {/* Reviews List */}

            {loading ? (  const reviewStats = {

              <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>    totalReviews: mockReceivedReviews.length,

                <div style={{ fontSize: '20px', marginBottom: '16px' }}>Loading reviews...</div>    averageRating: (mockReceivedReviews.reduce((sum, review) => sum + review.rating, 0) / mockReceivedReviews.length).toFixed(1),

              </div>    fiveStars: mockReceivedReviews.filter(r => r.rating === 5).length,

            ) : filteredReviews.length === 0 ? (    fourStars: mockReceivedReviews.filter(r => r.rating === 4).length,

              <div style={{ textAlign: 'center', padding: '60px' }}>    threeStars: mockReceivedReviews.filter(r => r.rating === 3).length,

                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>    twoStars: mockReceivedReviews.filter(r => r.rating === 2).length,

                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>    oneStar: mockReceivedReviews.filter(r => r.rating === 1).length

                  No reviews found  };

                </h3>

                <p style={{ color: '#64748b', marginBottom: '24px' }}>  const renderStars = (rating) => {

                  {filterRating === 'all'     return Array.from({ length: 5 }, (_, index) => (

                    ? 'You haven\'t received any reviews yet. Complete more bookings to start receiving reviews!'      <span key={index} style={{ 

                    : `No ${filterRating}-star reviews found. Try selecting a different rating filter.`        color: index < rating ? '#fbbf24' : '#e5e7eb',

                  }        fontSize: '16px'

                </p>      }}>

              </div>        ★

            ) : (      </span>

              <div>    ));

                <h2 style={{   };

                  fontSize: '20px', 

                  fontWeight: '600',   const getRatingPercentage = (stars) => {

                  color: '#1e293b',    const starKeys = ['', 'oneStar', 'twoStars', 'threeStars', 'fourStars', 'fiveStars'];

                  marginBottom: '20px'    return reviewStats.totalReviews > 0 

                }}>      ? Math.round((reviewStats[starKeys[stars]] / reviewStats.totalReviews) * 100)

                  Customer Reviews ({filteredReviews.length})      : 0;

                </h2>  };

                

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>  return (

                  {filteredReviews.map((review) => (    <div style={{ 

                    <div key={review.id} style={{      minHeight: '100vh', 

                      border: '1px solid #e2e8f0',      backgroundColor: '#f8fafc',

                      borderRadius: '8px',      padding: '20px'

                      padding: '20px',    }}>

                      backgroundColor: '#ffffff'      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                    }}>        {/* Header */}

                      {/* Review Header */}        <div style={{ marginBottom: '30px' }}>

                      <div style={{           <h1 style={{ 

                        display: 'flex',             fontSize: '28px', 

                        justifyContent: 'space-between',             fontWeight: '700', 

                        alignItems: 'flex-start',            color: '#1e293b',

                        marginBottom: '16px'            marginBottom: '8px'

                      }}>          }}>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>            My Reviews

                          <div style={{          </h1>

                            width: '48px',          <p style={{ 

                            height: '48px',            color: '#64748b', 

                            borderRadius: '50%',            fontSize: '16px'

                            backgroundColor: '#3b82f6',          }}>

                            display: 'flex',            Manage and track your reviews and ratings

                            alignItems: 'center',          </p>

                            justifyContent: 'center',        </div>

                            color: '#ffffff',

                            fontWeight: '600',        <div style={{ 

                            fontSize: '16px'          display: 'grid', 

                          }}>          gridTemplateColumns: '300px 1fr', 

                            {review.customer.firstName[0]}{review.customer.lastName[0]}          gap: '30px'

                          </div>        }}>

                          <div>          {/* Sidebar - Review Stats */}

                            <div style={{           <div style={{

                              fontSize: '16px',             backgroundColor: '#ffffff',

                              fontWeight: '600',             borderRadius: '12px',

                              color: '#1e293b',            padding: '24px',

                              display: 'flex',            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',

                              alignItems: 'center',            border: '1px solid #e2e8f0',

                              gap: '8px'            height: 'fit-content'

                            }}>          }}>

                              {review.customer.firstName} {review.customer.lastName}            <h3 style={{ 

                              {review.isVerified && (              fontSize: '18px', 

                                <span style={{               fontWeight: '600', 

                                  backgroundColor: '#10b981',               color: '#1e293b',

                                  color: '#ffffff',              marginBottom: '20px'

                                  fontSize: '10px',            }}>

                                  padding: '2px 6px',              Review Overview

                                  borderRadius: '4px',            </h3>

                                  fontWeight: '500'

                                }}>            {/* Overall Rating */}

                                  VERIFIED            <div style={{ 

                                </span>              textAlign: 'center',

                              )}              marginBottom: '24px',

                            </div>              padding: '20px',

                            <div style={{ fontSize: '12px', color: '#64748b' }}>              backgroundColor: '#f8fafc',

                              {new Date(review.createdAt).toLocaleDateString()}              borderRadius: '8px'

                            </div>            }}>

                          </div>              <div style={{ 

                        </div>                fontSize: '48px', 

                                        fontWeight: '700', 

                        <div style={{ textAlign: 'right' }}>                color: '#1e293b',

                          <div style={{ marginBottom: '4px' }}>                marginBottom: '8px'

                            {renderStars(review.rating)}              }}>

                          </div>                {reviewStats.averageRating}

                          <div style={{ fontSize: '12px', color: '#64748b' }}>              </div>

                            Service: {review.booking.service.name}              <div style={{ marginBottom: '8px' }}>

                          </div>                {renderStars(Math.round(parseFloat(reviewStats.averageRating)))}

                        </div>              </div>

                      </div>              <div style={{ 

                fontSize: '14px', 

                      {/* Review Content */}                color: '#64748b'

                      {review.title && (              }}>

                        <h4 style={{                 Based on {reviewStats.totalReviews} reviews

                          fontSize: '16px',               </div>

                          fontWeight: '600',             </div>

                          color: '#1e293b',

                          marginBottom: '8px'            {/* Rating Breakdown */}

                        }}>            <div style={{ marginBottom: '24px' }}>

                          {review.title}              <h4 style={{ 

                        </h4>                fontSize: '14px', 

                      )}                fontWeight: '600', 

                                      color: '#1e293b',

                      {review.comment && (                marginBottom: '12px'

                        <p style={{               }}>

                          color: '#374151',                 Rating Breakdown

                          lineHeight: '1.6',              </h4>

                          marginBottom: '16px'              

                        }}>              {[5, 4, 3, 2, 1].map(stars => (

                          {review.comment}                <div key={stars} style={{ 

                        </p>                  display: 'flex', 

                      )}                  alignItems: 'center', 

                  gap: '8px',

                      {/* Provider Response */}                  marginBottom: '8px'

                      {review.providerResponse ? (                }}>

                        <div style={{                  <span style={{ fontSize: '12px', color: '#64748b', width: '20px' }}>

                          backgroundColor: '#f8fafc',                    {stars}★

                          borderLeft: '4px solid #3b82f6',                  </span>

                          padding: '16px',                  <div style={{ 

                          marginBottom: '16px',                    flex: '1',

                          borderRadius: '0 8px 8px 0'                    height: '6px',

                        }}>                    backgroundColor: '#f1f5f9',

                          <div style={{                     borderRadius: '3px',

                            fontSize: '14px',                     overflow: 'hidden'

                            fontWeight: '600',                   }}>

                            color: '#1e293b',                    <div style={{

                            marginBottom: '8px'                      width: `${getRatingPercentage(stars)}%`,

                          }}>                      height: '100%',

                            Your Response                      backgroundColor: '#fbbf24',

                          </div>                      transition: 'width 0.3s ease'

                          <p style={{                     }}></div>

                            color: '#374151',                   </div>

                            fontSize: '14px',                  <span style={{ fontSize: '12px', color: '#64748b', width: '30px' }}>

                            lineHeight: '1.5',                    {getRatingPercentage(stars)}%

                            marginBottom: '8px'                  </span>

                          }}>                </div>

                            {review.providerResponse}              ))}

                          </p>            </div>

                          <div style={{ fontSize: '12px', color: '#64748b' }}>

                            Responded on {new Date(review.providerResponseAt!).toLocaleDateString()}            {/* Filter Options */}

                          </div>            <div>

                        </div>              <h4 style={{ 

                      ) : (                fontSize: '14px', 

                        // Reply Form                fontWeight: '600', 

                        replyingTo === review.id ? (                color: '#1e293b',

                          <div style={{                marginBottom: '12px'

                            backgroundColor: '#f8fafc',              }}>

                            padding: '16px',                Filter by Rating

                            borderRadius: '8px',              </h4>

                            marginBottom: '16px'              <select

                          }}>                value={filterRating}

                            <div style={{                 onChange={(e) => setFilterRating(e.target.value)}

                              fontSize: '14px',                 style={{

                              fontWeight: '600',                   width: '100%',

                              color: '#1e293b',                  padding: '8px 12px',

                              marginBottom: '12px'                  borderRadius: '6px',

                            }}>                  border: '1px solid #e2e8f0',

                              Write a response to this review:                  fontSize: '14px',

                            </div>                  backgroundColor: '#ffffff',

                            <textarea                  outline: 'none'

                              value={replyText}                }}

                              onChange={(e) => setReplyText(e.target.value)}              >

                              placeholder="Write a professional response to this customer review..."                <option value="all">All Ratings</option>

                              style={{                <option value="5">5 Stars</option>

                                width: '100%',                <option value="4">4 Stars</option>

                                minHeight: '80px',                <option value="3">3 Stars</option>

                                padding: '12px',                <option value="2">2 Stars</option>

                                border: '1px solid #e2e8f0',                <option value="1">1 Star</option>

                                borderRadius: '6px',              </select>

                                fontSize: '14px',            </div>

                                resize: 'vertical',          </div>

                                outline: 'none',

                                fontFamily: 'inherit'          {/* Main Content */}

                              }}          <div>

                            />            {/* Tabs */}

                            <div style={{             <div style={{ 

                              display: 'flex',               backgroundColor: '#ffffff',

                              gap: '8px',               borderRadius: '12px',

                              marginTop: '12px',              overflow: 'hidden',

                              justifyContent: 'flex-end'              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',

                            }}>              border: '1px solid #e2e8f0',

                              <button              marginBottom: '24px'

                                onClick={() => {            }}>

                                  setReplyingTo(null);              {/* Tab Headers */}

                                  setReplyText('');              <div style={{ 

                                }}                display: 'flex', 

                                style={{                borderBottom: '1px solid #e2e8f0'

                                  backgroundColor: 'transparent',              }}>

                                  color: '#64748b',                <button

                                  padding: '8px 16px',                  onClick={() => setActiveTab('received')}

                                  borderRadius: '6px',                  style={{

                                  border: '1px solid #e2e8f0',                    padding: '16px 24px',

                                  fontSize: '14px',                    border: 'none',

                                  cursor: 'pointer'                    backgroundColor: 'transparent',

                                }}                    fontSize: '14px',

                              >                    fontWeight: '500',

                                Cancel                    cursor: 'pointer',

                              </button>                    color: activeTab === 'received' ? '#22c55e' : '#64748b',

                              <button                    borderBottom: activeTab === 'received' ? '2px solid #22c55e' : '2px solid transparent',

                                onClick={() => submitReply(review.id)}                    transition: 'all 0.2s ease'

                                disabled={!replyText.trim() || submittingReply}                  }}

                                style={{                >

                                  backgroundColor: replyText.trim() ? '#3b82f6' : '#e2e8f0',                  Reviews Received ({mockReceivedReviews.length})

                                  color: replyText.trim() ? '#ffffff' : '#9ca3af',                </button>

                                  padding: '8px 16px',                <button

                                  borderRadius: '6px',                  onClick={() => setActiveTab('given')}

                                  border: 'none',                  style={{

                                  fontSize: '14px',                    padding: '16px 24px',

                                  fontWeight: '500',                    border: 'none',

                                  cursor: replyText.trim() ? 'pointer' : 'not-allowed'                    backgroundColor: 'transparent',

                                }}                    fontSize: '14px',

                              >                    fontWeight: '500',

                                {submittingReply ? 'Posting...' : 'Post Response'}                    cursor: 'pointer',

                              </button>                    color: activeTab === 'given' ? '#22c55e' : '#64748b',

                            </div>                    borderBottom: activeTab === 'given' ? '2px solid #22c55e' : '2px solid transparent',

                          </div>                    transition: 'all 0.2s ease'

                        ) : (                  }}

                          <div style={{                 >

                            display: 'flex',                   Reviews Given ({mockGivenReviews.length})

                            justifyContent: 'flex-end'                </button>

                          }}>              </div>

                            <button

                              onClick={() => setReplyingTo(review.id)}              {/* Tab Content */}

                              style={{              <div style={{ padding: '24px' }}>

                                backgroundColor: 'transparent',                {filteredReviews.length > 0 ? (

                                color: '#3b82f6',                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                                padding: '8px 16px',                    {filteredReviews.map(review => (

                                borderRadius: '6px',                      <div key={review.id} style={{

                                border: '1px solid #3b82f6',                        backgroundColor: '#f8fafc',

                                fontSize: '14px',                        borderRadius: '12px',

                                fontWeight: '500',                        padding: '24px',

                                cursor: 'pointer'                        border: '1px solid #e2e8f0'

                              }}                      }}>

                            >                        {/* Review Header */}

                              Reply to Review                        <div style={{ 

                            </button>                          display: 'flex', 

                          </div>                          justifyContent: 'space-between', 

                        )                          alignItems: 'start',

                      )}                          marginBottom: '16px'

                    </div>                        }}>

                  ))}                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

                </div>                            <div style={{

              </div>                              width: '50px',

            )}                              height: '50px',

          </div>                              borderRadius: '50%',

                              backgroundColor: '#e2e8f0',

          {/* Sidebar */}                              display: 'flex',

          <div>                              alignItems: 'center',

            <div style={{                               justifyContent: 'center',

              backgroundColor: '#ffffff',                               fontSize: '18px',

              borderRadius: '8px',                               fontWeight: '600',

              padding: '20px',                              color: '#64748b'

              marginBottom: '20px'                            }}>

            }}>                              {(activeTab === 'received' ? review.reviewer.name : review.reviewee.name)

              <h3 style={{                                 .split(' ').map(n => n[0]).join('')}

                fontSize: '16px',                             </div>

                fontWeight: '600',                             <div>

                color: '#1e293b',                              <h4 style={{ 

                marginBottom: '20px'                                fontSize: '16px', 

              }}>                                fontWeight: '600', 

                Review Overview                                color: '#1e293b',

              </h3>                                margin: '0 0 4px 0'

                              }}>

              {/* Overall Rating */}                                {activeTab === 'received' ? review.reviewer.name : review.reviewee.name}

              <div style={{                               </h4>

                textAlign: 'center',                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

                marginBottom: '24px',                                <span style={{ fontSize: '12px', color: '#64748b' }}>

                padding: '20px',                                  📍 {activeTab === 'received' ? review.reviewer.country : review.reviewee.country}

                backgroundColor: '#f8fafc',                                </span>

                borderRadius: '8px'                                {activeTab === 'received' && review.verified && (

              }}>                                  <span style={{

                <div style={{                                     backgroundColor: '#dcfce7',

                  fontSize: '48px',                                     color: '#16a34a',

                  fontWeight: '700',                                     padding: '2px 6px',

                  color: '#1e293b',                                    borderRadius: '10px',

                  marginBottom: '8px'                                    fontSize: '10px',

                }}>                                    fontWeight: '500'

                  {reviewStats.averageRating}                                  }}>

                </div>                                    ✓ Verified

                <div style={{ marginBottom: '8px' }}>                                  </span>

                  {renderStars(Math.round(parseFloat(reviewStats.averageRating)))}                                )}

                </div>                              </div>

                <div style={{                             </div>

                  fontSize: '14px',                           </div>

                  color: '#64748b'                          

                }}>                          <div style={{ textAlign: 'right' }}>

                  Based on {reviewStats.totalReviews} reviews                            <div style={{ marginBottom: '4px' }}>

                </div>                              {renderStars(review.rating)}

              </div>                            </div>

                            <div style={{ fontSize: '12px', color: '#64748b' }}>

              {/* Rating Breakdown */}                              {review.date}

              <div style={{ marginBottom: '24px' }}>                            </div>

                <h4 style={{                           </div>

                  fontSize: '14px',                         </div>

                  fontWeight: '600', 

                  color: '#1e293b',                        {/* Review Content */}

                  marginBottom: '12px'                        <div style={{ marginBottom: '16px' }}>

                }}>                          <h3 style={{ 

                  Rating Breakdown                            fontSize: '16px', 

                </h4>                            fontWeight: '600', 

                                            color: '#1e293b',

                {[5, 4, 3, 2, 1].map(stars => (                            marginBottom: '8px'

                  <div key={stars} style={{                           }}>

                    display: 'flex',                             {review.title}

                    alignItems: 'center',                           </h3>

                    gap: '8px',                          <p style={{ 

                    marginBottom: '8px'                            fontSize: '14px', 

                  }}>                            color: '#374151',

                    <span style={{ fontSize: '12px', color: '#64748b', width: '20px' }}>                            lineHeight: '1.6',

                      {stars}★                            margin: '0'

                    </span>                          }}>

                    <div style={{                             {review.comment}

                      flex: '1',                          </p>

                      height: '6px',                        </div>

                      backgroundColor: '#f1f5f9',

                      borderRadius: '3px',                        {/* Review Footer */}

                      overflow: 'hidden'                        <div style={{ 

                    }}>                          display: 'flex', 

                      <div style={{                          justifyContent: 'space-between', 

                        width: `${getRatingPercentage(stars)}%`,                          alignItems: 'center',

                        height: '100%',                          paddingTop: '16px',

                        backgroundColor: '#fbbf24',                          borderTop: '1px solid #e2e8f0'

                        transition: 'width 0.3s ease'                        }}>

                      }}></div>                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

                    </div>                            <span style={{ fontSize: '12px', color: '#64748b' }}>

                    <span style={{ fontSize: '12px', color: '#64748b', width: '30px' }}>                              {activeTab === 'received' ? 'Service:' : 'Project:'} {activeTab === 'received' ? review.gig : review.project}

                      {getRatingPercentage(stars)}%                            </span>

                    </span>                            <span style={{ fontSize: '12px', color: '#64748b' }}>

                  </div>                              Order: {review.orderId}

                ))}                            </span>

              </div>                          </div>

                          

              {/* Filter Options */}                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

              <div>                            {activeTab === 'received' && (

                <h4 style={{                               <span style={{ fontSize: '12px', color: '#64748b' }}>

                  fontSize: '14px',                                 👍 {review.helpful} found helpful

                  fontWeight: '600',                               </span>

                  color: '#1e293b',                            )}

                  marginBottom: '12px'                            <button style={{

                }}>                              backgroundColor: 'transparent',

                  Filter by Rating                              color: '#64748b',

                </h4>                              padding: '6px 12px',

                <select                              borderRadius: '6px',

                  value={filterRating}                              border: '1px solid #e2e8f0',

                  onChange={(e) => setFilterRating(e.target.value)}                              fontSize: '12px',

                  style={{                              cursor: 'pointer'

                    width: '100%',                            }}>

                    padding: '8px 12px',                              {activeTab === 'received' ? 'Reply' : 'Edit'}

                    borderRadius: '6px',                            </button>

                    border: '1px solid #e2e8f0',                          </div>

                    fontSize: '14px',                        </div>

                    backgroundColor: '#ffffff',                      </div>

                    outline: 'none'                    ))}

                  }}                  </div>

                >                ) : (

                  <option value="all">All Ratings</option>                  <div style={{

                  <option value="5">5 Stars</option>                    textAlign: 'center',

                  <option value="4">4 Stars</option>                    padding: '60px 20px'

                  <option value="3">3 Stars</option>                  }}>

                  <option value="2">2 Stars</option>                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>

                  <option value="1">1 Star</option>                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>

                </select>                      No reviews found

              </div>                    </h3>

            </div>                    <p style={{ color: '#64748b', marginBottom: '24px' }}>

          </div>                      {filterRating !== 'all' 

        </div>                        ? `No ${filterRating}-star reviews found.`

      </div>                        : activeTab === 'received'

    </div>                          ? "You haven't received any reviews yet."

  );                          : "You haven't given any reviews yet."}

};                    </p>

                    {filterRating !== 'all' && (

export default MyReviewsPage;                      <button 
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
