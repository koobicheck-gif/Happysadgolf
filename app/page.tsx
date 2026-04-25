'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Game } from '@/types'
import { getGames, deleteGame } from '@/lib/storage'
import MastersHeader from '@/components/ui/MastersHeader'
import StatsBanner from '@/components/dashboard/StatsBanner'
import GameCard from '@/components/dashboard/GameCard'

export default function Dashboard() {
  const [games, setGames] = useState<Game[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setGames(getGames().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    setLoaded(true)
  }, [])

  const handleDelete = (id: string) => {
    if (!confirm('Delete this round?')) return
    deleteGame(id)
    setGames(prev => prev.filter(g => g.id !== id))
  }

  const inProgress = games.filter(g => g.result === 'in-progress')
  const completed = games.filter(g => g.result !== 'in-progress')

  return (
    <div className="flex flex-col flex-1">
      <MastersHeader />

      <div className="flex-1 overflow-auto px-4 py-5 space-y-6 pb-24">
        {loaded && <StatsBanner games={games} />}

        {/* In Progress */}
        <AnimatePresence>
          {inProgress.length > 0 && (
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-sm font-bold text-masters-green uppercase tracking-widest mb-2 px-1">
                In Progress
              </h2>
              <div className="space-y-3">
                {inProgress.map((g, i) => (
                  <GameCard key={g.id} game={g} index={i} />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* History */}
        <section>
          <h2 className="text-sm font-bold text-masters-green uppercase tracking-widest mb-2 px-1">
            Round History
          </h2>
          {completed.length === 0 && loaded ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-3">⛳</div>
              <p className="text-gray-400 font-medium">No rounds yet</p>
              <p className="text-sm text-gray-300 mt-1">Start a new game to begin tracking</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completed.map((g, i) => (
                <div key={g.id} className="relative group">
                  <GameCard game={g} index={i} />
                  <button
                    onClick={() => handleDelete(g.id)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-sm"
                    title="Delete round"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* FAB */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10" style={{ maxWidth: '28rem', width: '100%', display: 'flex', justifyContent: 'flex-end', paddingRight: '1.5rem' }}>
        <Link href="/game/new">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="w-16 h-16 rounded-full bg-masters-green text-white shadow-2xl flex items-center justify-center text-3xl border-4 border-masters-gold"
          >
            +
          </motion.button>
        </Link>
      </div>
    </div>
  )
}
