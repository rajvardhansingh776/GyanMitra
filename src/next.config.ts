import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Allow all cross-origin requests in development.
  // This is a temporary workaround for the development environment.
  // In a production environment, you should specify the allowed origins.
  // https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      allowedDevOrigins: ['**'],
    },
  }),
};

export default nextConfig;
