/** @type {import('next').NextConfig} */
//nextjs does not allow us to add external urls to images so we have to include this images property here then restart our server
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com'],
  },
};

module.exports = nextConfig;
