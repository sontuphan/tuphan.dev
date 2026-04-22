import type { ComponentProps } from 'react'
import { Link } from 'react-router'
import { motion } from 'motion/react'

import Island from '~/components/insland'

const AtomicAnimatedLink = motion.create(Link)

export default function AnimatedLink(
  props: ComponentProps<typeof AtomicAnimatedLink>,
) {
  return (
    <Island>
      <AtomicAnimatedLink {...props} />
    </Island>
  )
}
