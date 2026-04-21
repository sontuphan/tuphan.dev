'use client'
import clsx from 'clsx'
import { motion } from 'motion/react'
import { useRouter } from 'next-nprogress-bar'

export type TagsProps = {
  value?: string[]
  active?: string
  className?: string
  readOnly?: boolean
}

export default function Tags({
  className = 'flex flex-row flex-wrap gap-1',
  value = [],
  active,
  readOnly = false,
}: TagsProps) {
  const { push } = useRouter()

  return (
    <div className={className}>
      <motion.div
        className={clsx('badge badge-sm truncate', {
          'badge-outline': !!active,
          'badge-primary': !active,
          hidden: typeof active !== 'string',
          'cursor-pointer': !readOnly,
        })}
        onClick={() => !readOnly && push('/')}
        initial={{ x: 0, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ opacity: 0.6, transition: { duration: 0 } }}
        transition={{ duration: 0.5 }}
      >
        all
      </motion.div>
      {value.map((tag, i) => (
        <motion.div
          key={tag}
          className={clsx('badge badge-sm truncate', {
            'badge-outline': active !== tag,
            'badge-primary': active === tag,
            'cursor-pointer': !readOnly,
          })}
          onClick={() => !readOnly && push(`/?tag=${tag}`)}
          initial={{ x: Math.min(4 * (i + 1), 32), opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ opacity: 0.6, transition: { duration: 0 } }}
          transition={{ duration: 0.5 }}
        >
          {tag}
        </motion.div>
      ))}
    </div>
  )
}
