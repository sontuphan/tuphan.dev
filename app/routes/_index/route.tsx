import Island from '~/components/insland'
import type { Route } from './+types/route'

import Landing from './landing'
import Blogs from './blogs'

import db from '~/db/table.json'

export function meta(_args: Route.MetaArgs) {
  return [
    { title: 'tuphan.dev' },
    {
      name: 'description',
      content:
        'I write about Computer Science, especially Web3, WebDev, Cryptography, and Math, with occasional notes from my MBA journey.',
    },
  ]
}

export async function loader({ params: _ }: Route.LoaderArgs) {
  const [root] = db.filter(({ route }) => route === '/blog')
  return root
}

export default function Home({
  loaderData: { children },
}: Route.ComponentProps) {
  console.log(children)
  return (
    <div className="w-full">
      <Landing />
      <div className="w-full flex flex-row justify-center align-middle">
        <Island>
          <Blogs />
        </Island>
      </div>
    </div>
  )
}
