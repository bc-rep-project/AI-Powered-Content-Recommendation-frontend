/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'picsum.photos',
    ],
  }
}

module.exports = nextConfig