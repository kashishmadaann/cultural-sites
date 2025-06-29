import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) => {
  const baseStyles =
    "font-semibold rounded-full shadow-md focus:outline-none focus:ring-4 focus:ring-opacity-40 transition-all duration-200 tracking-wide";

  const variantStyles = {
    primary: "bg-teal-500 hover:bg-teal-600 text-white focus:ring-teal-400",
    secondary: "bg-violet-100 hover:bg-violet-200 text-violet-700 focus:ring-violet-300",
    danger: "bg-rose-500 hover:bg-rose-600 text-white focus:ring-rose-400",
    outline: "bg-transparent hover:bg-amber-50 text-amber-700 border border-amber-400 focus:ring-amber-300",
    success: "bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-400"
  };

  const sizeStyles = {
    sm: "py-1.5 px-4 text-sm",
    md: "py-2.5 px-6 text-base",
    lg: "py-3.5 px-8 text-lg"
  };

  const disabledStyles = "opacity-40 cursor-not-allowed";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant] || variantStyles.primary}
        ${sizeStyles[size]}
        ${disabled ? disabledStyles : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;