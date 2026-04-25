'use client'
import { motion } from 'framer-motion'
import { Hole } from '@/types'

interface HoleNavigatorProps {
  holes: Hole[]
  currentIndex: number
  onNavigate: (index: number) => void
}

export default function HoleNavigator({ holes, currentIndex, onNavigate }: HoleNavigatorProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap justify-center px-2">
      {holes.map((hole, i) => {
        const isCurrent = i === currentIndex
        const isScored = hole.emoji !== null
        let dotColor = 'bg-gray-200'
        if (isCurrent) dotColor = 'bg-masters-gold'
        else if (hole.emoji === 'happy') dotColor = 'bg-happy'
        else if (hole.emoji === 'sad') dotColor = 'bg-sad'

        return (
          <motion.button
            key={hole.number}
            onClick={() => onNavigate(i)}
            whileTap={{ scale: 0.85 }}
            className={`
              flex items-center justify-center rounded-full transition-all duration-200
              ${isCurrent ? 'w-8 h-8 shadow-md ring-2 ring-masters-gold ring-offset-1' : 'w-6 h-6'}
              ${dotColor}
            `}
          >
            {isCurrent && (
              <span className="text-xs font-bold text-masters-dark">{hole.number}</span>
            )}
            {!isCurrent && isScored && (
              <span className="text-[10px] leading-none">
                {hole.emoji === 'happy' ? '😊' : '😔'}
              </span>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
