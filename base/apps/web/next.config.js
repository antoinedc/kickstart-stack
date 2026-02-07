const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@{{PROJECT_NAME}}/shared'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = withNextIntl(nextConfig)
