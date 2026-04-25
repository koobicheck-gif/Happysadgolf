import { Game, GameResult, Hole, Player } from '@/types'
import { DEFAULT_PARS_18, DEFAULT_PARS_9 } from './defaultPars'

export function calculateResult(holes: Hole[]): GameResult {
  const scored = holes.filter(h => h.emoji !== null)
  if (scored.length === 0) return 'in-progress'
  const happy = scored.filter(h => h.emoji === 'happy').length
  const sad = scored.filter(h => h.emoji === 'sad').length
  if (happy > sad) return 'happy'
  if (sad > happy) return 'sad'
  return 'tie'
}

export function countEmojis(holes: Hole[]): { happyCount: number; sadCount: number } {
  const scored = holes.filter(h => h.emoji !== null)
  return {
    happyCount: scored.filter(h => h.emoji === 'happy').length,
    sadCount: scored.filter(h => h.emoji === 'sad').length,
  }
}

export function isGameComplete(game: Game): boolean {
  if (game.players && game.players.length > 0) {
    return game.players.every(p => p.holes.every(h => h.emoji !== null))
  }
  return game.holes.every(h => h.emoji !== null)
}

export function getTotalStrokes(holes: Hole[]): number | undefined {
  const withStrokes = holes.filter(h => h.strokes != null)
  if (withStrokes.length === 0) return undefined
  return withStrokes.reduce((sum, h) => sum + (h.strokes ?? 0), 0)
}

export function buildDefaultHoles(totalHoles: 9 | 18, pars?: number[]): Hole[] {
  const defaultPars = totalHoles === 18 ? DEFAULT_PARS_18 : DEFAULT_PARS_9
  const usePars = pars?.slice(0, totalHoles) ?? defaultPars
  return usePars.map((par, i) => ({ number: i + 1, par, emoji: null }))
}

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function getScoreRelativeToPar(strokes: number, par: number): string {
  const diff = strokes - par
  if (diff <= -2) return 'Eagle'
  if (diff === -1) return 'Birdie'
  if (diff === 0) return 'Par'
  if (diff === 1) return 'Bogey'
  if (diff === 2) return 'Double'
  return `+${diff}`
}

/** Returns all players including solo (wraps holes into Player shape) */
export function getPlayers(game: Game): Player[] {
  if (game.players && game.players.length > 0) return game.players
  return [{
    id: 'p0',
    name: 'Me',
    holes: game.holes,
    happyCount: game.happyCount,
    sadCount: game.sadCount,
    totalStrokes: game.totalStrokes,
    result: game.result,
  }]
}

export function updatePlayerInGame(game: Game, playerIndex: number, updatedHoles: Hole[]): Game {
  const players = getPlayers(game)
  const { happyCount, sadCount } = countEmojis(updatedHoles)
  const result = updatedHoles.every(h => h.emoji !== null) ? calculateResult(updatedHoles) : 'in-progress'
  const totalStrokes = getTotalStrokes(updatedHoles)

  const updatedPlayers = players.map((p, i) =>
    i === playerIndex ? { ...p, holes: updatedHoles, happyCount, sadCount, result, totalStrokes } : p
  )

  // Primary player drives the top-level fields
  const primary = updatedPlayers[0]
  const allComplete = updatedPlayers.every(p => p.result !== 'in-progress')

  return {
    ...game,
    players: updatedPlayers,
    holes: updatedPlayers[0].holes,
    happyCount: primary.happyCount,
    sadCount: primary.sadCount,
    result: allComplete ? primary.result : 'in-progress',
    totalStrokes: primary.totalStrokes,
  }
}
