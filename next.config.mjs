import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'qbzygcxutbnrzyzkchxr.supabase.co',
      }
    ],
    // To allow placehold.co SVG placeholders
    dangerouslyAllowSVG: true,
  },
};

export default withSentryConfig(nextConfig, {
  org: "prompt-6l",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  }
});
