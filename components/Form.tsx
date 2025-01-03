import React from 'react';

export function Input({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-paper text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-dark-primary"
        {...props}
      />
    </div>
  );
}

export function Button({ children, ...props }) {
  return (
    <button
      className="px-4 py-2 rounded-md bg-primary-500 dark:bg-dark-primary text-white font-medium hover:bg-primary-600 dark:hover:bg-dark-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-dark-primary"
      {...props}
    >
      {children}
    </button>
  );
}