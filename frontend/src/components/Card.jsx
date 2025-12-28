import React from "react";

const Card = ({ children, className = "", padding = "p-6" }) => {
  return (
    <div 
      className={`
        bg-white 
        dark:bg-gray-800 
        shadow-xl 
        dark:shadow-indigo-900/20 
        rounded-xl 
        transition-all 
        duration-300 
        hover:shadow-2xl 
        hover:scale-[1.005] 
        ${padding} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;