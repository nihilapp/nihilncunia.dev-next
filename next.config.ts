import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    esmExternals: true,
  },
  pageExtensions: [
    'tsx',
    'ts',
  ],
  distDir: 'build',
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  eslint: {
    dirs: [],
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config) {
    config.cache = false;
    config.module.rules.push({
      test: /\.svg$/,
      use: [ '@svgr/webpack', ],
    });
    return config;
  },
};

export default nextConfig;
