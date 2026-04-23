import type { RouteConfigEntry } from '@react-router/dev/routes'
import { writeFileSync } from 'fs'

export const TREE_DIR = 'app/db/tree.json'

export type BlogTreeNode = {
  path: string
  file: string
  children: BlogTreeNode[]
}

export function ejectBlogTree(routes: RouteConfigEntry[]) {
  const [blog] = routes.filter(({ path }) => path === 'blog')

  const build = (
    { path, file, children = [] }: RouteConfigEntry,
    parentPath = '',
  ): BlogTreeNode => {
    const fullPath = [parentPath, path].join('/')

    return {
      path: fullPath,
      file: `app/${file}`,
      children:
        children
          .filter(({ index }) => !index)
          .map((child) => build(child, fullPath)) ?? [],
    }
  }

  const blogTree = build(blog)
  writeFileSync(TREE_DIR, JSON.stringify(blogTree, null, 2))
}
