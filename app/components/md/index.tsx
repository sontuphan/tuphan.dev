import type { MDXComponents } from 'mdx/types'

import Image from './image'
import Pre, { Tabs, Tab } from './highlight'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    img: Image,
    pre: Pre,
    Tabs,
    Tab,
    ...components,
  }
}
