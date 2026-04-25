'use client'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Game, Hole, EmojiResult } from '@/types'
import { getGameById, saveGame, setCurrentGameId } from '@/lib/storage'
import { calculateResult, countEmojis, getTotalStrokes } from '@/lib/gameUtils'
import MastersHeader from '@/components/ui/MastersHeader'
import EmojiButton from '@/components/game/EmojiButton'
import HoleNavigator from '@/components/game/HoleNavigator'
import StrokeCounter from '@/components/game/StrokeCounter'
import Button from '@/components/ui/Button'

function PlayGameInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id') ?? ''

  const [game, setGame] = useState<Game | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showStrokes, setShowStrokes] = useState(false)
  const [finishing, setFinishing] = useState(false)
  const [justScored, setJustScored] = useState(false)

  useEffect(() => {
    if (!id) { router.replace('/'); return }
    const g = getGameById(id)
    if (!g) { router.replace('/'); return }
    if (g.result !== 'in-progress') { router.replace(`/scorecard?id=${id}`); return }
    const firstUnscoredIdx = g.holes.findIndex(h => h.emoji === null)
    setCurrentIndex(firstUnscoredIdx >= 0 ? firstUnscoredIdx : 0)
    setGame(g)
  }, [id, router])

  const currentHole = game?.holes[currentIndex]
  const isLastHole = game ? currentIndex === game.holes.length - 1 : false
  const scoredCount = game?.holes.filter(h => h.emoji !== null).length ?? 0
  const allScored = game ? scoredCount === game.holes.length : false

  const updateAndSave = useCallback((updatedHoles: Hole[]) => {
    if (!game) return
    const { happyCount, sadCount } = countEmojis(updatedHoles)
    const result = updatedHoles.every(h => h.emoji !== null) ? calculateResult(updatedHoles) : 'in-progress'
    const updated: Game = {
      ...game,
      holes: updatedHoles,
      happyCount,
      sadCount,
      result,
      totalStrokes: getTotalStrokes(updatedHoles),
    }
    setGame(updated)
    saveGame(updated)
    return updated
  }, [game])

  const handleEmojiSelect = (emoji: EmojiResult) => {
    if (!game || justScored) return
    const updatedHoles = game.holes.map((h, i) =>
      i === currentIndex ? { ...h, emoji } : h
    )
    updateAndSave(updatedHoles)
    setJustScored(true)
    if (!isLastHole) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1)
        setJustScored(false)
        setShowStrokes(false)
      }, 500)
    } else {
      setTimeout(() => setJustScored(false), 500)
    }
  }

  const handleStrokeChange = (strokes: number | undefined) => {
    if (!game) return
    const updatedHoles = game.holes.map((h, i) =>
      i === currentIndex ? { ...h, strokes } : h
    )
    updateAndSave(updatedHoles)
  }

  const handleFinish = () => {
    if (!game || !allScored) return
    setFinishing(true)
    const { happyCount, sadCount } = countEmojis(game.holes)
    const result = calculateResult(game.holes)
    const final: Game = {
      ...game,
      happyCount,
      sadCount,
      result,
      totalStrokes: getTotalStrokes(game.holes),
      completedAt: new Date().toISOString(),
    }
    saveGame(final)
    setCurrentGameId(null)
    router.push(`/scorecard?id=${id}`)
  }

  if (!game || !currentHole) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="text-gray-400 animate-pulse text-sm">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      <MastersHeader
        title={game.courseName}
        showBack
        backHref="/"
        rightElement={
          <span className="text-xs text-masters-gold font-semibold">
            {scoredCount}/{game.totalHoles}
          </span>
        }
      />

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <motion.div
          className="h-full bg-masters-gold"
          animate={{ width: `${(scoredCount / game.totalHoles) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex-1 flex flex-col px-4 pt-4 pb-6 gap-4 overflow-auto">
        {/* Hole header */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-masters-green text-white px-4 py-1.5 rounded-full text-sm font-semibold">
              <span>Hole {currentHole.number}</span>
              <span className="opacity-60">·</span>
              <span>Par {currentHole.par}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Main emoji buttons */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-4 flex-1 max-h-64"
          >
            <EmojiButton
              type="happy"
              selected={currentHole.emoji === 'happy'}
              onSelect={() => handleEmojiSelect('happy')}
            />
            <EmojiButton
              type="sad"
              selected={currentHole.emoji === 'sad'}
              onSelect={() => handleEmojiSelect('sad')}
            />
          </motion.div>
        </AnimatePresence>

        {/* Stroke counter toggle */}
        <div>
          <button
            onClick={() => setShowStrokes(s => !s)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-white rounded-xl border border-gray-100 shadow-sm text-sm text-gray-500 hover:text-masters-green transition-colors"
          >
            <span className="font-medium">⛳ Add stroke count</span>
            <span>{showStrokes ? '▲' : '▼'}</span>
          </button>
          <AnimatePresence>
            {showStrokes && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mt-2"
              >
                <StrokeCounter
                  strokes={currentHole.strokes}
                  par={currentHole.par}
                  onChange={handleStrokeChange}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hole navigator */}
        <HoleNavigator
          holes={game.holes}
          currentIndex={currentIndex}
          onNavigate={i => { setCurrentIndex(i); setShowStrokes(false) }}
        />

        {/* Navigation arrows */}
        <div className="flex gap-3">
          <button
            onClick={() => { setCurrentIndex(i => Math.max(0, i - 1)); setShowStrokes(false) }}
            disabled={currentIndex === 0}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-400 font-medium text-sm hover:border-masters-green hover:text-masters-green disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ← Prev
          </button>
          {!isLastHole ? (
            <button
              onClick={() => { setCurrentIndex(i => i + 1); setShowStrokes(false) }}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-400 font-medium text-sm hover:border-masters-green hover:text-masters-green transition-all"
            >
              Next →
            </button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={handleFinish}
              disabled={!allScored || finishing}
            >
              {finishing ? 'Finishing...' : allScored ? 'Finish Round ✓' : `${game.totalHoles - scoredCount} left`}
            </Button>
          )}
        </div>

        {/* Running totals */}
        {scoredCount > 0 && (
          <div className="flex items-center justify-center gap-4 py-2 bg-white rounded-xl border border-gray-100">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">😊</span>
              <span className="font-bold text-happy-dark">{game.happyCount}</span>
            </div>
            <div className="w-px h-5 bg-gray-200" />
            <div className="flex items-center gap-1.5">
              <span className="text-lg">😔</span>
              <span className="font-bold text-sad-dark">{game.sadCount}</span>
            </div>
            {game.happyCount !== game.sadCount && (
              <>
                <div className="w-px h-5 bg-gray-200" />
                <span className={`text-xs font-bold ${game.happyCount > game.sadCount ? 'text-happy-dark' : 'text-sad-dark'}`}>
                  {game.happyCount > game.sadCount ? 'Winning 😊' : 'Losing 😔'}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PlayGame() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center flex-1">
        <div className="text-gray-400 animate-pulse text-sm">Loading...</div>
      </div>
    }>
      <PlayGameInner />
    </Suspense>
  )
}
