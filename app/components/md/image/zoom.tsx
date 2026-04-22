import clsx from 'clsx'

import MediumImageZoom from 'react-medium-image-zoom'

import 'react-medium-image-zoom/dist/styles.css'

export type ZoomProps = {
  src: string
  className?: string
  alt?: string
}

export default function Zoom({ src, className = '', alt = '' }: ZoomProps) {
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
