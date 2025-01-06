/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['next-themes'],
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      extensionAlias: {
        '.js': ['.js', '.ts', '.tsx'],
        '.mjs': ['.mjs', '.mts', '.mtsx']
      },
      alias: {
        '@': require('path').resolve(__dirname, './src')
      }
    };
    return config;
  }
};

module.exports = nextConfig;