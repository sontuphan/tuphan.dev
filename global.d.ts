import type { ReactNode } from 'react'

declare global {
  type Blog = {
    route: string
    parent: string
    children: string[]
    title: string
    image: string
    authors: string[]
    tags: string[]
    description: string
    content: string
    date: Date
  }

  type ViteManifest = Record<string, { file?: string; src?: string }>
}

declare module '*.md' {
  function MDXRoute(): ReactNode
  export default MDXRoute
}

declare module '*.mdx' {
  function MDXRoute(): ReactNode
  export default MDXRoute
}

export {}
