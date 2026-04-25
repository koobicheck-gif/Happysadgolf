'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Game } from '@/types'
import { getGameById } from '@/lib/storage'
import { getPlayers } from '@/lib/gameUtils'
import { format } from 'date-fns'
import MastersHeader from '@/components/ui/MastersHeader'
import ScoreCard from '@/components/game/ScoreCard'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

const PLAYER_EMOJIS = ['🟢', '🔵', '🟡', '🔴']

function buildShareText(game: Game): string {
  const players = getPlayers(game)
  const dateStr = format(new Date(game.date), 'MMM d, yyyy')
  const resultEmoji = game.result === 'happy' ? '😊' : game.result === 'sad' ? '😔' : '😐'

  let text = `${resultEmoji} ${game.result === 'happy' ? 'Happy' : game.result === 'sad' ? 'Sad' : 'Tied'} Game!\n`
  text += `⛳ ${game.courseName} · ${dateStr}\n\n`

  for (const p of players) {
    if (players.length > 1) text += `${p.name}: `
    text += `😊 ${p.happyCount}  😔 ${p.sadCount}`
    if (p.totalStrokes) text += `  🏌️ ${p.totalStrokes}`
    text += '\n'
  }

  text += '\n'
  // Emoji strip
  text += players[0].holes.map(h => h.emoji === 'happy' ? '😊' : h.emoji === 'sad' ? '😔' : '⬜').join('')
  text += '\n\n#HappySadGolf'
  return text
}

function ScorecardInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id') ?? ''
  const [game, setGame] = useState<Game | null>(null)
  const [shared, setShared] = useState(false)
  const [activePlayer, setActivePlayer] = useState(0)

  useEffect(() => {
    if (!id) { router.replace('/'); return }
    const g = getGameById(id)
    if (!g) { router.replace('/'); return }
    setGame(g)
  }, [id, router])

  if (!game) {
    return <div className="flex items-center justify-center flex-1"><div className="text-gray-400 animate-pulse text-sm">Loading…</div></div>
  }

  const players = getPlayers(game)
  const displayPlayer = players[activePlayer]
  const dateLabel = (() => { try { return format(new Date(game.date), 'EEEE, MMMM d, yyyy') } catch { return game.date } })()
  const isHappy = game.result === 'happy'
  const isSad = game.result === 'sad'

  const handleShare = async () => {
    const text = buildShareText(game)
    try {
      if (navigator.share) {
        await navigator.share({ title: `Happy Sad Golf — ${game.courseName}`, text })
      } else {
        await navigator.clipboard.writeText(text)
        setShared(true)
        setTimeout(() => setShared(false), 2500)
      }
    } catch { /* user cancelled */ }
  }

  return (
    <div className="flex flex-col flex-1">
      <MastersHeader title="Scorecard" showBack backHref="/" />

      <div className="flex-1 px-4 py-5 space-y-4 overflow-auto pb-10">

        {/* Result hero */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={`rounded-3xl p-6 text-center shadow-lg ${isHappy ? 'bg-gradient-to-br from-happy to-green-700' : isSad ? 'bg-gradient-to-br from-sad to-red-800' : 'bg-gradient-to-br from-gray-500 to-gray-700'} text-white`}>
          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }} className="text-7xl mb-3">
            {isHappy ? '😊' : isSad ? '😔' : '😐'}
          </motion.div>
          <h1 className="font-serif font-bold text-2xl mb-1">{isHappy ? 'Happy Game!' : isSad ? 'Sad Game' : "It's a Tie"}</h1>
          <p className="text-white text-opacity-80 text-sm mb-2">{game.courseName}</p>
          <p className="text-xs text-white text-opacity-60">{dateLabel}</p>
          {game.handicapDifferential != null && (
            <div className="mt-3 inline-block bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-bold text-masters-gold">
              Differential: {game.handicapDifferential > 0 ? '+' : ''}{game.handicapDifferential}
            </div>
          )}
        </motion.div>

        {/* Share button */}
        <button onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm text-sm font-bold text-masters-dark hover:bg-masters-green-light hover:border-masters-green transition-all active:scale-98">
          <span className="text-lg">{shared ? '✓' : '📤'}</span>
          <span>{shared ? 'Copied to clipboard!' : 'Share Scorecard'}</span>
        </button>

        {/* Player tabs (multi-player) */}
        {players.length > 1 && (
          <div className="flex gap-1.5">
            {players.map((p, i) => (
              <button key={p.id} onClick={() => setActivePlayer(i)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${activePlayer === i ? 'bg-masters-green text-white border-transparent' : 'bg-white text-gray-400 border-gray-100'}`}>
                <span>{PLAYER_EMOJIS[i]}</span>
                <span className="truncate max-w-[60px]">{p.name}</span>
                <Badge result={p.result} size="sm" />
              </button>
            ))}
          </div>
        )}

        {/* Summary stats for active player */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <div className="text-3xl mb-1">😊</div>
            <div className="text-2xl font-bold text-happy-dark">{displayPlayer.happyCount}</div>
            <div className="text-xs text-gray-400">Happy</div>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <div className="text-3xl mb-1">😔</div>
            <div className="text-2xl font-bold text-sad-dark">{displayPlayer.sadCount}</div>
            <div className="text-xs text-gray-400">Sad</div>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <div className="text-3xl mb-1">⛳</div>
            <div className="text-2xl font-bold text-masters-dark">{displayPlayer.totalStrokes ?? '—'}</div>
            <div className="text-xs text-gray-400">Strokes</div>
          </div>
        </div>

        {/* Per-hole stats summary (putts, FIR, GIR) if any were tracked */}
        {(() => {
          const h = displayPlayer.holes
          const puttsTotal = h.reduce((s, hole) => s + (hole.putts ?? 0), 0)
          const firHoles = h.filter(hole => hole.fairwayHit != null)
          const firHit = firHoles.filter(hole => hole.fairwayHit).length
          const girHoles = h.filter(hole => hole.gir != null)
          const girHit = girHoles.filter(hole => hole.gir).length
          if (puttsTotal === 0 && firHoles.length === 0 && girHoles.length === 0) return null
          return (
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="text-xs font-bold text-masters-green uppercase tracking-widest mb-3">Shot Stats</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {puttsTotal > 0 && (
                  <div><div className="text-xl font-bold text-masters-dark">{puttsTotal}</div><div className="text-xs text-gray-400">Total Putts</div></div>
                )}
                {firHoles.length > 0 && (
                  <div><div className="text-xl font-bold text-masters-dark">{firHit}/{firHoles.length}</div><div className="text-xs text-gray-400">Fairways</div></div>
                )}
                {girHoles.length > 0 && (
                  <div><div className="text-xl font-bold text-masters-dark">{girHit}/{girHoles.length}</div><div className="text-xs text-gray-400">GIR</div></div>
                )}
              </div>
            </div>
          )
        })()}

        {/* Scorecard table */}
        <div>
          <h2 className="text-sm font-bold text-masters-green uppercase tracking-widest mb-3 px-1">Hole by Hole</h2>
          <ScoreCard holes={displayPlayer.holes} />
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Link href="/game/new"><Button fullWidth size="lg">Start New Round</Button></Link>
          <Link href="/"><Button fullWidth variant="ghost" size="md">Back to Dashboard</Button></Link>
        </div>
      </div>
    </div>
  )
}

export default function Scorecard() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center flex-1"><div className="text-gray-400 animate-pulse text-sm">Loading…</div></div>}>
      <ScorecardInner />
    </Suspense>
  )
}
