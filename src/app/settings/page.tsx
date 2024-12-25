'use client';

import { useState } from 'react';
import { API_ENDPOINTS } from '@/config/api.config';

interface UserSettings {
  email: string;
  notificationPreferences: {
    emailNotifications: boolean;
    contentUpdates: boolean;
    recommendations: boolean;
  };
  contentPreferences: {
    categories: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    language: string;
  };
}

const CATEGORIES = ['Technology', 'Science', 'Business', 'Arts', 'Health'];
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Chinese'];
const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    email: 'user@example.com', // This would come from your auth system
    notificationPreferences: {
      emailNotifications: true,
      contentUpdates: true,
      recommendations: true,
    },
    contentPreferences: {
      categories: ['Technology', 'Science'],
      difficulty: 'intermediate',
      language: 'English',
    },
  });

  const handleNotificationChange = (key: keyof UserSettings['notificationPreferences']) => {
    setSettings(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [key]: !prev.notificationPreferences[key],
      },
    }));
  };

  const handleCategoryToggle = (category: string) => {
    setSettings(prev => ({
      ...prev,
      contentPreferences: {
        ...prev.contentPreferences,
        categories: prev.contentPreferences.categories.includes(category)
          ? prev.contentPreferences.categories.filter(c => c !== category)
          : [...prev.contentPreferences.categories, category],
      },
    }));
  };

  const handleDifficultyChange = (difficulty: UserSettings['contentPreferences']['difficulty']) => {
    setSettings(prev => ({
      ...prev,
      contentPreferences: {
        ...prev.contentPreferences,
        difficulty,
      },
    }));
  };

  const handleLanguageChange = (language: string) => {
    setSettings(prev => ({
      ...prev,
      contentPreferences: {
        ...prev.contentPreferences,
        language,
      },
    }));
  };

  const saveSettings = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(API_ENDPOINTS.settings, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to save settings');
      
      setSuccessMessage('Settings saved successfully');
    } catch (err) {
      setError('Failed to save settings. Please try again.');
      console.error('Error saving settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your account preferences and settings
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Notification Preferences */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Notification Preferences
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-700">Email Notifications</label>
                  <p className="text-sm text-gray-500">Receive email updates about your account</p>
                </div>
                <button
                  onClick={() => handleNotificationChange('emailNotifications')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.notificationPreferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.notificationPreferences.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-700">Content Updates</label>
                  <p className="text-sm text-gray-500">Get notified about new content in your areas of interest</p>
                </div>
                <button
                  onClick={() => handleNotificationChange('contentUpdates')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.notificationPreferences.contentUpdates ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.notificationPreferences.contentUpdates ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-700">Recommendations</label>
                  <p className="text-sm text-gray-500">Receive personalized content recommendations</p>
                </div>
                <button
                  onClick={() => handleNotificationChange('recommendations')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.notificationPreferences.recommendations ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.notificationPreferences.recommendations ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Content Preferences */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Content Preferences
            </h2>
            
            {/* Categories */}
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-2">
                Preferred Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      settings.contentPreferences.categories.includes(category)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-2">
                Content Difficulty
              </label>
              <div className="flex gap-4">
                {DIFFICULTY_LEVELS.map(level => (
                  <button
                    key={level.value}
                    onClick={() => handleDifficultyChange(level.value as UserSettings['contentPreferences']['difficulty'])}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      settings.contentPreferences.difficulty === level.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Preferred Language
              </label>
              <select
                value={settings.contentPreferences.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {LANGUAGES.map(language => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Account Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={settings.email}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm text-gray-600 sm:text-sm"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Contact support to change your email address
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mt-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={saveSettings}
            disabled={isLoading}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </main>
    </div>
  );
} 