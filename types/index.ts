export type EmojiResult = 'happy' | 'sad' | null

export interface Hole {
  number: number
  par: number
  strokes?: number
  emoji: EmojiResult
  putts?: number
  fairwayHit?: boolean | null // null = par 3, N/A
  gir?: boolean
  club?: string
}

export type GameResult = 'happy' | 'sad' | 'tie' | 'in-progress'

export interface Player {
  id: string
  name: string
  holes: Hole[]
  happyCount: number
  sadCount: number
  totalStrokes?: number
  result: GameResult
  handicapDifferential?: number
}

export interface Game {
  id: string
  date: string
  courseName: string
  courseRating?: number   // e.g. 72.1 — for handicap
  slopeRating?: number    // e.g. 113
  holes: Hole[]           // primary / solo player (backwards compat)
  players?: Player[]      // multi-player (index 0 mirrors holes)
  totalHoles: 9 | 18
  result: GameResult
  happyCount: number
  sadCount: number
  totalStrokes?: number
  completedAt?: string
  handicapDifferential?: number
}
