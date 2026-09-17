import React from 'react';

export function Logo({ className = '' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      className={`h-7 w-7 hover:opacity-80 transition-opacity duration-200 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M50 15 L25 80 L35 80 L50 40 L65 80 L75 80 Z" />
      <path d="M50 55 L38 80 L48 80 L50 75 L52 80 L62 80 Z" />
    </svg>
  );
}
