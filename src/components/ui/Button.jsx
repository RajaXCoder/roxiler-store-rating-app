import React from 'react';

const Button = ({
  children,
  type = 'button',
  className = '',
  isLoading = false,
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Base classes
  const baseClasses = `inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
    fullWidth ? 'w-full' : ''
  } ${sizeClasses[size]}`;

  // Variant classes - now includes outline variants
  const variantClasses = {
    // Solid variants
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary:
      'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    warning:
      'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',

    // Outline variants
    'outline-primary':
      'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    'outline-secondary':
      'border-2 border-gray-600 text-gray-600 hover:bg-gray-50 focus:ring-gray-500',
    'outline-danger':
      'border-2 border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500',
    'outline-success':
      'border-2 border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
    'outline-warning':
      'border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-500',

    // Ghost variants (minimal styling)
    'ghost-primary': 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    'ghost-secondary': 'text-gray-600 hover:bg-gray-50 focus:ring-gray-500',
    'ghost-danger': 'text-red-600 hover:bg-red-50 focus:ring-red-500',
  };

  // Spinner color based on variant
  const spinnerColor =
    variant.includes('outline') || variant.includes('ghost')
      ? variant.split('-')[1]
      : 'white';

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg
            className={`animate-spin -ml-1 mr-3 h-5 w-5 text-${spinnerColor}-600`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
