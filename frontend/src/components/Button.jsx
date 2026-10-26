import React from "react";

const Button = ({ children, onClick, type = "button", variant = "primary", className = "" }) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-zinc-200 text-zinc-800 hover:bg-zinc-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    tertiary: "bg-transparent text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
