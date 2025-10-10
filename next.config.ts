import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    reactStrictMode: false,
    eslint: {
        // Skip linting during builds for deployment
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Skip TypeScript errors during builds for deployment
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
