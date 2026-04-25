'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Game } from '@/types'
import { getGames } from '@/lib/storage'
import MastersHeader from '@/components/ui/MastersHeader'
import BottomNav from '@/components/ui/BottomNav'
import TrendChart from '@/components/stats/TrendChart'
import HoleHeatmap from '@/components/stats/HoleHeatmap'
import CourseBreakdown from '@/components/stats/CourseBreakdown'
import HandicapCard from '@/components/stats/HandicapCard'

function StatCard({ label, value, sub, color = 'text-masters-dark' }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center"
    >
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div className="text-xs font-semibold text-gray-500 mt-0.5">{label}</div>
      {sub && <div className="text-[10px] text-gray-300 mt-0.5">{sub}</div>}
    </motion.div>
  )
}

function calcStreak(games: Game[]): { current: number; best: number } {
  const completed = games.filter(g => g.result !== 'in-progress')
  let current = 0, best = 0, run = 0
  for (const g of completed) {
    if (g.result === 'happy') { run++; if (run > best) best = run }
    else run = 0
  }
  // current streak from end
  for (let i = completed.length - 1; i >= 0; i--) {
    if (completed[i].result === 'happy') current++
    else break
  }
  return { current, best }
}

export default function StatsPage() {
  const [games, setGames] = useState<Game[]>([])
  const [tab, setTab] = useState<'overview' | 'holes' | 'courses'>('overview')

  useEffect(() => {
    setGames(getGames().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
  }, [])

  const completed = games.filter(g => g.result !== 'in-progress')
  const happyGames = completed.filter(g => g.result === 'happy').length
  const sadGames = completed.filter(g => g.result === 'sad').length
  const happyRate = completed.length > 0 ? Math.round((happyGames / completed.length) * 100) : 0
  const { current: currentStreak, best: bestStreak } = calcStreak(games)

  const totalHappy = games.reduce((s, g) => s + g.happyCount, 0)
  const totalSad = games.reduce((s, g) => s + g.sadCount, 0)

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'holes', label: 'Holes' },
    { id: 'courses', label: 'Courses' },
  ] as const

  return (
    <div className="flex flex-col flex-1 pb-20">
      <MastersHeader title="Stats" />

      <div className="flex-1 overflow-auto px-4 py-5 space-y-5">
        {/* Tab selector */}
        <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-gray-100 gap-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                tab === t.id
                  ? 'bg-masters-green text-white shadow-sm'
                  : 'text-gray-400 hover:text-masters-green'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Happy Rate" value={`${happyRate}%`} sub={`${completed.length} rounds`} color="text-masters-green" />
              <StatCard label="Current Streak" value={currentStreak === 0 ? '—' : `${currentStreak} 🔥`} sub={`Best: ${bestStreak}`} color="text-happy-dark" />
              <StatCard label="Happy Games" value={happyGames} color="text-happy-dark" />
              <StatCard label="Sad Games" value={sadGames} color="text-sad-dark" />
              <StatCard label="Total 😊 Holes" value={totalHappy} />
              <StatCard label="Total 😔 Holes" value={totalSad} />
            </div>

            {/* Trend chart */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-masters-dark">Happy Rate Trend</span>
                <span className="text-xs text-gray-400">Last 20 rounds</span>
              </div>
              <TrendChart games={games} />
              <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-happy inline-block" /> Happy game</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sad inline-block" /> Sad game</span>
                <span className="flex items-center gap-1 ml-auto"><span className="w-3 border-t-2 border-dashed border-masters-gold inline-block" /> 50% line</span>
              </div>
            </div>

            {/* Handicap */}
            <div>
              <h2 className="text-sm font-bold text-masters-green uppercase tracking-widest mb-2 px-1">Handicap Index</h2>
              <HandicapCard games={games} />
            </div>
          </>
        )}

        {tab === 'holes' && (
          <>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-masters-dark">Hole Happiness</span>
              </div>
              <HoleHeatmap games={games} />
              <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-400 flex-wrap">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-happy inline-block" /> ≥60% happy</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-masters-gold inline-block" /> 45–59%</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-sad inline-block" /> &lt;45%</span>
              </div>
            </div>

            {/* Best/worst holes */}
            {completed.length > 0 && (() => {
              const holeRates = Array.from({ length: 18 }, (_, i) => {
                const num = i + 1
                let happy = 0, total = 0
                for (const g of completed) {
                  const h = g.holes.find(hole => hole.number === num)
                  if (h?.emoji) { total++; if (h.emoji === 'happy') happy++ }
                }
                return { num, rate: total > 0 ? happy / total : null, total }
              }).filter(h => h.rate !== null && h.total >= 2) as { num: number; rate: number; total: number }[]

              if (holeRates.length === 0) return null
              const best = [...holeRates].sort((a, b) => b.rate - a.rate).slice(0, 3)
              const worst = [...holeRates].sort((a, b) => a.rate - b.rate).slice(0, 3)

              return (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-happy-light rounded-2xl p-3 border border-happy border-opacity-20">
                    <div className="text-xs font-bold text-happy-dark mb-2">😊 Best Holes</div>
                    {best.map(h => (
                      <div key={h.num} className="flex justify-between text-sm">
                        <span className="font-semibold text-masters-dark">Hole {h.num}</span>
                        <span className="font-bold text-happy-dark">{Math.round(h.rate * 100)}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-sad-light rounded-2xl p-3 border border-sad border-opacity-20">
                    <div className="text-xs font-bold text-sad-dark mb-2">😔 Tough Holes</div>
                    {worst.map(h => (
                      <div key={h.num} className="flex justify-between text-sm">
                        <span className="font-semibold text-masters-dark">Hole {h.num}</span>
                        <span className="font-bold text-sad-dark">{Math.round(h.rate * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}
          </>
        )}

        {tab === 'courses' && (
          <div>
            <h2 className="text-sm font-bold text-masters-green uppercase tracking-widest mb-3 px-1">By Course</h2>
            <CourseBreakdown games={games} />
          </div>
        )}
      </div>

      <BottomNav active="stats" />
    </div>
  )
}
