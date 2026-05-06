import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "",
            },
            {
                protocol: "http",
                hostname: "127.0.0.1",
                port: "",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "5001",
            },
            {
                protocol: "http",
                hostname: "127.0.0.1",
                port: "5001",
            },
            {
                protocol: "https",
                hostname: "images.pexels.com",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
        ],
    },
};

export default nextConfig;
