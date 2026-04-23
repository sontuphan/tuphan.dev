import type { Route } from './+types/route'

import { z } from 'zod'
import * as lunr from 'lunr'

const { Index } = lunr

import { index, published } from '~/db'

const dto = z.object({
  q: z
    .string()
    .min(3)
    .transform((e) => e.replace(/[^a-zA-Z0-9]/g, ' '))
    .optional(),
  t: z.string().optional(),
  limit: z.coerce.number().default(10),
  offset: z.coerce.number().default(0),
})

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const { q, t, offset, limit } = dto.parse(
    Object.fromEntries(url.searchParams),
  )

  if (q) {
    const document = Index.load(index)
    const results = document.search(q)
    const data = results
      .filter(({ score }) => score >= 1)
      .map(({ ref }) => ref)
      .slice(offset, offset + limit)
    return Response.json(data)
  }
  if (t) {
    const data = published
      .filter(({ tags }) => tags.includes(t))
      .map(({ route }) => route)
      .slice(offset, offset + limit)
    return Response.json(data)
  }
  const { children: data = [] } =
    published.find(({ route }) => route === '/blog') || {}

  return Response.json(data.slice(offset, offset + limit))
}
