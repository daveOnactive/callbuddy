/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, _options) {
    config.module.rules.push({
      test: /\.mp3$/,
      use: {
        loader: 'file-loader',
      },
    });
    return config;
  },
};

export default nextConfig;
