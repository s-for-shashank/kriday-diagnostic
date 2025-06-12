/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
    reactStrictMode: true,
    images: {
      unoptimized: true, // Disable default image optimization
    },
    distDir: 'build',
    assetPrefix: isProd ? '/kriday-diagnostatic/' : '',
    basePath: isProd ? '/kriday-diagnostatic' : '',
    // output: 'export'
};

export default nextConfig;
