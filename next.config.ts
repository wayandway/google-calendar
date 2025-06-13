import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 빌드 중 ESLint 검사를 건너뜁니다
  },
};

export default nextConfig;
