import type { MDXComponents } from 'mdx/types'

import Link from './link'
import Image from './image'
import Pre, { Tabs, Tab } from './highlight'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: Link,
    img: Image,
    pre: Pre,
    Tabs,
    Tab,
    ...components,
  }
}
