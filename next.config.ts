import type { NextConfig } from 'next';

async function createNextConfig(): Promise<NextConfig> {
  return {
    experimental: {
      esmExternals: true,
    },
    pageExtensions: [
      'tsx',
      'ts',
    ],
    distDir: 'build',
    reactStrictMode: false,
    compiler: { styledComponents: true, },
    eslint: {
      dirs: [],
      ignoreDuringBuilds: true,
    },
    typescript: { ignoreBuildErrors: true, },
    webpack(config) {
      config.cache = false;
      config.module.rules.push({
        test: /\.svg$/,
        use: [ '@svgr/webpack', ],
      });
      return config;
    },
  } satisfies NextConfig;
}

export default createNextConfig();
