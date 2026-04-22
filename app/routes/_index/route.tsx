import type { Route } from './+types/route'
import { Link } from 'react-router'
import { motion } from 'motion/react'

import { SparklesCore } from '~/components/sparkles'
import AnimatedLink from './alink'
import Bullet from './bullet'
import Social from './social'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'tuphan.dev' },
    {
      name: 'description',
      content:
        'I write about Computer Science, especially Web3, WebDev, Cryptography, and Math, with occasional notes from my MBA journey.',
    },
  ]
}

export default function Page() {
  return (
    <div
      className="w-full min-h-dvh p-8 flex flex-col gap-16 overflow-x-hidden overflow-y-auto"
      data-theme="dark"
    >
      <SparklesCore
        id="tsparticlesfullpage"
        background="transparent"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={10}
        className="w-full h-full absolute top-0 left-0 z-0"
        particleColor="#FFFFFF"
      />
      <div className="grid grid-cols-4 gap-0 z-0">
        <AnimatedLink
          className="col-span-full avatar flex flex-row cursor-pointer"
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          to="/"
        >
          <div className="w-8 rounded-full hover:ring-2 hover:ring-accent transition-all duration-500">
            <img src="/icon.png" alt="Home" />
          </div>
        </AnimatedLink>
        <motion.span
          className="col-span-full md:col-span-2 flex flex-row items-baseline gap-0"
          initial={{ y: -32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <span className="font-clash-display font-bold text-9xl">tu</span>
          <span className="grow border-b-[1rem] border-base-content" />
        </motion.span>
        <motion.span
          className="col-span-full md:col-span-2 flex flex-row items-baseline gap-0"
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <span className="font-clash-display font-bold text-9xl">phan</span>
          <span className="grow border-b-[1rem] border-base-content" />
        </motion.span>
      </div>
      <div className="grow flex flex-col gap-6 z-0">
        <motion.p
          className="text-xs font-satoshi font-black tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 0.5 }}
        >
          i&apos;m
        </motion.p>
        <div className="grow flex flex-col gap-2">
          <Bullet i={1}>A Blockchain Buidler & Cryptography Researcher.</Bullet>
          <Bullet i={2}>
            MBA at{' '}
            <Link
              className="underline"
              to="https://www.iit.edu/stuart"
              target="_blank"
            >
              Illinois Institute of Technology (IIT)
            </Link>
            .
          </Bullet>
          <Bullet i={3}>
            <Link
              className="underline"
              to="https://www.coursera.org/account/accomplishments/professional-cert/BJM4N6DQROMF"
              target="_blank"
            >
              Google-Certified
            </Link>{' '}
            Project Manager.
          </Bullet>
          <Bullet i={4}>
            Founder of{' '}
            <Link
              className="underline"
              to="https://x.com/SentreProtocol"
              target="_blank"
            >
              @SentreProtocol
            </Link>{' '}
            (Acquired by{' '}
            <Link
              className="underline"
              to="https://x.com/saros_xyz"
              target="_blank"
            >
              @saros_xyz
            </Link>
            ).
          </Bullet>
          <Bullet i={5}>
            <Link
              className="underline"
              to="/static/Thank you Letter - Mr. Tu Phan.pdf"
              target="_blank"
            >
              Visiting lecturer
            </Link>{' '}
            at Blockchain Application Projects, RMIT University.
          </Bullet>
          <Bullet i={6}>
            Vietnamese Translator of{' '}
            <Link
              className="underline"
              to="https://solanacookbook.com/vi/#%C4%91ong-gop"
              target="_blank"
            >
              Solana Cookbook
            </Link>
            .
          </Bullet>
          <Bullet i={7}>
            Author of 50K+ views{' '}
            <Link
              className="underline"
              to="https://medium.com/coinmonks/data-structure-in-ethereum-episode-1-recursive-length-prefix-rlp-encoding-decoding-d1016832f919"
              target="_blank"
            >
              Data Structure in Ethereum
            </Link>{' '}
            series in 2018.
          </Bullet>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-0 z-0">
        <Social className="col-span-1" to="/">
          blog
        </Social>
        <Social
          className="col-span-1"
          to="/static/Curriculum_Vitae.pdf"
          target="_blank"
        >
          cv
        </Social>
        <Social
          className="col-span-1"
          to="https://x.com/phan_sontu"
          target="_blank"
        >
          x
        </Social>
        <Social
          className="col-span-1"
          to="https://github.com/tuphan-dn"
          target="_blank"
        >
          git
        </Social>
      </div>
    </div>
  )
}
