import type { Route } from './+types/route'

import { all } from '~/db'

export async function loader(_: Route.LoaderArgs) {
  const raw = all.flatMap(({ tags }) => tags)
  const tags = [...new Set(raw)]
  return Response.json(tags)
}
