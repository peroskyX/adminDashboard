/** @type {import('next').NextConfig} */
const nextConfig = { 
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://us-central1-windowshopai-36c5c.cloudfunctions.net/:path*', // Proxy to the API
      },
    ];
  },
  images: {
  remotePatterns: [
    { hostname: "images.pexels.com" }, 
    {
      protocol: 'https',
      hostname: 'ui-avatars.com',
      pathname: '/**',
    }
  ],
},};


export default nextConfig;
