'use client'
import { type ComponentProps, useMemo } from 'react'
import clsx from 'clsx'

import View360, { ControlBar, CylindricalProjection } from '@egjs/react-view360'
import MediumImageZoom from 'react-medium-image-zoom'
import Island from '@/components/island'

import '@egjs/react-view360/css/view360.min.css'
import 'react-medium-image-zoom/dist/styles.css'

type InternalProps = {
  src: string
  className?: string
  alt?: string
}

function Panorama({ src, className = '', alt = '' }: InternalProps) {
  const projection = useMemo(
    () => new CylindricalProjection({ src, partial: true }),
    [src],
  )
  const plugins = useMemo(() => [new ControlBar()], [])
  return (
    <>
      <View360
        tag="span"
        className={clsx('block h-[50dvh] mb-2 rounded-box', className)}
        canvasClass="outline-none"
        projection={projection}
        plugins={plugins}
        initialZoom={0}
      />
      <span className="text-xs">{alt}</span>
    </>
  )
}

function Zoom({ src, className = '', alt = '' }: InternalProps) {
  return (
    <>
      <MediumImageZoom wrapElement="span">
        <img
          className={clsx('mb-2 rounded-box', className)}
          src={src}
          alt={alt}
        />
      </MediumImageZoom>
      <span className="text-xs">{alt}</span>
    </>
  )
}

export default function Image({
  alt = '',
  title: meta = '',
  src: url = '',
  className,
}: ComponentProps<'img'>) {
  const { src } = useMemo(
    () => (typeof url === 'string' ? { src: url } : url),
    [url],
  )

  if (meta === 'panorama')
    return (
      <Island>
        <Panorama className={className} src={src} alt={alt} />
      </Island>
    )
  return <Zoom className={className} src={src} alt={alt} />
}
