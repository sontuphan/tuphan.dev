import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'

import rehypeMdxImportMedia from 'rehype-mdx-import-media'

export default defineConfig({
  plugins: [
    mdx({
      providerImportSource: '~/components/md',
      rehypePlugins: [
        [rehypeMdxImportMedia, { elementAttributeNameCase: 'html' }],
      ],
    }),
    reactRouter(),
    tailwindcss(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
})
