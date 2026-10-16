/** @type {import('next').NextConfig} */

// GitHub Pages 靜態部署：BUILD_EXPORT=1 NEXT_PUBLIC_BASE_PATH=/repo-name next build
const isExport = process.env.BUILD_EXPORT === '1';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  ...(isExport
    ? {
        output: 'export',
        basePath,
        assetPrefix: basePath ? `${basePath}/` : undefined,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
  // 允許 ngrok 跨域請求
  allowedDevOrigins: [
    'asleep-anatomy-nutlike.ngrok-free.dev',
  ],
  // 禁用 Next.js 快取以確保熱更新穩定
  webpack: (config) => {
    config.watchOptions = {
      ignored: ['**/node_modules', '**/.git'],
      poll: 300,
    };
    return config;
  },
};

module.exports = nextConfig;
