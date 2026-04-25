'use client'
import { motion } from 'framer-motion'
import { EmojiResult } from '@/types'

interface EmojiButtonProps {
  type: 'happy' | 'sad'
  selected: boolean
  onSelect: () => void
  disabled?: boolean
}

const config = {
  happy: {
    emoji: '😊',
    label: 'Happy',
    bg: 'bg-happy-light',
    border: 'border-happy',
    ring: 'ring-happy',
    text: 'text-happy-dark',
    selectedBg: 'bg-happy',
    selectedText: 'text-white',
  },
  sad: {
    emoji: '😔',
    label: 'Sad',
    bg: 'bg-sad-light',
    border: 'border-sad',
    ring: 'ring-sad',
    text: 'text-sad-dark',
    selectedBg: 'bg-sad',
    selectedText: 'text-white',
  },
}

export default function EmojiButton({ type, selected, onSelect, disabled }: EmojiButtonProps) {
  const c = config[type]
  return (
    <motion.button
      onClick={onSelect}
      disabled={disabled}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.03 }}
      animate={selected ? { scale: [1, 1.12, 1] } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`
        relative flex flex-col items-center justify-center gap-2
        w-full aspect-square rounded-3xl border-2 transition-all duration-200
        shadow-md active:shadow-inner
        ${selected
          ? `${c.selectedBg} border-transparent ${c.selectedText} shadow-lg`
          : `${c.bg} ${c.border} ${c.text} hover:shadow-lg`
        }
        disabled:opacity-40 disabled:cursor-not-allowed
      `}
    >
      <motion.span
        className="text-6xl leading-none select-none"
        animate={selected ? { rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.4 }}
      >
        {c.emoji}
      </motion.span>
      <span className={`text-lg font-bold tracking-wide ${selected ? 'text-white' : ''}`}>
        {c.label}
      </span>
      {selected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-2 right-2 w-6 h-6 bg-white bg-opacity-30 rounded-full flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
    </motion.button>
  )
}
