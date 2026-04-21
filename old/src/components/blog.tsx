'use client'
import dayjs from 'dayjs'
import useSWR from 'swr'
import ky from 'ky'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Tags from './tags'

export function useBlog(route?: string) {
  return useSWR(`/api${route}`, async (api: string) => {
    if (!route) return undefined
    const data = await ky.get(api).json<Blog>()
    return data
  })
}

export function BlogCard({ route }: { route: string }) {
  const {
    data: { date = new Date(), tags = [], title = '', description = '' } = {},
  } = useBlog(route)

  return (
    <Link
      className="w-full grid grid-cols-6 gap-4 py-16 border-t border-base-300 cursor-pointer relative group"
      href={route}
    >
      <div className="col-span-full sm:col-span-1 sm:mt-1 flex flex-col gap-3">
        <p className="text-xs opacity-60">
          {dayjs(date).format('DD MMMM, YYYY')}
        </p>
        <Tags value={tags} readOnly />
      </div>
      <h2 className="col-span-full sm:col-span-2 font-semibold tracking-tight sm:-mt-1">
        {title}
      </h2>
      <p className="col-span-full sm:col-span-3 text-sm opacity-60">
        {description}
      </p>
      <button className="btn btn-circle btn-outline btn-sm absolute bottom-4 left-0 opacity-0 scale-75 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100">
        <ArrowUpRight className="w-4 h-4" />
      </button>
    </Link>
  )
}

export function LiteBlogCard({ route }: { route: string }) {
  const { data: { title = '', description = '' } = {} } = useBlog(route)

  return (
    <Link
      className="w-full grid grid-cols-12 gap-2 py-6 border-t border-base-300 cursor-pointer relative group"
      href={route}
    >
      <h3 className="col-span-full font-semibold tracking-tight leading-tight">
        {title}
      </h3>
      <p className="col-span-full text-sm opacity-60 line-clamp-2">
        {description}
      </p>
    </Link>
  )
}
