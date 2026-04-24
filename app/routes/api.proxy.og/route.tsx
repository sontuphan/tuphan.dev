import type { Route } from './+types/route'

import ogs from 'open-graph-scraper'
import { z } from 'zod'

const dto = z.object({
  url: z.url(),
})

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const { url: targetUrl } = dto.parse(Object.fromEntries(url.searchParams))

  const { result } = await ogs({ url: targetUrl })

  return Response.json(result)
}
