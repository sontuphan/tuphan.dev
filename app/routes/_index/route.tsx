import type { Route } from './+types/route'

import Island from '~/components/island'
import Landing from './landing'
import Blogs from './blogs'
import TagList from './taglist'

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
      <div className="w-full flex flex-row mt-6 justify-center">
        <div className="w-full max-w-a4 flex flex-row gap-1 p-6">
          <Island>
            <TagList />
          </Island>
        </div>
      </div>
      <div className="w-full flex flex-row justify-center align-middle">
        <Island>
          <Blogs />
        </Island>
      </div>
    </div>
  )
}
