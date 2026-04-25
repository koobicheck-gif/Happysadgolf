'use client'
import { motion } from 'framer-motion'
import { Game } from '@/types'

interface StatsBannerProps {
  games: Game[]
}

export default function StatsBanner({ games }: StatsBannerProps) {
  const completed = games.filter(g => g.result !== 'in-progress')
  const happyGames = completed.filter(g => g.result === 'happy').length
  const sadGames = completed.filter(g => g.result === 'sad').length
  const tieGames = completed.filter(g => g.result === 'tie').length
  const total = completed.length
  const diff = happyGames - sadGames

  const getMessage = () => {
    if (total === 0) return 'Start your first round!'
    if (diff > 0) return `${diff} more happy game${diff !== 1 ? 's' : ''} than sad — keep it up!`
    if (diff < 0) return `${Math.abs(diff)} more sad game${Math.abs(diff) !== 1 ? 's' : ''} — time to bounce back!`
    return "It's all square — go win one!"
  }

  return (
    <div className="bg-gradient-to-br from-masters-green to-masters-green-dark rounded-3xl p-5 text-white shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-masters-gold font-serif font-bold text-lg">Season Stats</span>
        {total > 0 && (
          <span className="text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-masters-gold">
            {total} round{total !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-happy bg-opacity-20 border border-happy border-opacity-40 rounded-2xl p-3 text-center"
        >
          <div className="text-4xl mb-1">😊</div>
          <div className="text-3xl font-bold text-white">{happyGames}</div>
          <div className="text-xs text-green-200 font-medium">Happy Games</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-sad bg-opacity-20 border border-sad border-opacity-40 rounded-2xl p-3 text-center"
        >
          <div className="text-4xl mb-1">😔</div>
          <div className="text-3xl font-bold text-white">{sadGames}</div>
          <div className="text-xs text-red-200 font-medium">Sad Games</div>
        </motion.div>
      </div>

      {tieGames > 0 && (
        <div className="text-center text-xs text-white text-opacity-60 mb-3">
          {tieGames} tie{tieGames !== 1 ? 's' : ''}
        </div>
      )}

      {total > 0 && (
        <div className="bg-white bg-opacity-10 rounded-xl p-2.5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs text-masters-gold font-semibold">Happy Rate</span>
            <span className="text-xs text-white text-opacity-60">{Math.round((happyGames / total) * 100)}%</span>
          </div>
          <div className="h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${total > 0 ? (happyGames / total) * 100 : 0}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
              className="h-full bg-masters-gold rounded-full"
            />
          </div>
        </div>
      )}

      <p className="text-center text-sm text-white text-opacity-80 mt-3 font-medium">{getMessage()}</p>
    </div>
  )
}
