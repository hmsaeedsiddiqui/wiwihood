'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  Tag,
  User,
  ChevronRight,
  ArrowLeft,
  Share2,
  BookOpen
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishDate: string;
  readTime: number;
  image: string;
  tags: string[];
  featured: boolean;
}

// Mock blog data matching the design from the attachment
const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Top 5 Skincare Tips for Glowing Skin',
    excerpt: 'Discover the essential skincare tips that will help you achieve that perfect glowing complexion you\'ve always wanted.',
    content: 'Your skin is your largest organ and deserves the best care possible. Here are the top 5 skincare tips that dermatologists swear by for achieving that perfect glow...',
    category: 'Skincare Tips',
    author: 'Dr. Sarah Johnson',
    publishDate: '2025-02-20',
    readTime: 5,
    image: '/blog1.jpg',
    tags: ['skincare', 'beauty', 'tips', 'glowing-skin'],
    featured: true
  },
  {
    id: '2',
    title: 'The Ultimate Guide to Stress Relief with Massage',
    excerpt: 'Learn how different massage techniques can help you relax, reduce stress, and improve your overall well-being.',
    content: 'In today\'s fast-paced world, stress has become a common companion. Massage therapy is one of the most effective ways to combat stress and promote relaxation...',
    category: 'Wellness',
    author: 'Mike Thompson',
    publishDate: '2025-07-30',
    readTime: 7,
    image: '/blog2.jpg',
    tags: ['massage', 'wellness', 'stress-relief', 'relaxation'],
    featured: true
  },
  {
    id: '3',
    title: 'How to Choose the Right Facial Treatment',
    excerpt: 'Navigate through different facial treatments and find the perfect one for your skin type and concerns.',
    content: 'With so many facial treatments available, choosing the right one can be overwhelming. This comprehensive guide will help you make the best decision for your skin...',
    category: 'Beauty',
    author: 'Emily Davis',
    publishDate: '2025-03-15',
    readTime: 6,
    image: '/blog3.jpg',
    tags: ['facial', 'beauty', 'skincare', 'treatment'],
    featured: true
  },
  {
    id: '4',
    title: 'The Benefits of Regular Hair Treatments',
    excerpt: 'Discover why regular hair treatments are essential for maintaining healthy, beautiful hair.',
    content: 'Your hair faces daily challenges from environmental factors, styling tools, and chemical treatments. Regular professional hair treatments can help restore and maintain your hair\'s health...',
    category: 'Hair Care',
    author: 'Jessica Brown',
    publishDate: '2025-01-10',
    readTime: 4,
    image: '/provider1.jpg',
    tags: ['hair-care', 'treatments', 'healthy-hair'],
    featured: false
  },
  {
    id: '5',
    title: 'Wellness Trends to Watch in 2025',
    excerpt: 'Stay ahead of the curve with the latest wellness trends that are shaping the beauty and health industry.',
    content: 'As we move through 2025, new wellness trends are emerging that focus on holistic health and sustainable beauty practices...',
    category: 'Wellness',
    author: 'Dr. Mark Wilson',
    publishDate: '2025-01-05',
    readTime: 8,
    image: '/provider2.jpg',
    tags: ['wellness', 'trends', '2025', 'health'],
    featured: false
  },
  {
    id: '6',
    title: 'DIY Home Spa: Creating Your Perfect Relaxation Space',
    excerpt: 'Transform your home into a relaxing spa sanctuary with these simple tips and tricks.',
    content: 'You don\'t need to visit an expensive spa to enjoy luxury treatments. With a few simple changes, you can create your own spa experience at home...',
    category: 'Wellness',
    author: 'Anna Martinez',
    publishDate: '2024-12-20',
    readTime: 5,
    image: '/provider3.jpg',
    tags: ['diy', 'home-spa', 'relaxation', 'self-care'],
    featured: false
  }
];

const categories = ['All', 'Skincare Tips', 'Wellness', 'Beauty', 'Hair Care'];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(blogPosts);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(blogPosts);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const postsPerPage = 6;
  const featuredPosts = posts.filter(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  useEffect(() => {
    let filtered = posts;

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, posts]);

  const getCurrentPagePosts = () => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Skincare Tips': 'bg-green-100 text-green-800',
      'Wellness': 'bg-blue-100 text-blue-800',
      'Beauty': 'bg-purple-100 text-purple-800',
      'Hair Care': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Stay Informed with Our Latest Updates
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the latest news, tips, and trends in beauty, wellness, and lifestyle.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles, tips, trends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && selectedCategory === 'All' && !searchQuery && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="mr-4">{formatDate(post.publishDate)}</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{post.readTime} min read</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        <span>{post.author}</span>
                      </div>
                      <Link
                        href={`/blog/${post.id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Read More
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* All Posts Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'All' ? 'All Articles' : `${selectedCategory} Articles`}
            </h2>
            <span className="text-gray-500">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading articles...</p>
            </div>
          ) : getCurrentPagePosts().length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">
                {searchQuery ? 'Try adjusting your search terms.' : 'No articles match the selected category.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getCurrentPagePosts().map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="mr-4">{formatDate(post.publishDate)}</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{post.readTime} min read</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        <span>{post.author}</span>
                      </div>
                      <Link
                        href={`/blog/${post.id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Read More
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
