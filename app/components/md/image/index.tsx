import { type ImgHTMLAttributes, useMemo } from 'react'

import Panorama from './panorama.client'
import Zoom from './zoom'

export default function Image({
  alt = '',
  title: meta = '',
  src: url = '',
  className,
}: ImgHTMLAttributes<HTMLImageElement>) {
  const { src } = useMemo(
    () => (typeof url === 'string' ? { src: url } : url),
    [url],
  )

  if (meta === 'panorama')
    return <Panorama className={className} src={src} alt={alt} />
  return <Zoom className={className} src={src} alt={alt} />
}
