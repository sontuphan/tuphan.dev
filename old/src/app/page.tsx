'use client'
import { useCallback, useEffect, useState } from 'react'
import ky from 'ky'
import useSWR from 'swr'
import { motion } from 'motion/react'
import clsx from 'clsx'

import { BlogCard } from '@/components/blog'
import Tags from '@/components/tags'
import Island from '@/components/island'
import InfiniteLoading from '@/components/infiniteLoading'
import { DotPattern } from '@/components/patterns'

import { useSwitchSignal } from '@/lib/hooks/useSignal'
import { useTag } from '@/lib/hooks/useTag'
import { description } from './manifest'

function TagList() {
  const tag = useTag()
  const { data: tags = [] } = useSWR('/api/tag', async (api: string) => {
    const data = await ky.get(api).json<string[]>()
    return data
  })
  return (
    <Tags className="flex flex-row flex-wrap gap-2" value={tags} active={tag} />
  )
}

function BlogList() {
  const tag = useTag()
  const reset = useSwitchSignal(tag)
  const [{ disabled, blogs }, setData] = useState<{
    disabled: boolean
    blogs: string[]
  }>({ disabled: false, blogs: [] })
  const limit = 10
  const offset = blogs.length

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
          className="col-span-full"
          initial={{ y: 8 * (i + 1), opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <BlogCard route={route} />
        </motion.div>
      ))}
      <div className="col-span-full flex flex-col items-center justify-center">
        <p className={clsx('text-xs', { hidden: !disabled })}>
          <span className="opacity-25">You reached the bottom</span> 🎉
        </p>
        <InfiniteLoading onLoad={onLoad} disabled={disabled} />
      </div>
    </>
  )
}

export default function Page() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-a4 grid grid-cols-2 gap-4 p-6 my-8">
        <div className="col-span-full sm:col-span-1 -m-6 px-6 pt-6 pb-16 flex flex-col items-start relative">
          <DotPattern className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)] z-0" />
          <motion.span
            className="font-black font-satoshi text-9xl leading-normal z-0"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            blog
          </motion.span>
        </div>
        <div className="col-span-full sm:col-span-1 flex flex-col gap-6">
          <motion.p
            initial={{ x: 32, opacity: 0 }}
            animate={{ x: 0, opacity: 0.6 }}
            transition={{ duration: 0.5 }}
          >
            {description}
          </motion.p>
          <Island>
            <TagList />
          </Island>
        </div>
      </div>
      <div className="w-full max-w-a4 p-6 grid grid-cols-12 gap-0">
        <Island>
          <BlogList />
        </Island>
      </div>
    </div>
  )
}
