/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'tba-social.mypinata.cloud',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: '*.mypinata.cloud',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://*.mypinata.cloud https://gateway.pinata.cloud https://i.imgur.com",
              "font-src 'self' data:",
              "connect-src 'self' " +
              "https://*.walletconnect.com https://*.walletconnect.org " +
              "https://*.mypinata.cloud https://gateway.pinata.cloud " +
              "https://warpcast.com https://*.warpcast.com " +
              "https://neynar.com https://*.neynar.com " +
              "https://*.privy.io https://*.privy.systems " +
              "https://*.base.org https://sepolia.base.org " +
              "https://*.ethereum.org https://*.infura.io " +
              "https://*.alchemy.com https://*.ankr.com " +
              "https://cloudflareinsights.com " +
              "wss://*.walletconnect.com wss://*.walletconnect.org " +
              "https://far-micro.ngrok.dev http://localhost:* ws://localhost:*",
              "frame-src 'self' https://*.walletconnect.com https://*.coinbase.com https://verify.walletconnect.com",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
