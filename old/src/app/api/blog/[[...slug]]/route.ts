import { Body, Injectable, Params } from '@/interceptor'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Index } from 'lunr'
import { index, published, all } from '@/db'

const GetDto = z.object({ slug: z.array(z.string()).default([]) })
const PostDto = z.object({
  q: z
    .string()
    .min(3)
    .transform((e) => e.replace(/[^a-zA-Z0-9]/g, ' '))
    .optional(),
  t: z.string().optional(),
  limit: z.number().default(10),
  offset: z.number().default(0),
})

class Route {
  @Injectable()
  static async GET(
    _req: NextRequest,
    _: { params: Promise<object> },
    @Params(GetDto) { slug }: z.infer<typeof GetDto>,
  ) {
    const pathname = ['/blog', ...slug].join('/')
    const data = all.find(({ route }) => route === pathname)
    return NextResponse.json(data)
  }

  @Injectable()
  static async POST(
    _req: NextRequest,
    _: { params: Promise<object> },
    @Body(PostDto) { q, t, limit, offset }: z.infer<typeof PostDto>,
  ) {
    if (q) {
      const document = Index.load(index)
      const results = document.search(q)
      const data = results
        .filter(({ score }) => score >= 1)
        .map(({ ref }) => ref)
        .slice(offset, offset + limit)
      return NextResponse.json(data)
    }
    if (t) {
      const data = published
        .filter(({ tags }) => tags.includes(t))
        .map(({ route }) => route)
        .slice(offset, offset + limit)
      return NextResponse.json(data)
    }
    const { children: data = [] } =
      published.find(({ route }) => route === '/blog') || {}
    return NextResponse.json(data.slice(offset, offset + limit))
  }
}

export const { GET, POST } = Route
