import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'

import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkFrontmatter from 'remark-frontmatter'

import rehypeKatex from 'rehype-katex'
import rehypeMdxImportMedia from 'rehype-mdx-import-media'
import rehypeSlug from 'rehype-slug'

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
      ],
    }),
    reactRouter(),
    tailwindcss(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
})
