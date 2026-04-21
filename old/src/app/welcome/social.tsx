'use client'
import type { ComponentProps, ReactNode } from 'react'
import clsx from 'clsx'

import AnimatedLink from './alink'

export type SocialProps = {
  className?: string
  children: ReactNode
} & ComponentProps<typeof AnimatedLink>

export default function Social({ className, children, ...props }: SocialProps) {
  return (
    <AnimatedLink
      className={clsx('font-satoshi text-3xl hover:underline', className)}
      initial={{ y: 32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </AnimatedLink>
  )
}
