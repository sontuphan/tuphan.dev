import { useState } from 'react'
import clsx from 'clsx'

import { Disc3 } from 'lucide-react'
import ReactPlayer from 'react-player'

export default function Chill() {
  const [playing, setPlaying] = useState(false)

  return (
    <button
      className="btn btn-sm btn-circle btn-ghost relative"
      onClick={() => setPlaying(!playing)}
    >
      <ReactPlayer
        className="invisible w-full! h-full! absolute top-0 left-0 pointer-events-none"
        src="https://www.youtube.com/watch?v=UXLKeA-ck6Y"
        playing={playing}
        loop
      />
      <Disc3
        className={clsx('w-4 h-4 animate-[spin_2s_linear_infinite]', {
          '[animation-play-state:running]': playing,
          '[animation-play-state:paused]': !playing,
        })}
      />
    </button>
  )
}
