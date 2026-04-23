import type { Route } from './+types/route'

import Island from '~/components/insland'
import Landing from './landing'
import Blogs from './blogs'

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

export default function Home() {
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
