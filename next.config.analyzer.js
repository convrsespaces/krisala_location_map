const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Import the main Next.js config
const nextConfig = require('./next.config.ts');

// Export the config with the bundle analyzer
module.exports = withBundleAnalyzer(nextConfig);