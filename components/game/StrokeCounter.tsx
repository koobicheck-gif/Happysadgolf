'use client'
import { motion, AnimatePresence } from 'framer-motion'

interface StrokeCounterProps {
  strokes: number | undefined
  par: number
  onChange: (val: number | undefined) => void
}

export default function StrokeCounter({ strokes, par, onChange }: StrokeCounterProps) {
  const value = strokes ?? par

  const diff = strokes != null ? strokes - par : null
  let diffLabel = ''
  let diffColor = 'text-gray-400'
  if (diff !== null) {
    if (diff < 0) { diffLabel = diff === -1 ? 'Birdie' : 'Eagle'; diffColor = 'text-happy-dark' }
    else if (diff === 0) { diffLabel = 'Par'; diffColor = 'text-masters-green' }
    else if (diff === 1) { diffLabel = 'Bogey'; diffColor = 'text-orange-600' }
    else { diffLabel = `+${diff}`; diffColor = 'text-sad-dark' }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-500">Strokes (optional)</span>
        {diff !== null && (
          <span className={`text-sm font-bold ${diffColor}`}>{diffLabel}</span>
        )}
      </div>
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => onChange(Math.max(1, value - 1))}
          className="w-11 h-11 rounded-full bg-gray-100 text-gray-700 text-2xl font-bold flex items-center justify-center hover:bg-gray-200 active:scale-90 transition-all"
        >
          −
        </button>
        <div className="text-center min-w-[60px]">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={value}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="block text-3xl font-bold text-masters-dark"
            >
              {strokes != null ? strokes : <span className="text-gray-300">{par}</span>}
            </motion.span>
          </AnimatePresence>
          <span className="text-xs text-gray-400">par {par}</span>
        </div>
        <button
          onClick={() => onChange(value + 1)}
          className="w-11 h-11 rounded-full bg-gray-100 text-gray-700 text-2xl font-bold flex items-center justify-center hover:bg-gray-200 active:scale-90 transition-all"
        >
          +
        </button>
      </div>
      {strokes != null && (
        <button
          onClick={() => onChange(undefined)}
          className="mt-2 w-full text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
        >
          Clear strokes
        </button>
      )}
    </div>
  )
}
