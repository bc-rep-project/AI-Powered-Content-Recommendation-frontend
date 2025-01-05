export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV,
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_TEST: process.env.NODE_ENV === 'test',
} as const;

// Type guard for environment variables
Object.entries(env).forEach(([key, value]) => {
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
}); 