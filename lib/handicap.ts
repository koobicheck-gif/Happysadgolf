import { Game } from '@/types'

/** USGA handicap differential for one round */
export function calcDifferential(
  grossScore: number,
  courseRating: number,
  slopeRating: number,
): number {
  return Math.round(((grossScore - courseRating) * 113) / slopeRating * 10) / 10
}

/** Handicap index from an array of differentials (best 8 of last 20) */
export function calcHandicapIndex(differentials: number[]): number | null {
  if (differentials.length < 3) return null
  const sorted = [...differentials].sort((a, b) => a - b)
  const take = differentials.length <= 6 ? 1
    : differentials.length <= 8 ? 2
    : differentials.length <= 11 ? 3
    : differentials.length <= 14 ? 4
    : differentials.length <= 16 ? 5
    : differentials.length <= 18 ? 6
    : 8
  const best = sorted.slice(0, take)
  const avg = best.reduce((a, b) => a + b, 0) / best.length
  return Math.round(avg * 0.96 * 10) / 10
}

/** Extract all valid differentials from game history */
export function getDifferentials(games: Game[]): number[] {
  return games
    .filter(g => g.handicapDifferential != null)
    .slice(-20)
    .map(g => g.handicapDifferential!)
}

/** Compute and attach differential to a completed game if data is present */
export function attachDifferential(game: Game): Game {
  if (
    game.totalStrokes == null ||
    game.courseRating == null ||
    game.slopeRating == null
  ) return game
  const diff = calcDifferential(game.totalStrokes, game.courseRating, game.slopeRating)
  return { ...game, handicapDifferential: diff }
}
