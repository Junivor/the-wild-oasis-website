/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'dbbaiywxedujcahdnxru.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/cabins-images/**',
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: "",
                pathname: "/**"
            }
        ],
    },
};
export default nextConfig;
