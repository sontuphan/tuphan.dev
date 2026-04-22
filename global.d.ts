import type { ReactNode } from 'react'

declare module '*.md' {
  function MDXRoute(): ReactNode
  export default MDXRoute
}

declare module '*.mdx' {
  function MDXRoute(): ReactNode
  export default MDXRoute
}
