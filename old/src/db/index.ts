import 'server-only'
import { z } from 'zod'
import { env } from '@/configs/env'
import tablejson from './table.json'
import indexjson from './index.json'

// Database
const TableDto: z.ZodType<Blog[]> = z.array(
  z.object({
    route: z.string(),
    title: z.string(),
    authors: z.array(z.string()),
    image: z.string(),
    tags: z.array(z.string()),
    description: z.string(),
    content: z.string(),
    date: z.coerce.date(),
    children: z.array(z.string()),
    parent: z.string(),
  }),
)
export const all = TableDto.parse(tablejson)
const unpublished = all
  .filter(({ date }) => env !== 'development' && date > new Date())
  .map(({ route }) => route)
export const published = all
  .filter(({ route }) => !unpublished.includes(route))
  .map(({ children, ...props }) => ({
    children: children.filter((route) => !unpublished.includes(route)),
    ...props,
  }))

// Index
const IndexDto = z.object({
  version: z.string(),
  fields: z.array(z.string()),
  fieldVectors: z.array(z.tuple([z.string(), z.array(z.number())])),
  invertedIndex: z.array(z.tuple([z.string(), z.any()])),
  pipeline: z.array(z.string()),
})
export const index = IndexDto.parse(indexjson)
