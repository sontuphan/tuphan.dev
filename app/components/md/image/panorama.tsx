import { useMemo } from 'react'
import clsx from 'clsx'

import * as ReactView360 from '@egjs/react-view360'

import '@egjs/react-view360/css/view360.min.css'

const { default: View360, ControlBar, CylindricalProjection } = ReactView360

type InternalProps = {
  src: string
  className?: string
  alt?: string
}

export default function Panorama({
  src,
  className = '',
  alt = '',
}: InternalProps) {
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
