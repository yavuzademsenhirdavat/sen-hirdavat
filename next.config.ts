import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['iyzipay'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'uaimwbkdocpimwcypqmk.supabase.co' },
    ],
  },
};

export default nextConfig;
