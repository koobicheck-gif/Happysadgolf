'use client'
import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Game, Hole, EmojiResult, Player } from '@/types'
import { getGameById, saveGame, setCurrentGameId } from '@/lib/storage'
import { calculateResult, countEmojis, getTotalStrokes, getPlayers, updatePlayerInGame } from '@/lib/gameUtils'
import { attachDifferential } from '@/lib/handicap'
import MastersHeader from '@/components/ui/MastersHeader'
import EmojiButton from '@/components/game/EmojiButton'
import HoleNavigator from '@/components/game/HoleNavigator'
import StrokeCounter from '@/components/game/StrokeCounter'
import HoleStatsPanel from '@/components/game/HoleStatsPanel'
import FireParticles from '@/components/game/FireParticles'
import Button from '@/components/ui/Button'

function haptic(pattern: number | number[]) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}

const PLAYER_COLORS = ['bg-masters-green', 'bg-blue-500', 'bg-masters-gold', 'bg-red-500']
const PLAYER_EMOJIS = ['🟢', '🔵', '🟡', '🔴']

function PlayGameInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id') ?? ''

  const [game, setGame] = useState<Game | null>(null)
  const [currentHoleIndex, setCurrentHoleIndex] = useState(0)
  const [activePlayerIdx, setActivePlayerIdx] = useState(0)
  const [showStrokes, setShowStrokes] = useState(false)
  const [showHoleStats, setShowHoleStats] = useState(false)
  const [finishing, setFinishing] = useState(false)
  const [justScored, setJustScored] = useState(false)
  const [fireTrigger, setFireTrigger] = useState(0)
  const happyBtnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!id) { router.replace('/'); return }
    const g = getGameById(id)
    if (!g) { router.replace('/'); return }
    if (g.result !== 'in-progress') { router.replace(`/scorecard?id=${id}`); return }
    const players = getPlayers(g)
    // Find first unscored hole across all players
    const firstUnscoredIdx = players[0].holes.findIndex(h => h.emoji === null)
    setCurrentHoleIndex(firstUnscoredIdx >= 0 ? firstUnscoredIdx : 0)
    setGame(g)
  }, [id, router])

  const players = game ? getPlayers(game) : []
  const activePlayer = players[activePlayerIdx]
  const currentHole = activePlayer?.holes[currentHoleIndex]
  const isLastHole = game ? currentHoleIndex === game.holes.length - 1 : false

  const holeCompletedByAll = game
    ? getPlayers(game).every(p => p.holes[currentHoleIndex]?.emoji !== null)
    : false

  const totalScoredHoles = game
    ? getPlayers(game)[0].holes.filter(h => h.emoji !== null).length
    : 0

  const allComplete = game
    ? getPlayers(game).every(p => p.holes.every(h => h.emoji !== null))
    : false

  const saveUpdatedGame = useCallback((updated: Game) => {
    setGame(updated)
    saveGame(updated)
  }, [])

  const handleEmojiSelect = (emoji: EmojiResult) => {
    if (!game || justScored) return

    const updatedHoles = activePlayer.holes.map((h, i) =>
      i === currentHoleIndex ? { ...h, emoji } : h
    )
    const updated = updatePlayerInGame(game, activePlayerIdx, updatedHoles)
    saveUpdatedGame(updated)

    if (emoji === 'happy') {
      haptic(40)
      const el = happyBtnRef.current
      const rect = el?.getBoundingClientRect()
      const x = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5
      const y = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.5
      confetti({ particleCount: 80, spread: 70, origin: { x, y }, colors: ['#006747', '#C9A84C', '#ffffff', '#16a34a', '#fbbf24'], scalar: 1.1, gravity: 0.9 })
      setTimeout(() => confetti({ particleCount: 40, spread: 50, origin: { x: x - 0.1, y }, colors: ['#006747', '#C9A84C', '#dcfce7'], scalar: 0.8 }), 150)
    } else {
      haptic([30, 20, 30])
      setFireTrigger(t => t + 1)
    }

    setJustScored(true)

    // If more players to score on this hole, advance to next player
    const nextUnscored = players.findIndex((p, i) =>
      i !== activePlayerIdx && p.holes[currentHoleIndex]?.emoji === null
    )
    if (nextUnscored >= 0) {
      setTimeout(() => { setActivePlayerIdx(nextUnscored); setJustScored(false) }, 400)
    } else if (!isLastHole) {
      // All players scored this hole — advance to next
      setTimeout(() => {
        setCurrentHoleIndex(prev => prev + 1)
        setActivePlayerIdx(0)
        setJustScored(false)
        setShowStrokes(false)
        setShowHoleStats(false)
      }, 500)
    } else {
      setTimeout(() => setJustScored(false), 500)
    }
  }

  const handleHoleUpdate = (updates: Partial<Hole>) => {
    if (!game) return
    const updatedHoles = activePlayer.holes.map((h, i) =>
      i === currentHoleIndex ? { ...h, ...updates } : h
    )
    saveUpdatedGame(updatePlayerInGame(game, activePlayerIdx, updatedHoles))
  }

  const handleFinish = () => {
    if (!game || !allComplete) return
    setFinishing(true)
    const withDiff = attachDifferential({ ...game, completedAt: new Date().toISOString() })
    saveGame(withDiff)
    setCurrentGameId(null)
    router.push(`/scorecard?id=${id}`)
  }

  if (!game || !currentHole) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="text-gray-400 animate-pulse text-sm">Loading…</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      <MastersHeader
        title={game.courseName}
        showBack
        backHref="/"
        rightElement={<span className="text-xs text-masters-gold font-semibold">{totalScoredHoles}/{game.totalHoles}</span>}
      />

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <motion.div className="h-full bg-masters-gold" animate={{ width: `${(totalScoredHoles / game.totalHoles) * 100}%` }} transition={{ duration: 0.3 }} />
      </div>

      <div className="flex-1 flex flex-col px-4 pt-3 pb-6 gap-3 overflow-auto">
        {/* Hole + par */}
        <AnimatePresence mode="wait">
          <motion.div key={currentHoleIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="text-center">
            <div className="inline-flex items-center gap-2 bg-masters-green text-white px-4 py-1.5 rounded-full text-sm font-semibold">
              <span>Hole {currentHole.number}</span>
              <span className="opacity-60">·</span>
              <span>Par {currentHole.par}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Player tabs (multi-player only) */}
        {players.length > 1 && (
          <div className="flex gap-1.5">
            {players.map((p, i) => {
              const scored = p.holes[currentHoleIndex]?.emoji !== null
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePlayerIdx(i)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                    activePlayerIdx === i
                      ? `${PLAYER_COLORS[i]} text-white border-transparent shadow-md`
                      : 'bg-white text-gray-400 border-gray-100'
                  }`}
                >
                  <span>{PLAYER_EMOJIS[i]}</span>
                  <span className="truncate max-w-[60px]">{p.name}</span>
                  {scored && <span className="text-[10px]">✓</span>}
                </button>
              )
            })}
          </div>
        )}

        {/* Emoji buttons */}
        <AnimatePresence mode="wait">
          <motion.div key={`${currentHoleIndex}-${activePlayerIdx}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.15 }}
            className="grid grid-cols-2 gap-4 flex-1 max-h-56">
            <div ref={happyBtnRef} className="h-full">
              <EmojiButton type="happy" selected={currentHole.emoji === 'happy'} onSelect={() => handleEmojiSelect('happy')} />
            </div>
            <EmojiButton type="sad" selected={currentHole.emoji === 'sad'} onSelect={() => handleEmojiSelect('sad')} />
          </motion.div>
        </AnimatePresence>

        <FireParticles trigger={fireTrigger} />

        {/* Stroke counter */}
        <div>
          <button onClick={() => setShowStrokes(s => !s)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-white rounded-xl border border-gray-100 shadow-sm text-sm text-gray-500 hover:text-masters-green transition-colors">
            <span className="font-medium">⛳ Stroke count</span>
            <span>{showStrokes ? '▲' : '▼'}</span>
          </button>
          <AnimatePresence>
            {showStrokes && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden mt-2">
                <StrokeCounter strokes={currentHole.strokes} par={currentHole.par} onChange={strokes => handleHoleUpdate({ strokes })} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hole stats panel */}
        <div>
          <button onClick={() => setShowHoleStats(s => !s)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-white rounded-xl border border-gray-100 shadow-sm text-sm text-gray-500 hover:text-masters-green transition-colors">
            <span className="font-medium">📋 Hole stats {currentHole.putts != null || currentHole.fairwayHit != null || currentHole.gir != null || currentHole.club ? '✓' : ''}</span>
            <span>{showHoleStats ? '▲' : '▼'}</span>
          </button>
          <AnimatePresence>
            {showHoleStats && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden mt-2">
                <HoleStatsPanel hole={currentHole} onChange={updates => handleHoleUpdate(updates)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hole navigator */}
        <HoleNavigator holes={players[0].holes} currentIndex={currentHoleIndex}
          onNavigate={i => { setCurrentHoleIndex(i); setActivePlayerIdx(0); setShowStrokes(false); setShowHoleStats(false) }} />

        {/* Nav arrows */}
        <div className="flex gap-3">
          <button
            onClick={() => { setCurrentHoleIndex(i => Math.max(0, i - 1)); setActivePlayerIdx(0); setShowStrokes(false); setShowHoleStats(false) }}
            disabled={currentHoleIndex === 0}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-400 font-medium text-sm hover:border-masters-green hover:text-masters-green disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ← Prev
          </button>
          {!isLastHole ? (
            <button
              onClick={() => { setCurrentHoleIndex(i => i + 1); setActivePlayerIdx(0); setShowStrokes(false); setShowHoleStats(false) }}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-400 font-medium text-sm hover:border-masters-green hover:text-masters-green transition-all"
            >
              Next →
            </button>
          ) : (
            <Button variant="primary" size="sm" className="flex-1" onClick={handleFinish} disabled={!allComplete || finishing}>
              {finishing ? 'Finishing…' : allComplete ? 'Finish Round ✓' : `${game.totalHoles - totalScoredHoles} left`}
            </Button>
          )}
        </div>

        {/* Running totals */}
        {totalScoredHoles > 0 && (
          <div className="flex items-center justify-center gap-4 py-2 bg-white rounded-xl border border-gray-100">
            {players.map((p, i) => (
              <div key={p.id} className="flex items-center gap-1.5">
                {players.length > 1 && <span className="text-xs">{PLAYER_EMOJIS[i]}</span>}
                <span className="text-base">😊</span>
                <span className="font-bold text-happy-dark text-sm">{p.happyCount}</span>
                <span className="text-base">😔</span>
                <span className="font-bold text-sad-dark text-sm">{p.sadCount}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PlayGame() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center flex-1"><div className="text-gray-400 animate-pulse text-sm">Loading…</div></div>}>
      <PlayGameInner />
    </Suspense>
  )
}
