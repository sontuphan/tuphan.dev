import type { Route } from './+types/_index'

export function meta({}: Route.MetaArgs) {
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
  return <h1>Welcome</h1>
}
