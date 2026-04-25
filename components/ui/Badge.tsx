'use client'
import { GameResult } from '@/types'

interface BadgeProps {
  result: GameResult
  size?: 'sm' | 'md' | 'lg'
}

const config = {
  happy: { label: 'Happy Game', emoji: '😊', bg: 'bg-happy-light', text: 'text-happy-dark', border: 'border-happy' },
  sad: { label: 'Sad Game', emoji: '😔', bg: 'bg-sad-light', text: 'text-sad-dark', border: 'border-sad' },
  tie: { label: 'Tie', emoji: '😐', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
  'in-progress': { label: 'In Progress', emoji: '⛳', bg: 'bg-masters-green-light', text: 'text-masters-green', border: 'border-masters-green' },
}

const sizes = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
}

export default function Badge({ result, size = 'md' }: BadgeProps) {
  const c = config[result]
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-semibold ${c.bg} ${c.text} ${c.border} ${sizes[size]}`}>
      <span>{c.emoji}</span>
      <span>{c.label}</span>
    </span>
  )
}
