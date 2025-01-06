/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['next-themes'],
  experimental: {
    appDir: true
  }
};

module.exports = nextConfig;