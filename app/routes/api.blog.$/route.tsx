import type { Route } from './+types/route'

import { z } from 'zod'
import { all } from '~/db'

const dto = z.object({ '*': z.string().optional() })

export async function loader({ params }: Route.LoaderArgs) {
  const { '*': slug } = dto.parse(params)

  if (!slug) return Response.json(all.find(({ route }) => route === '/blog'))

  const data = all.find(({ route }) => route === `/blog/${slug}`) ?? null

  return Response.json(data)
}
