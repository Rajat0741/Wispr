import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      // Google OAuth profile pictures
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // GitHub OAuth profile pictures
      // { protocol: "https", hostname: "avatars.githubusercontent.com" },
      // ImageKit delivery CDN
      { protocol: "https", hostname: "ik.imagekit.io" },
    ],
  },
};

export default nextConfig;
