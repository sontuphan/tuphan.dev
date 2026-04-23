import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import { all } from 'lowlight'
// @ts-ignore
import { solidity } from 'highlightjs-solidity'

import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkFrontmatter from 'remark-frontmatter'

import rehypeKatex from 'rehype-katex'
import rehypeMdxImportMedia from 'rehype-mdx-import-media'
import rehypeSlug from 'rehype-slug'
import { rehypeExtendedHighlight } from '@gears-bot/rehype/extended-highlight'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeMermaid from 'rehype-mermaid'

export default defineConfig({
  build: {
    manifest: true,
  },
  ssr: {
    noExternal: ['react-use'],
  },
  plugins: [
    mdx({
      providerImportSource: '~/components/md',
      remarkPlugins: [
        remarkGfm,
        remarkMath,
        [remarkFrontmatter, ['yaml', 'toml']],
      ],
      rehypePlugins: [
        rehypeKatex,
        [rehypeMdxImportMedia, { elementAttributeNameCase: 'html' }],
        rehypeSlug,
        [
          rehypeExtendedHighlight,
          { tabsName: 'Tabs', tabName: 'Tab', languages: { ...all, solidity } },
        ],
        [rehypeAutolinkHeadings, { behavior: 'append' }],
        [rehypeMermaid, { strategy: 'pre-mermaid' }],
      ],
    }),
    reactRouter(),
    tailwindcss(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
})
