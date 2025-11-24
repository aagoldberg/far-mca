import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    reactStrictMode: true,
    eslint: {
        // Enable linting during builds - errors will fail the build
        ignoreDuringBuilds: false,
    },
    typescript: {
        // Enable TypeScript checking during builds - errors will fail the build
        ignoreBuildErrors: false,
    },
};

export default nextConfig;
