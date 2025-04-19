/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Makes your Next.js site static (for Netlify, Surge, etc.)
    images: {
        unoptimized: true, // If you're using <Image />, this avoids SSR image optimization issues
    },
}

export default nextConfig
