import type { Route } from './+types/route'

import { redirect } from 'react-router'

export async function loader({ request: _ }: Route.LoaderArgs) {
  throw redirect('/')
}
