export type EmojiResult = 'happy' | 'sad' | null

export interface Hole {
  number: number
  par: number
  strokes?: number
  emoji: EmojiResult
}

export type GameResult = 'happy' | 'sad' | 'tie' | 'in-progress'

export interface Game {
  id: string
  date: string
  courseName: string
  holes: Hole[]
  totalHoles: 9 | 18
  result: GameResult
  happyCount: number
  sadCount: number
  totalStrokes?: number
  completedAt?: string
}
