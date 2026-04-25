import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
  return {
    name: 'Happy Sad Golf',
    short_name: 'HSGolf',
    description: 'Track your golf mood, hole by hole. Masters-themed scoring with 😊 and 😔.',
    start_url: `${base}/`,
    scope: `${base}/`,
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F5F0E8',
    theme_color: '#006747',
    categories: ['sports', 'lifestyle'],
    icons: [
      { src: `${base}/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: `${base}/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
    screenshots: [],
  }
}
