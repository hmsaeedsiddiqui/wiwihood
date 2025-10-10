"use client"
import React, { useState } from 'react'

function Video() {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayClick = () => {
    setIsPlaying(true)
    // Here you would typically start playing the actual video
  }

  return (
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[563px] overflow-hidden">
      {/* Background Image/Video */}
      <div className="absolute inset-0">
        {!isPlaying ? (
          // Video thumbnail/poster image
          <img 
            src="/video-thumbnail.jpg" 
            alt="Spa treatment video"
            className="w-full h-full object-cover opacity-50 bg-[#E7A3914D]"
          />
        ) : (
          // Actual video element (you can replace with your video)
          <video 
            className="w-full h-[563px] object-cover"
            controls
            autoPlay
            poster="/spa-video-thumbnail.jpg"
          >
            <source src="/spa-treatment-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {/* Bottom Vector overlay */}
      <div className="absolute -bottom-40 left-0 w-full overflow-hidden">
        <img 
          src="/Vector.png" 
          alt="Vector decoration" 
          className="w-full opacity-40 brightness-500 invert"
        />
      </div>

      {/* Play Button Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button 
            onClick={handlePlayClick}
            className="group bg-white/20 backdrop-blur-sm rounded-full p-6 hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
          >
            <div className="bg-[#E89B8B] rounded-full p-4 shadow-lg">
              <svg 
                className="w-8 h-8 text-white ml-1" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </button>
        </div>
      )}

      {/* Optional overlay for better contrast */}
      <div className="absolute inset-0 bg-black/10"></div>
    </section>
  )
}

export default Video