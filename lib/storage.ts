import { Game } from '@/types'

const GAMES_KEY = 'hsg_games'
const CURRENT_GAME_KEY = 'hsg_current'

export function getGames(): Game[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(GAMES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveGame(game: Game): void {
  if (typeof window === 'undefined') return
  const games = getGames()
  const idx = games.findIndex(g => g.id === game.id)
  if (idx >= 0) {
    games[idx] = game
  } else {
    games.push(game)
  }
  localStorage.setItem(GAMES_KEY, JSON.stringify(games))
}

export function getGameById(id: string): Game | null {
  return getGames().find(g => g.id === id) ?? null
}

export function deleteGame(id: string): void {
  if (typeof window === 'undefined') return
  const games = getGames().filter(g => g.id !== id)
  localStorage.setItem(GAMES_KEY, JSON.stringify(games))
}

export function setCurrentGameId(id: string | null): void {
  if (typeof window === 'undefined') return
  if (id === null) {
    localStorage.removeItem(CURRENT_GAME_KEY)
  } else {
    localStorage.setItem(CURRENT_GAME_KEY, id)
  }
}

export function getCurrentGameId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(CURRENT_GAME_KEY)
}
