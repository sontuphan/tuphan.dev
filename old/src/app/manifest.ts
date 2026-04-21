import { MetadataRoute } from 'next'

export const name = 'tuphan.dev'
export const description =
  "I usually write about Computer Science like Web3, WebDev, Cryptography, Math, and also some MBA stuff cause I'm learning it."
export const host = process.env.NEXT_PUBLIC_HOST || '/'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: name,
    short_name: name,
    description: description,
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16',
        type: 'image/x-icon',
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
