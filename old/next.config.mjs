import createMDX from '@next/mdx'

import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkSlug from 'remark-slug'
import remarkFrontmatter from 'remark-frontmatter'
import rehypeKatex from 'rehype-katex'
import rehypeMdxImportMedia from 'rehype-mdx-import-media'
import rehypeToc from '@jsdevtools/rehype-toc'
import { rehypeExtendedHighlight } from '@gears-bot/rehype/extended-highlight'
import { all } from 'lowlight'
import { solidity } from 'highlightjs-solidity'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeMermaid from 'rehype-mermaid'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      remarkGfm,
      remarkMath,
      remarkSlug,
      [remarkFrontmatter, ['yaml', 'toml']],
    ],
    rehypePlugins: [
      rehypeKatex,
      [rehypeMdxImportMedia, { elementAttributeNameCase: 'html' }],
      rehypeToc,
      [
        rehypeExtendedHighlight,
        { tabsName: 'Tabs', tabName: 'Tab', languages: { ...all, solidity } },
      ],
      [rehypeAutolinkHeadings, { behavior: 'append' }],
      [rehypeMermaid, { strategy: 'pre-mermaid' }],
    ],
  },
})

export default withMDX(nextConfig)
