import fs, { readFileSync, writeFileSync } from 'fs'
import { dirname, relative, parse, resolve } from 'path'
import { log } from 'isomorphic-git'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { select, selectAll } from 'unist-util-select'
import { toString } from 'mdast-util-to-string'
import { frontmatter } from 'micromark-extension-frontmatter'
import { frontmatterFromMarkdown } from 'mdast-util-frontmatter'
import toml from 'toml'
import { z } from 'zod'
import lunr from 'lunr'

import { isURL } from '~/hooks/utils'
import type { BlogTreeNode } from '~/db'

type ExtendedBlogTreeNode = Omit<BlogTreeNode, 'children'> & {
  title: string
  image: string
  authors: string[]
  tags: string[]
  description: string
  content: string
  children: ExtendedBlogTreeNode[]
  date: Date
}

function getAssetMap() {
  try {
    const manifest: ViteManifest = JSON.parse(
      readFileSync('build/client/.vite/manifest.json', 'utf8'),
    )

    return Object.entries(manifest).reduce(
      (map, [key, { file, src }]) => {
        if (!file) return map
        map[key] = `/${file}`
        if (src) map[src] = `/${file}`
        return map
      },
      {} as Record<string, string>,
    )
  } catch {
    return {}
  }
}

const assetMap = getAssetMap()

function getImage(node: BlogTreeNode, url: string) {
  if (!url) return ''
  if (isURL(url) || url.startsWith('/')) return url

  const [imagePath] = url.split(/[?#]/, 1)
  const source = relative('.', resolve(dirname(node.file), imagePath))

  return assetMap[source] ?? ''
}

async function parseTree(node: BlogTreeNode): Promise<ExtendedBlogTreeNode> {
  const { ext } = parse(node.file)

  if (ext !== '.md' && ext !== '.mdx') {
    return {
      ...node,
      title: '',
      image: '',
      authors: [],
      tags: [],
      description: '',
      content: '',
      date: new Date(),
      children: await Promise.all(node.children.map(parseTree)),
    }
  }

  const file = readFileSync(node.file)
  const md = fromMarkdown(Uint8Array.from(file), {
    extensions: [frontmatter(['yaml', 'toml'])],
    mdastExtensions: [frontmatterFromMarkdown(['yaml', 'toml'])],
  })

  const matter = select('root > toml', md)
  const heading = select('root > heading', md) || {}
  const paragraph = select('root > paragraph', md) || {}
  const text = selectAll('heading, paragraph', md)
  const { url } = Object.assign({ url: '' }, select('image', md))
  const image = getImage(node, url)
  const commits = await log({
    fs,
    dir: './',
    filepath: relative('./', node.file),
    force: true,
    follow: true,
  })
  const authors = commits
    .map(({ commit: { author } }) => author.name)
    .filter((e, i, a) => a.indexOf(e) === i)
  const { tags, date } = z
    .object({
      tags: z
        .string()
        .default('')
        .transform((tags) =>
          tags
            .split(',')
            .map((e) => e.trim())
            .filter((e) => !!e),
        ),
      date: z.coerce.date().default(new Date()),
    })
    .parse(toml.parse(toString(matter)))

  const extendedNode: ExtendedBlogTreeNode = {
    ...node,
    title: toString(heading),
    image: image,
    authors: authors,
    tags: tags,
    date: date,
    description: toString(paragraph),
    content: text
      .map((e) => toString(e))
      .join(' ')
      .replaceAll('\n', ' '),
    children: await Promise.all(
      node.children.map(async (n) => await parseTree(n)),
    ),
  }

  return extendedNode
}

function flatten(node: ExtendedBlogTreeNode, parent = ''): Blog[] {
  const children = node.children.sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  )

  const blogs = [
    {
      route: node.path,
      parent,
      title: node.title,
      image: node.image,
      authors: node.authors,
      tags: node.tags,
      description: node.description,
      content: node.content,
      date: node.date,
      children: children.map((child) => child.path),
    },
  ]

  children.forEach((child) => blogs.push(...flatten(child, node.path)))

  return blogs
}

async function migrate() {
  const tree: BlogTreeNode = JSON.parse(
    readFileSync('app/db/tree.json', 'utf8'),
  )
  // Parse data
  const data = await parseTree(tree)
  // // Write table
  const table = flatten(data)
  writeFileSync('app/db/table.json', JSON.stringify(table, null, 2))
  // Write index
  const document = lunr(function () {
    this.ref('route')
    this.field('title')
    this.field('description')
    this.field('content')
    table.forEach((doc) => this.add(doc))
  })
  writeFileSync('app/db/index.json', JSON.stringify(document, null, 2))
}

migrate()
