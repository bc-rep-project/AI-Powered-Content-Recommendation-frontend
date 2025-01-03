import React from 'react';

export const FeedbackForm = () => {
  return (
    <div className="p-4">
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          {['1', '2', '3', '4', '5'].map((value) => (
            <label key={value} className="flex items-center space-x-2">
              <input
                type="radio"
                name="rating"
                value={value}
                className="form-radio text-blue-600"
              />
              <span className="text-gray-700 dark:text-gray-300">{value}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}; 