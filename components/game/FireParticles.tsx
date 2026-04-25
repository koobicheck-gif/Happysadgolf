'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Particle {
  id: number
  x: number
  emoji: string
  delay: number
  size: number
}

interface FireParticlesProps {
  trigger: number // increment to fire
}

const FIRE_EMOJIS = ['🔥', '🔥', '🔥', '😤', '💢', '😩']

export default function FireParticles({ trigger }: FireParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (trigger === 0) return
    const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: FIRE_EMOJIS[Math.floor(Math.random() * FIRE_EMOJIS.length)],
      delay: Math.random() * 0.3,
      size: 20 + Math.random() * 24,
    }))
    setParticles(newParticles)
    const timer = setTimeout(() => setParticles([]), 1800)
    return () => clearTimeout(timer)
  }, [trigger])

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, y: '70vh', x: `${p.x}vw`, scale: 0.5 }}
            animate={{ opacity: 0, y: '10vh', x: `calc(${p.x}vw + ${(Math.random() - 0.5) * 80}px)`, scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 + Math.random() * 0.6, delay: p.delay, ease: 'easeOut' }}
            style={{ position: 'fixed', fontSize: p.size }}
          >
            {p.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
