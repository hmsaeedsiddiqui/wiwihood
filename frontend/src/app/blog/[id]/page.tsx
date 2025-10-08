'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Share2, 
  Tag,
  Heart,
  MessageCircle,
  BookmarkPlus,
  ChevronRight
} from 'lucide-react';

// Mock blog data (same as in the main blog page)
const blogPosts = [
  {
    id: '1',
    title: 'Top 5 Skincare Tips for Glowing Skin',
    excerpt: 'Discover the essential skincare tips that will help you achieve that perfect glowing complexion you\'ve always wanted.',
    content: `
    <h2>Introduction</h2>
    <p>Your skin is your largest organ and deserves the best care possible. Achieving that perfect glow isn't just about expensive products – it's about understanding your skin and following a consistent routine that works for you.</p>
    
    <h2>1. Cleanse Gently, But Thoroughly</h2>
    <p>The foundation of any good skincare routine starts with proper cleansing. Use a gentle, pH-balanced cleanser that removes dirt, oil, and makeup without stripping your skin's natural moisture barrier.</p>
    <ul>
      <li>Choose a cleanser suitable for your skin type</li>
      <li>Cleanse twice daily – morning and evening</li>
      <li>Use lukewarm water, not hot water</li>
      <li>Pat dry with a clean towel</li>
    </ul>
    
    <h2>2. Hydrate Inside and Out</h2>
    <p>Hydration is key to healthy, glowing skin. This means drinking plenty of water and using the right moisturizer for your skin type.</p>
    
    <h2>3. Never Skip Sunscreen</h2>
    <p>Sun protection is the most important anti-aging step you can take. Use a broad-spectrum SPF 30 or higher every day, even when it's cloudy.</p>
    
    <h2>4. Exfoliate Regularly</h2>
    <p>Regular exfoliation helps remove dead skin cells and promotes cell turnover, revealing brighter, smoother skin underneath.</p>
    
    <h2>5. Get Your Beauty Sleep</h2>
    <p>Your skin repairs itself while you sleep. Aim for 7-9 hours of quality sleep each night for the best results.</p>
    
    <h2>Conclusion</h2>
    <p>Remember, consistency is key when it comes to skincare. Give your routine time to work – most people start seeing results after 4-6 weeks of consistent use.</p>
    `,
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
    content: `
    <h2>Understanding Stress and Its Impact</h2>
    <p>In today's fast-paced world, stress has become a common companion. Chronic stress can affect both your physical and mental health, leading to issues like muscle tension, headaches, and sleep problems.</p>
    
    <h2>How Massage Helps Combat Stress</h2>
    <p>Massage therapy is one of the most effective ways to combat stress and promote relaxation. It works by:</p>
    <ul>
      <li>Reducing cortisol levels (the stress hormone)</li>
      <li>Increasing serotonin and dopamine production</li>
      <li>Improving blood circulation</li>
      <li>Releasing muscle tension</li>
    </ul>
    
    <h2>Types of Massage for Stress Relief</h2>
    <h3>Swedish Massage</h3>
    <p>A gentle, relaxing massage that uses long strokes and light pressure to promote overall relaxation.</p>
    
    <h3>Deep Tissue Massage</h3>
    <p>Targets deeper layers of muscle and connective tissue to release chronic tension and stress.</p>
    
    <h3>Hot Stone Massage</h3>
    <p>Uses heated stones to warm and relax muscles, providing deep relaxation and stress relief.</p>
    
    <h2>Creating a Relaxing Environment</h2>
    <p>The environment plays a crucial role in the effectiveness of massage therapy. Look for spas that offer:</p>
    <ul>
      <li>Calm, peaceful settings</li>
      <li>Soft lighting and relaxing music</li>
      <li>Comfortable temperature</li>
      <li>Professional, certified therapists</li>
    </ul>
    `,
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
    content: `
    <h2>Understanding Your Skin Type</h2>
    <p>Before choosing a facial treatment, it's essential to understand your skin type and specific concerns. This will help you select the most appropriate treatment for your needs.</p>
    
    <h2>Common Skin Types</h2>
    <h3>Normal Skin</h3>
    <p>Balanced, neither too oily nor too dry, with minimal sensitivity.</p>
    
    <h3>Oily Skin</h3>
    <p>Produces excess sebum, often resulting in a shiny appearance and enlarged pores.</p>
    
    <h3>Dry Skin</h3>
    <p>Lacks moisture and may appear flaky or tight, especially after cleansing.</p>
    
    <h3>Combination Skin</h3>
    <p>Features both oily and dry areas, typically with an oily T-zone and dry cheeks.</p>
    
    <h2>Popular Facial Treatments</h2>
    <h3>Classic European Facial</h3>
    <p>A comprehensive treatment that includes cleansing, exfoliation, extraction, and moisturizing.</p>
    
    <h3>HydraFacial</h3>
    <p>A non-invasive treatment that cleanses, exfoliates, and hydrates the skin using patented technology.</p>
    
    <h3>Chemical Peels</h3>
    <p>Use acids to remove dead skin cells and promote new cell growth for smoother, brighter skin.</p>
    
    <h2>Choosing the Right Treatment</h2>
    <p>Consider your skin type, concerns, sensitivity level, and desired results when selecting a facial treatment. Consult with a professional esthetician for personalized recommendations.</p>
    `,
    category: 'Beauty',
    author: 'Emily Davis',
    publishDate: '2025-03-15',
    readTime: 6,
    image: '/blog3.jpg',
    tags: ['facial', 'beauty', 'skincare', 'treatment'],
    featured: true
  }
];

const relatedPosts = [
  {
    id: '4',
    title: 'The Benefits of Regular Hair Treatments',
    category: 'Hair Care',
    readTime: 4,
    image: '/provider1.jpg'
  },
  {
    id: '5', 
    title: 'Wellness Trends to Watch in 2025',
    category: 'Wellness',
    readTime: 8,
    image: '/provider2.jpg'
  },
  {
    id: '6',
    title: 'DIY Home Spa: Creating Your Perfect Relaxation Space',
    category: 'Wellness',
    readTime: 5,
    image: '/provider3.jpg'
  }
];

export default function BlogPostPage() {
  const params = useParams();
  const postId = params?.id as string;
  
  const post = blogPosts.find(p => p.id === postId);
  
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

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
      {/* Header with breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/blog" className="hover:text-gray-700">Blog</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">{post.title}</span>
          </nav>
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-4">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
              {post.category}
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span>By {post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{formatDate(post.publishDate)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>{post.readTime} min read</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Social Share Buttons */}
        <div className="flex items-center justify-between mb-8 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
              <Heart className="h-5 w-5" />
              <span>Like</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <MessageCircle className="h-5 w-5" />
              <span>Comment</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
              <BookmarkPlus className="h-5 w-5" />
              <span>Save</span>
            </button>
          </div>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
            <Share2 className="h-5 w-5" />
            <span>Share</span>
          </button>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Author Bio */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-12">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
              {post.author.split(' ').map(name => name[0]).join('')}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{post.author}</h3>
              <p className="text-gray-600">Beauty & Wellness Expert</p>
            </div>
          </div>
          <p className="text-gray-700">
            Passionate about helping people discover their best selves through beauty, wellness, and self-care practices. 
            With years of experience in the industry, I love sharing tips and insights that make a real difference.
          </p>
        </div>

        {/* Related Posts */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`} className="group">
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={relatedPost.image}
                    alt={relatedPost.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                  {relatedPost.title}
                </h4>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-3">{relatedPost.category}</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{relatedPost.readTime} min read</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}