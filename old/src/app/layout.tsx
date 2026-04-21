import { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'

import UiProvider from '@/providers/ui.provider'
import Footer from './footer'

import { name, description, host } from './manifest'

export const metadata: Metadata = {
  title: name,
  description: description,
  metadataBase: new URL(host),
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/tokyo-night-dark.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css"
          integrity="sha384-wcIxkf4k558AjM3Yz3BBFQUbk/zgIYC2R0QpeeYb+TwlBVMrlgLqwRjRtGZiK7ww"
          crossOrigin="anonymous"
        />
      </head>
      <body className="overflow-x-hidden">
        <UiProvider>
          <main className="w-full min-h-dvh flex flex-col">
            <section className="grow grid grid-cols-1">
              <div className="col-span-full">{children}</div>
            </section>
            <footer className="fixed bottom-2 w-full flex flex-row justify-center">
              <Footer />
            </footer>
          </main>
        </UiProvider>
      </body>
      <GoogleAnalytics gaId="G-ZYEVZRRV45" />
    </html>
  )
}
