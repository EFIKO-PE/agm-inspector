/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignoramos errores de estilo para el APK
  },
  typescript: {
    ignoreBuildErrors: true, // Ignoramos errores de tipos para el APK
  },
};

export default nextConfig;
