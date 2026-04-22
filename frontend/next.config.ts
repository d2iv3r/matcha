import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
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
            // {
            //     protocol: "https",
            //     hostname: "images.unsplash.com",
            // },
            // {
            //     protocol: "https",
            //     hostname: "source.unsplash.com",
            // },
        ],
    },
};

export default nextConfig;
