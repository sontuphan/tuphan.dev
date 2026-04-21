'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useMotionValueEvent, useScroll, motion } from 'motion/react'
import clsx from 'clsx'

import Link from 'next/link'
import { SiGithub, SiX } from '@icons-pack/react-simple-icons'
import { SquareUserRound } from 'lucide-react'
import { Dock, DockIcon } from '@/components/dock'
import Island from '@/components/island'
import Chill from './chill'
import Theme from './theme'
import Search from './search'

const BLACKLIST = ['/welcome']

function Menu({ open = true }: { open?: boolean }) {
  return (
    <Dock className={clsx({ hidden: !open })} direction="middle">
      <DockIcon>
        <Link className="btn btn-sm btn-circle btn-ghost" href="/welcome">
          <SquareUserRound className="w-4 h-4" />
        </Link>
      </DockIcon>
      <DockIcon>
        <Search />
      </DockIcon>
      <DockIcon>
        <Chill />
      </DockIcon>
      <DockIcon className="mx-1">
        <Link className="avatar flex" href="/">
          <div className="w-8 rounded-full hover:ring-2 hover:ring-accent transition-all duration-500">
            <img src="/icon.png" alt="Home" />
          </div>
        </Link>
      </DockIcon>
      <DockIcon>
        <Link
          className="btn btn-sm btn-circle btn-ghost"
          href="https://x.com/phan_sontu"
          target="_blank"
        >
          <SiX className="w-4 h-4" />
        </Link>
      </DockIcon>
      <DockIcon>
        <Link
          className="btn btn-sm btn-circle btn-ghost"
          href="https://github.com/tuphan-dn"
          target="_blank"
        >
          <SiGithub className="w-4 h-4" />
        </Link>
      </DockIcon>
      <DockIcon>
        <Theme />
      </DockIcon>
    </Dock>
  )
}

export default function Footer() {
  const pathname = usePathname()
  const [scroll, setScroll] = useState({ y: 0, diff: 0 })
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScroll(({ y: prev }) => ({ y, diff: y - prev }))
  })
  return (
    <motion.div
      initial="open"
      animate={scroll.diff > 0 ? 'closed' : 'open'}
      variants={{ open: { y: '0%' }, closed: { y: 'calc(100% + 0.5rem)' } }}
      transition={{ duration: 0.3 }}
    >
      <Island>
        <Menu open={!BLACKLIST.find((e) => pathname.startsWith(e))} />
      </Island>
    </motion.div>
  )
}
