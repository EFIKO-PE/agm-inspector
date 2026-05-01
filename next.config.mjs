/** @type {import('next').NextConfig} */
const nextConfig = {
  // Quitamos 'export' para que Vercel pueda manejar el Login y la IA
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
