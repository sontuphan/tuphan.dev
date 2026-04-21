'use client'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
} from 'react'
import clsx from 'clsx'

import Island from '@/components/island'

import './index.scss'

export type TocProps = ComponentProps<'nav'>

function Nav({ className, ...props }: TocProps) {
  const [id, setId] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const headings = useMemo(() => {
    const [prose] = document.getElementsByClassName('prose') || []
    return prose?.querySelectorAll('h1, h2, h3') || []
  }, [])

  useEffect(() => {
    function scroll() {
      for (const heading of Array.from(headings)) {
        const { top, bottom } = heading.getBoundingClientRect()
        if (top >= 0 && bottom <= window.innerHeight) return setId(heading.id)
      }
      for (const heading of Array.from(headings).reverse()) {
        const { bottom } = heading.getBoundingClientRect()
        if (bottom <= window.innerHeight) return setId(heading.id)
      }
    }
    scroll() // Init
    window.addEventListener('scroll', scroll)
    return () => window.removeEventListener('scroll', scroll)
  }, [headings])

  useEffect(() => {
    if (id) {
      const actives =
        ref?.current?.querySelectorAll(`li:has(> a[href="#${id}"])`) || []
      for (const active of actives) active.classList.add('active')
      const inactives =
        ref?.current?.querySelectorAll(`li:not(:has(> a[href="#${id}"]))`) || []
      for (const inactive of inactives) inactive.classList.remove('active')
    }
  }, [id, ref])

  return (
    <div
      className="fixed top-[50%] -translate-y-[50%] right-0 cursor-pointer group z-10"
      ref={ref}
    >
      <div className="group-hover:hidden animate-pop-in p-1 m-1 flex flex-col gap-[0.125rem]">
        {Array.from(headings).map((heading) => (
          <div
            key={heading.id}
            className={clsx(
              'w-[0.375rem] h-[0.125rem] rounded transition-all',
              {
                'bg-base-content/10': heading.id !== id,
                'bg-base-content': heading.id === id,
              },
            )}
          />
        ))}
      </div>
      <nav
        className={clsx('hidden group-hover:block animate-pop-in', className)}
        {...props}
      />
    </div>
  )
}

export default function Toc(props: TocProps) {
  return (
    <Island>
      <Nav {...props} />
    </Island>
  )
}
