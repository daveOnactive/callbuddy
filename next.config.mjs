/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, _options) {
    config.module.rules.push({
      test: /\.(mp3)$/,
      use: {
        loader: 'file-loader',
      },
    });
    return config;
  },
  env: {
    API_KEY: "AIzaSyACSXUaXBBpHSuYTsqBLPVJyjUAExyux7E",
    AUTH_DOMAIN: "callbuddy-b2624.firebaseapp.com",
    PROJECT_ID: "callbuddy-b2624",
    STORAGE_BUCKET: "callbuddy-b2624.appspot.com",
    MESSAGINGSENDERID: "219560982387",
    APP_ID: "1:219560982387:web:4d1866f13821ef7c34b706",
    AUTHORIZATION_KEY: "sk_test_0ff1cabe532b186f1c4e79d2b63fcb29ae6777e3",
    FLW_KEY: "FLWPUBK_TEST-9703c265d81bce2567a32dad2432ca2c-X"
  }
};

export default nextConfig;
