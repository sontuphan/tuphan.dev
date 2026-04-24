import type { MDXComponents } from 'mdx/types'

import SmartLink from './slink'
import Image from './image'
import Pre, { Tabs, Tab } from './highlight'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: SmartLink,
    img: Image,
    pre: Pre,
    Tabs,
    Tab,
    ...components,
  }
}
