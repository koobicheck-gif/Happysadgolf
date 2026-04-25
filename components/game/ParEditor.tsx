'use client'
import { motion } from 'framer-motion'

interface ParEditorProps {
  pars: number[]
  onChange: (pars: number[]) => void
}

export default function ParEditor({ pars, onChange }: ParEditorProps) {
  const setPar = (index: number, val: number) => {
    const next = [...pars]
    next[index] = Math.max(3, Math.min(6, val))
    onChange(next)
  }

  const totalPar = pars.reduce((a, b) => a + b, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-masters-green uppercase tracking-widest">Par per Hole</span>
        <span className="text-xs font-bold text-masters-gold bg-masters-dark px-2.5 py-1 rounded-full">
          Total Par {totalPar}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {pars.map((par, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
            className="bg-gray-50 rounded-xl p-2 border border-gray-100"
          >
            <div className="text-[10px] text-gray-400 font-semibold text-center mb-1.5">
              HOLE {i + 1}
            </div>
            <div className="flex items-center justify-between gap-1">
              <button
                onClick={() => setPar(i, par - 1)}
                disabled={par <= 3}
                className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-500 font-bold text-sm flex items-center justify-center hover:bg-gray-100 active:scale-90 transition-all disabled:opacity-30"
              >
                −
              </button>
              <span className="font-bold text-masters-dark text-base min-w-[16px] text-center">{par}</span>
              <button
                onClick={() => setPar(i, par + 1)}
                disabled={par >= 6}
                className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-500 font-bold text-sm flex items-center justify-center hover:bg-gray-100 active:scale-90 transition-all disabled:opacity-30"
              >
                +
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
