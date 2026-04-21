'use client'
import { useCallback, useEffect, useState } from 'react'
import ky from 'ky'
import { motion } from 'motion/react'
import clsx from 'clsx'

import { BlogCard } from '@/components/blog'
import InfiniteLoading from '@/components/infiniteLoading'

import { useSwitchSignal } from '@/lib/hooks/useSignal'
import { useTag } from '@/lib/hooks/useTag'

export default function BlogList() {
  const tag = useTag()
  const reset = useSwitchSignal(tag)
  const [{ disabled, blogs }, setData] = useState<{
    disabled: boolean
    blogs: string[]
  }>({ disabled: false, blogs: [] })
  const limit = 10
  const offset = blogs.length

  console.log(limit, offset, tag)

  const onLoad = useCallback(async () => {
    const data = await ky
      .post('/api/blog', {
        json: {
          t: tag,
          limit,
          offset,
        },
      })
      .json<string[]>()
    return setData(({ blogs: [...blogs] }) => {
      data.forEach((item, i) => (blogs[offset + i] = item))
      return { disabled: data.length !== limit, blogs }
    })
  }, [limit, offset, tag])

  useEffect(() => {
    if (reset) setData({ disabled: false, blogs: [] })
  }, [reset])

  return (
    <>
      {blogs.map((route, i) => (
        <motion.div
          key={route}
          className="w-full"
          initial={{ y: 8 * (i + 1), opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <BlogCard route={route} />
        </motion.div>
      ))}
      <div className="w-full flex flex-col items-center justify-center">
        <p className={clsx('text-xs', { hidden: !disabled })}>
          <span className="opacity-25">You reached the bottom</span> 🎉
        </p>
        <InfiniteLoading onLoad={onLoad} disabled={disabled} />
      </div>
    </>
  )
}
