import React from 'react';

const Loader = () => {
  return (
    // Outer container for centering and dark background
    <div className="flex items-center justify-center min-h-screen bg-gray-900 overflow-hidden">
      
      <div className="relative w-80 h-80 flex items-center justify-center bg-gray-800 rounded-2xl shadow-2xl backdrop-blur-md">
        
        <div 
          className="absolute w-full h-full rounded-2xl crazy-spin" 
          style={{
            '--gradient-start': '#8b5cf6', 
            '--gradient-end': '#ec4899',   
          }}
        >
          <div className="absolute inset-4 rounded-full bg-black/30 animate-pulse"></div>
        </div>

        <div className="relative z-10 text-center">
          <svg 
            className="w-16 h-16 text-white mx-auto mb-2 opacity-90 animate-bounce" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
          </svg>
          <p className="text-sm font-light text-gray-300 tracking-wider">
            Processing the Craziness...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loader;