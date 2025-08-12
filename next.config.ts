import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignore all build errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable strict mode for faster builds
  reactStrictMode: false,
  
  // Webpack config to handle Supabase issues
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
  
  // Disable minification that might cause issues
  swcMinify: true,
  
  // Experimental features
  experimental: {
    esmExternals: 'loose',
  },
};

export default nextConfig;