'use client'
import {
  forwardRef,
  type PropsWithChildren,
  useRef,
  cloneElement,
  Children,
  type ReactNode,
} from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import clsx from 'clsx'

import { cn } from './utils'

export type DockProps = {
  className?: string
  magnification?: number
  distance?: number
  direction?: 'top' | 'middle' | 'bottom'
  children: ReactNode
}

const DEFAULT_SIZE = 32
const DEFAULT_MAGNIFICATION = 48
const DEFAULT_DISTANCE = 140

export const Dock = forwardRef<HTMLDivElement, DockProps>(function Dock(
  {
    className = '',
    children,
    magnification = DEFAULT_MAGNIFICATION,
    distance = DEFAULT_DISTANCE,
    direction = 'bottom',
    ...props
  },
  ref,
) {
  const mouseX = useMotionValue(Infinity)
  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      {...props}
      className={cn(
        clsx(
          'w-max h-[48px] p-2 flex flex-row gap-3 rounded-full bg-base-100/60 backdrop-blur shadow-sm ring-2 ring-base-300/60',
          className,
          {
            'items-start': direction === 'top',
            'items-center': direction === 'middle',
            'items-end': direction === 'bottom',
          },
        ),
      )}
    >
      {Children.map(children, (child: any) =>
        cloneElement(child, {
          mouseX: mouseX,
          magnification,
          distance,
        }),
      )}
    </motion.div>
  )
})

export type DockIconProps = {
  size?: number
  magnification?: number
  distance?: number
  mouseX?: any
  className?: string
  children?: ReactNode
  props?: PropsWithChildren
}

export function DockIcon({
  size = DEFAULT_SIZE,
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  mouseX,
  className,
  children,
  ...props
}: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null)

  const distanceCalc = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthSync = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [size, magnification, size],
  )

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className={cn(
        'flex aspect-square cursor-pointer items-center justify-center rounded-full',
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
