import type { ReactNode } from 'react'

import { ThemeProvider } from 'next-themes'

import '~/styles/global.css'

/**
 * Provider
 */

export default function UiProvider({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}
