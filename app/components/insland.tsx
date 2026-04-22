import { Fragment, type ReactNode } from 'react'
import { ClientOnly } from 'remix-utils/client-only'

export type IslandProps = {
  children: ReactNode
  Loading?: React.FC
}

export default function Island({ children, Loading = Fragment }: IslandProps) {
  return <ClientOnly fallback={<Loading />}>{() => children}</ClientOnly>
}
