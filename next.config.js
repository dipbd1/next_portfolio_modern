/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: "loose",
  },
  images: {
    domains: ["media.graphassets.com", "res.cloudinary.com", "ap-south-1.graphassets.com"],
  },
}

module.exports = nextConfig
