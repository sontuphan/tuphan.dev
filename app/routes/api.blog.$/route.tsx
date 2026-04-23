import type { Route } from './+types/route'

import { z } from 'zod'
import { all } from '~/db'

const dto = z.object({ '*': z.string() })

// todo: pivot it to react-router
export async function loader({ params }: Route.LoaderArgs) {
  console.log(params)
  const { '*': slug } = dto.parse(params)

  const data = all.find(({ route }) => route === `/blog/${slug}`)

  return Response.json(data)
}
