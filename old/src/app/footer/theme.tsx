import { useCallback, useMemo } from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'motion/react'
import clsx from 'clsx'

import { Monitor, Moon, Sun } from 'lucide-react'

export type ThemeProps = {
  className?: string
}

export default function Theme({ className }: ThemeProps) {
  const { theme, setTheme } = useTheme()

  const MotionIcon = useMemo(() => {
    switch (theme) {
      case 'light':
        return motion.create(Sun)
      case 'dark':
        return motion.create(Moon)
      default:
        return motion.create(Monitor)
    }
  }, [theme])

  const onTheme = useCallback(() => {
    if (theme === 'system') return setTheme('light')
    if (theme === 'light') return setTheme('dark')
    return setTheme('system')
  }, [theme, setTheme])

  return (
    <button
      className={clsx('btn btn-circle btn-sm btn-ghost', className)}
      onClick={onTheme}
    >
      <MotionIcon
        className="w-4 h-4"
        initial={{ scale: 0, opacity: 0, rotate: 180 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
      />
    </button>
  )
}
