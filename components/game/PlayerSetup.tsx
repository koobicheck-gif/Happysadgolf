'use client'
import { motion, AnimatePresence } from 'framer-motion'

interface PlayerSetupProps {
  players: string[]
  onChange: (players: string[]) => void
}

const COLORS = ['🟢', '🔵', '🟡', '🔴']

export default function PlayerSetup({ players, onChange }: PlayerSetupProps) {
  const addPlayer = () => {
    if (players.length >= 4) return
    onChange([...players, `Player ${players.length + 1}`])
  }

  const removePlayer = (i: number) => {
    if (i === 0) return // can't remove primary
    onChange(players.filter((_, idx) => idx !== i))
  }

  const updateName = (i: number, name: string) => {
    const next = [...players]
    next[i] = name
    onChange(next)
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {players.map((name, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-2"
          >
            <span className="text-lg w-7 text-center">{COLORS[i]}</span>
            <input
              type="text"
              value={name}
              onChange={e => updateName(i, e.target.value)}
              placeholder={`Player ${i + 1}`}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-masters-dark placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-masters-green transition"
            />
            {i > 0 && (
              <button
                onClick={() => removePlayer(i)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-lg transition-colors"
              >
                ×
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {players.length < 4 && (
        <button
          onClick={addPlayer}
          className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-masters-green hover:text-masters-green transition-colors"
        >
          <span className="text-lg">+</span>
          Add Player
        </button>
      )}
    </div>
  )
}
