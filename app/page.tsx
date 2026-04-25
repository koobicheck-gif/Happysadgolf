'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Game } from '@/types'
import { getGames, deleteGame } from '@/lib/storage'
import { requestNotificationPermission, scheduleReminderIfNeeded } from '@/lib/notifications'
import MastersHeader from '@/components/ui/MastersHeader'
import StatsBanner from '@/components/dashboard/StatsBanner'
import GameCard from '@/components/dashboard/GameCard'
import BottomNav from '@/components/ui/BottomNav'

export default function Dashboard() {
  const [games, setGames] = useState<Game[]>([])
  const [loaded, setLoaded] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)

  useEffect(() => {
    setGames(getGames().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    setLoaded(true)
    // Notifications
    requestNotificationPermission().then(granted => {
      if (granted) scheduleReminderIfNeeded()
    })
    // PWA install prompt
    const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e); setShowInstallBanner(true) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    // @ts-ignore
    await installPrompt.prompt()
    setShowInstallBanner(false)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this round?')) return
    deleteGame(id)
    setGames(prev => prev.filter(g => g.id !== id))
  }

  const inProgress = games.filter(g => g.result === 'in-progress')
  const completed = games.filter(g => g.result !== 'in-progress')

  return (
    <div className="flex flex-col flex-1 pb-20">
      <MastersHeader />

      <div className="flex-1 overflow-auto px-4 py-5 space-y-5">
        {/* PWA install banner */}
        <AnimatePresence>
          {showInstallBanner && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-masters-dark text-white rounded-2xl p-4 flex items-center gap-3 shadow-lg">
              <span className="text-2xl">⛳</span>
              <div className="flex-1">
                <div className="font-bold text-masters-gold text-sm">Add to Home Screen</div>
                <div className="text-xs text-white text-opacity-70">Install for the best experience</div>
              </div>
              <button onClick={handleInstall} className="bg-masters-gold text-masters-dark text-xs font-bold px-3 py-1.5 rounded-lg">Install</button>
              <button onClick={() => setShowInstallBanner(false)} className="text-white text-opacity-40 hover:text-opacity-70 text-lg">×</button>
            </motion.div>
          )}
        </AnimatePresence>

        {loaded && <StatsBanner games={games} />}

        {/* In Progress */}
        <AnimatePresence>
          {inProgress.length > 0 && (
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-sm font-bold text-masters-green uppercase tracking-widest mb-2 px-1">In Progress</h2>
              <div className="space-y-3">
                {inProgress.map((g, i) => <GameCard key={g.id} game={g} index={i} />)}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* History */}
        <section>
          <h2 className="text-sm font-bold text-masters-green uppercase tracking-widest mb-2 px-1">Round History</h2>
          {completed.length === 0 && loaded ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-3">⛳</div>
              <p className="text-gray-400 font-medium">No rounds yet</p>
              <p className="text-sm text-gray-300 mt-1">Tap + to start your first game</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completed.map((g, i) => (
                <div key={g.id} className="relative group">
                  <GameCard game={g} index={i} />
                  <button onClick={() => handleDelete(g.id)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-sm">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <BottomNav active="home" />
    </div>
  )
}
