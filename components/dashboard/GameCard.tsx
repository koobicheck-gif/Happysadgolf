'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Game } from '@/types'
import Badge from '@/components/ui/Badge'
import { format } from 'date-fns'

interface GameCardProps {
  game: Game
  index: number
}

export default function GameCard({ game, index }: GameCardProps) {
  const scored = game.holes.filter(h => h.emoji !== null).length
  const isComplete = game.result !== 'in-progress'
  const href = isComplete ? `/game/${game.id}` : `/game/${game.id}/play`

  const dateLabel = (() => {
    try { return format(new Date(game.date), 'MMM d, yyyy') } catch { return game.date }
  })()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={href}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 active:scale-[0.98] transition-transform hover:shadow-md">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="font-bold text-masters-dark text-base truncate">{game.courseName}</div>
              <div className="text-sm text-gray-400 mt-0.5">{dateLabel} · {game.totalHoles} holes</div>
            </div>
            <Badge result={game.result} size="sm" />
          </div>

          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">😊</span>
              <span className="text-sm font-bold text-happy-dark">{game.happyCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg">😔</span>
              <span className="text-sm font-bold text-sad-dark">{game.sadCount}</span>
            </div>
            {game.totalStrokes != null && (
              <div className="flex items-center gap-1 text-sm text-gray-400 ml-auto">
                <span className="text-xs">⛳</span>
                <span className="font-semibold">{game.totalStrokes}</span>
              </div>
            )}
            {!isComplete && (
              <div className="ml-auto flex items-center gap-1 text-xs text-masters-green font-semibold">
                <span>Hole {scored + 1}</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>

          {/* mini emoji strip */}
          <div className="mt-2.5 flex gap-0.5 flex-wrap">
            {game.holes.map(h => (
              <span key={h.number} className="text-[11px] leading-none">
                {h.emoji === 'happy' ? '😊' : h.emoji === 'sad' ? '😔' : <span className="inline-block w-3 h-3 rounded-full bg-gray-100" />}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
