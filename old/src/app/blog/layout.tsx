import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { all } from '@/db'

export async function generateMetadata(): Promise<Metadata> {
  const pathname = (await headers()).get('x-forwarded-pathname') || ''
  const { title, image, description } =
    all.find(({ route }) => route === pathname) || {}
  const metadata = { title, description }
  if (image)
    Object.assign(metadata, {
      openGraph: {
        images: [
          {
            url: image,
          },
        ],
      },
    })
  return metadata
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex flex-row justify-center">
      <div className="w-full max-w-a4 p-6">{children}</div>
    </div>
  )
}
