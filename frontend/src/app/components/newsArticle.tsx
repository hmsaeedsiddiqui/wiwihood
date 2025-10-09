import React from 'react'

function NewsArticle() {
  const articles = [
    {
      id: 1,
      title: "Nail art trends: this season's elegant shades",
      category: "Body Treatment",
      author: "Admin",
      image: "/service1.png",
      readMore: "Read More"
    },
    {
      id: 2,
      title: "Nail art trends: this season's elegant shades",
      category: "Body Treatment",
      author: "Admin",
      image: "/service1.png",
      readMore: "Read More"
    },
    {
      id: 3,
      title: "Nail art trends: this season's elegant shades",
      category: "Body Treatment",
      author: "Admin",
      image: "/service1.png",
      readMore: "Read More"
    }
  ]

  const ArticleCard = ({ article }: { article: typeof articles[0] }) => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-100">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Author and Category */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span className="text-gray-700 font-medium">{article.author}</span>
          <span className="mx-2">•</span>
          <span className="text-[#E89B8B]">{article.category}</span>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4 leading-relaxed">
          {article.title}
        </h3>
        
        {/* Read More Link */}
        <a 
          href="#" 
          className="text-gray-600 text-sm hover:text-[#E89B8B] transition-colors duration-200 inline-flex items-center"
        >
          {article.readMore}
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  )

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background Image with gradient */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/service-bg.jpg')"
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-white via-transparent to-white opacity-90"></div>
      </div>
      
      {/* Decorative circles */}
      <div className="absolute top-10 left-10 z-10">
        <img 
          src="/decorative-circles.png" 
          alt="Decorative pattern" 
          className="w-[323.71px] h-[306.91px]"
        />
      </div>

      <div className="container mx-auto px-6 mt-14 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <img 
          src="/leaf.png" 
          alt="Decorative pattern" 
          className="w-[19px] h-[22px]"
        />
            <p className="text-black px-2 text-lg font-medium">Latest News</p>
          </div>
          <h2 className="text-4xl font-light text-gray-800">News & Articles</h2>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default NewsArticle