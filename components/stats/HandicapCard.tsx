'use client'
import { Game } from '@/types'
import { getDifferentials, calcHandicapIndex } from '@/lib/handicap'
import { motion } from 'framer-motion'

interface HandicapCardProps {
  games: Game[]
}

export default function HandicapCard({ games }: HandicapCardProps) {
  const diffs = getDifferentials(games)
  const index = calcHandicapIndex(diffs)

  if (diffs.length === 0) return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
      <p className="text-sm text-gray-400">Enter stroke counts + course rating/slope to track your handicap</p>
    </div>
  )

  const needed = 3 - diffs.length
  if (index === null) return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
      <p className="text-sm text-gray-400">{needed} more scored round{needed !== 1 ? 's' : ''} needed</p>
      <div className="mt-2 flex justify-center gap-1">
        {Array.from({ length: diffs.length }, (_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-masters-gold" />
        ))}
        {Array.from({ length: needed }, (_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-gray-200" />
        ))}
      </div>
    </div>
  )

  const lastDiff = diffs[diffs.length - 1]
  const trend = diffs.length >= 2 ? lastDiff - diffs[diffs.length - 2] : 0

  return (
    <div className="bg-gradient-to-br from-masters-dark to-masters-green rounded-2xl p-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-masters-gold font-bold uppercase tracking-widest mb-1">Handicap Index</div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-bold"
          >
            {index > 0 ? `+${index}` : index}
          </motion.div>
          <div className="text-xs text-white text-opacity-60 mt-1">Based on {diffs.length} round{diffs.length !== 1 ? 's' : ''}</div>
        </div>
        <div className="text-right">
          <div className="text-5xl mb-1">🏌️</div>
          {trend !== 0 && (
            <div className={`text-xs font-bold ${trend < 0 ? 'text-green-300' : 'text-red-300'}`}>
              {trend < 0 ? `↓ ${Math.abs(trend)}` : `↑ ${trend}`}
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 flex gap-1 flex-wrap">
        {diffs.slice(-8).map((d, i) => (
          <span key={i} className="text-xs bg-white bg-opacity-10 px-2 py-0.5 rounded-full text-masters-gold font-mono">
            {d > 0 ? `+${d}` : d}
          </span>
        ))}
      </div>
    </div>
  )
}
