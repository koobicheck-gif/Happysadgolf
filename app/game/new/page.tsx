'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import MastersHeader from '@/components/ui/MastersHeader'
import Button from '@/components/ui/Button'
import { buildDefaultHoles, generateId } from '@/lib/gameUtils'
import { saveGame, setCurrentGameId } from '@/lib/storage'
import { Game } from '@/types'

export default function NewGame() {
  const router = useRouter()
  const [courseName, setCourseName] = useState('')
  const [totalHoles, setTotalHoles] = useState<9 | 18>(18)
  const [submitting, setSubmitting] = useState(false)

  const handleStart = () => {
    if (!courseName.trim()) return
    setSubmitting(true)

    const id = generateId()
    const holes = buildDefaultHoles(totalHoles)
    const game: Game = {
      id,
      date: new Date().toISOString(),
      courseName: courseName.trim(),
      holes,
      totalHoles,
      result: 'in-progress',
      happyCount: 0,
      sadCount: 0,
    }

    saveGame(game)
    setCurrentGameId(id)
    router.push(`/play?id=${id}`)
  }

  return (
    <div className="flex flex-col flex-1">
      <MastersHeader title="New Round" showBack backHref="/" />

      <div className="flex-1 px-5 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Hero */}
          <div className="text-center py-4">
            <div className="text-5xl mb-3">⛳</div>
            <h1 className="font-serif font-bold text-masters-dark text-2xl">Start Your Round</h1>
            <p className="text-gray-400 text-sm mt-1">Track every hole with happy or sad faces</p>
          </div>

          {/* Course Name */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <label className="block text-sm font-bold text-masters-dark mb-2">
              Course Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={courseName}
              onChange={e => setCourseName(e.target.value)}
              placeholder="e.g. Augusta National"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-masters-dark placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-masters-green focus:border-transparent transition"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleStart()}
            />
          </div>

          {/* Holes Toggle */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <label className="block text-sm font-bold text-masters-dark mb-3">Number of Holes</label>
            <div className="grid grid-cols-2 gap-3">
              {([9, 18] as const).map(n => (
                <motion.button
                  key={n}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setTotalHoles(n)}
                  className={`
                    py-4 rounded-xl font-bold text-lg border-2 transition-all
                    ${totalHoles === n
                      ? 'bg-masters-green text-white border-masters-green shadow-md'
                      : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-masters-green hover:text-masters-green'
                    }
                  `}
                >
                  {n} Holes
                </motion.button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-masters-green-light rounded-2xl p-4 border border-masters-green border-opacity-20">
            <p className="text-sm text-masters-green font-medium text-center">
              {totalHoles} holes · Rate each hole 😊 or 😔 · Score cards are optional
            </p>
          </div>

          <Button
            fullWidth
            size="lg"
            onClick={handleStart}
            disabled={!courseName.trim() || submitting}
            className="mt-2"
          >
            {submitting ? 'Starting...' : 'Tee Off →'}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
