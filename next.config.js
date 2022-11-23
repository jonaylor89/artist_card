/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  rewrites() {
    return [{ source: '/i', destination: '/api/og' }]
  },
}

module.exports = nextConfig
