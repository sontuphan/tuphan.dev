import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'

export default defineConfig({
  plugins: [mdx(), reactRouter(), tailwindcss()],
  resolve: {
    tsconfigPaths: true,
  },
})
