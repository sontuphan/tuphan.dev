import type { ReactNode } from 'react'

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

declare module '*.md' {
  function MDXRoute(): ReactNode
  export default MDXRoute
}

declare module '*.mdx' {
  function MDXRoute(): ReactNode
  export default MDXRoute
}
