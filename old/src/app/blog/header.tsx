'use client'
import { useMemo } from 'react'
import { useSelectedLayoutSegments } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import clsx from 'clsx'
import useSWR from 'swr'
import ky from 'ky'

import Link from 'next/link'
import { Play } from 'lucide-react'
import { SiFacebook, SiX } from '@icons-pack/react-simple-icons'
import Island from '@/components/island'

const MotionLink = motion(Link)

function NavLink({ href }: { href: string }) {
  const { data: name = '#' } = useSWR(href, async (api: string) => {
    if (api === '/') return 'Blog'
    const data = await ky.get(`/api/${api}`).json<Blog | undefined>()
    return data?.title || '#'
  })
  return (
    <Link className="opacity-60" href={href}>
      {name}
    </Link>
  )
}

function ClientFacebookShare({ className = '' }: { className?: string }) {
  const params = new URLSearchParams({
    u: typeof location !== 'undefined' ? location.href : '#',
  }).toString()
  return (
    <MotionLink
      className={clsx('btn btn-circle btn-sm', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      href={`https://www.facebook.com/sharer/sharer.php?${params}`}
      target="_blank"
    >
      <SiFacebook className="h-4 w-4" />
    </MotionLink>
  )
}

function ClientTwitterShare({ className = '' }: { className?: string }) {
  const params = new URLSearchParams({
    url: typeof location !== 'undefined' ? location.href : '#',
  }).toString()
  return (
    <MotionLink
      className={clsx('btn btn-circle btn-sm', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      href={`https://x.com/intent/tweet?${params}`}
      target="_blank"
    >
      <SiX className="h-4 w-4" />
    </MotionLink>
  )
}

export default function Header() {
  const segments = useSelectedLayoutSegments()
  const routes = useMemo(
    () => [
      '/',
      ...segments.map((segment, i, segments) =>
        ['/blog', ...segments.slice(0, i), segment].join('/'),
      ),
    ],
    [segments],
  )

  return (
    <div className="w-full flex flex-col gap-0">
      <div className="breadcrumbs text-sm">
        <ul>
          <AnimatePresence>
            {routes.map((route, i) => (
              <motion.li
                key={route}
                initial={{ x: 16 * (i + 1), opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 16 * (i + 1), opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <NavLink href={route} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <div className="w-full flex flex-row gap-2 justify-end py-3 border-y border-base-300">
        <Island>
          <ClientFacebookShare />
          <ClientTwitterShare />
        </Island>
        <span className="grow" />
        <motion.button
          className="btn btn-sm rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Play className="w-4 h-4 fill-base-content" />
          Listen to Article
        </motion.button>
      </div>
    </div>
  )
}
