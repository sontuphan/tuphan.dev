'use client'
import { useEffect, useRef } from 'react'
import { useAsyncFn, useIntersection } from 'react-use'
import clsx from 'clsx'

import { useEdgeSignal } from '@/lib/hooks/useSignal'

export type InfiniteLoadingProps = {
  onLoad: () => Promise<void>
  disabled?: boolean
}

export default function InfiniteLoading({
  onLoad,
  disabled = false,
}: InfiniteLoadingProps) {
  const ref = useRef<HTMLElement>(document.body)
  const intersection = useIntersection(ref, {
    root: null,
    rootMargin: '0px',
    threshold: 1,
  })
  const loadable = useEdgeSignal(
    intersection?.intersectionRatio === 1 && !disabled,
    false,
    true,
  )

  const [{ loading }, load] = useAsyncFn(onLoad, [onLoad])

  useEffect(() => {
    if (loadable) load()
  }, [loadable, load])

  return (
    <span
      className={clsx('loading loading-spinner loading-sm', {
        'opacity-0': !loading,
        'opacity-60': loading,
      })}
      ref={ref}
    />
  )
}
