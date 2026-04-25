'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Game } from '@/types'
import { getGameById } from '@/lib/storage'
import { format } from 'date-fns'
import MastersHeader from '@/components/ui/MastersHeader'
import Badge from '@/components/ui/Badge'
import ScoreCard from '@/components/game/ScoreCard'
import Button from '@/components/ui/Button'

export default function GameDetail() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [game, setGame] = useState<Game | null>(null)

  useEffect(() => {
    const g = getGameById(id)
    if (!g) { router.replace('/'); return }
    setGame(g)
  }, [id, router])

  if (!game) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="text-gray-400 animate-pulse">Loading...</div>
      </div>
    )
  }

  const dateLabel = (() => {
    try { return format(new Date(game.date), 'EEEE, MMMM d, yyyy') } catch { return game.date }
  })()

  const isHappy = game.result === 'happy'
  const isSad = game.result === 'sad'

  return (
    <div className="flex flex-col flex-1">
      <MastersHeader title="Scorecard" showBack backHref="/" />

      <div className="flex-1 px-4 py-5 space-y-5 overflow-auto pb-10">
        {/* Result celebration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={`rounded-3xl p-6 text-center shadow-lg border ${
            isHappy
              ? 'bg-gradient-to-br from-happy to-green-700 border-happy'
              : isSad
              ? 'bg-gradient-to-br from-sad to-red-800 border-sad'
              : 'bg-gradient-to-br from-gray-500 to-gray-700 border-gray-400'
          } text-white`}
        >
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
            className="text-7xl mb-3"
          >
            {isHappy ? '😊' : isSad ? '😔' : '😐'}
          </motion.div>
          <h1 className="font-serif font-bold text-2xl mb-1">
            {isHappy ? 'Happy Game!' : isSad ? 'Sad Game' : "It's a Tie"}
          </h1>
          <p className="text-white text-opacity-80 text-sm mb-3">{game.courseName}</p>
          <p className="text-xs text-white text-opacity-60">{dateLabel}</p>
        </motion.div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <div className="text-3xl mb-1">😊</div>
            <div className="text-2xl font-bold text-happy-dark">{game.happyCount}</div>
            <div className="text-xs text-gray-400">Happy</div>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <div className="text-3xl mb-1">😔</div>
            <div className="text-2xl font-bold text-sad-dark">{game.sadCount}</div>
            <div className="text-xs text-gray-400">Sad</div>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <div className="text-3xl mb-1">⛳</div>
            <div className="text-2xl font-bold text-masters-dark">
              {game.totalStrokes ?? '—'}
            </div>
            <div className="text-xs text-gray-400">Strokes</div>
          </div>
        </div>

        {/* Scorecard */}
        <div>
          <h2 className="text-sm font-bold text-masters-green uppercase tracking-widest mb-3 px-1">
            Hole by Hole
          </h2>
          <ScoreCard holes={game.holes} />
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Link href="/game/new">
            <Button fullWidth size="lg">Start New Round</Button>
          </Link>
          <Link href="/">
            <Button fullWidth variant="ghost" size="md">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
