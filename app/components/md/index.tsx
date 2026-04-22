import type { MDXComponents } from 'mdx/types'

import Image from './image'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    img: Image,
    ...components,
  }
}
