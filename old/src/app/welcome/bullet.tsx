'use client'
import type { ReactNode } from 'react'
import { motion } from 'motion/react'

export type Bulletprops = {
  i?: number
  children: ReactNode
}

export default function Bullet({ i = 0, children }: Bulletprops) {
  return (
    <motion.p
      className="cursor-pointer font-satoshi"
      initial={{ x: i * 8, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: (i + 1) * 0.5 }}
    >
      <span className="opacity-60 hover:opacity-100 duration-500">
        {children}
      </span>
    </motion.p>
  )
}
