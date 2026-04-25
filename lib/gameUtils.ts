import { Game, GameResult, Hole } from '@/types'
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
  return game.holes.every(h => h.emoji !== null)
}

export function getTotalStrokes(holes: Hole[]): number | undefined {
  const withStrokes = holes.filter(h => h.strokes != null)
  if (withStrokes.length === 0) return undefined
  return withStrokes.reduce((sum, h) => sum + (h.strokes ?? 0), 0)
}

export function buildDefaultHoles(totalHoles: 9 | 18): Hole[] {
  const pars = totalHoles === 18 ? DEFAULT_PARS_18 : DEFAULT_PARS_9
  return pars.map((par, i) => ({ number: i + 1, par, emoji: null }))
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
