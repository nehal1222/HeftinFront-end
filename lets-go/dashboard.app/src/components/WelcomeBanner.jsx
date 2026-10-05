import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const VIDEO_POOL = [
  '../videos/DASHBOARD.mp4',
  '../videos/DASHBOARD1.mp4',
  '../videos/DASHBOARD2.mp4',
]

export default function WelcomeBanner() {
  const videoRef = useRef(null)
  const [src, setSrc] = useState(VIDEO_POOL[0])
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setSrc((current) => {
          const choices = VIDEO_POOL.filter((p) => p !== current)
          return choices[Math.floor(Math.random() * choices.length)]
        })
        setVisible(true)
      }, 700)
    }, 18000)

    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    videoRef.current?.load()
    videoRef.current?.play().catch(() => {})
  }, [src])

  return (
    <motion.section
      className="welcome-banner"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <video
        ref={videoRef}
        className="welcome-banner-video"
        style={{ opacity: visible ? 1 : 0 }}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source src={src} type="video/mp4" />
      </video>
      <span className="welcome-banner-overlay" aria-hidden="true" />

      <div className="welcome-banner-content">
        <span className="welcome-banner-eyebrow">Keep the streak alive</span>
        <h2>You're 12% ahead of last week.</h2>
        <p>Jump back into a mock test, or review where you left off.</p>
      </div>
    </motion.section>
  )
}
