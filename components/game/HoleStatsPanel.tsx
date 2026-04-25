'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Hole } from '@/types'

const CLUBS = ['Driver', '3W', '5W', 'Hybrid', '4i', '5i', '6i', '7i', '8i', '9i', 'PW', 'GW', 'SW', 'LW']

interface HoleStatsPanelProps {
  hole: Hole
  onChange: (updates: Partial<Hole>) => void
}

export default function HoleStatsPanel({ hole, onChange }: HoleStatsPanelProps) {
  const isPar3 = hole.par === 3

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
      {/* Putts */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-masters-dark uppercase tracking-wide">Putts</label>
          {hole.putts != null && (
            <button onClick={() => onChange({ putts: undefined })} className="text-[10px] text-gray-300 underline">Clear</button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {[1, 2, 3, 4].map(n => (
            <motion.button
              key={n}
              whileTap={{ scale: 0.88 }}
              onClick={() => onChange({ putts: hole.putts === n ? undefined : n })}
              className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                hole.putts === n
                  ? 'bg-masters-green text-white border-masters-green'
                  : 'bg-gray-50 text-gray-400 border-gray-100'
              }`}
            >
              {n}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Fairway Hit (not on par 3) */}
      {!isPar3 && (
        <div>
          <label className="text-xs font-bold text-masters-dark uppercase tracking-wide block mb-2">Fairway</label>
          <div className="flex gap-2">
            {[{ label: '✓ Hit', val: true }, { label: '✗ Miss', val: false }].map(opt => (
              <motion.button
                key={String(opt.val)}
                whileTap={{ scale: 0.92 }}
                onClick={() => onChange({ fairwayHit: hole.fairwayHit === opt.val ? null : opt.val })}
                className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                  hole.fairwayHit === opt.val
                    ? opt.val ? 'bg-happy text-white border-happy' : 'bg-sad text-white border-sad'
                    : 'bg-gray-50 text-gray-400 border-gray-100'
                }`}
              >
                {opt.label}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* GIR */}
      <div>
        <label className="text-xs font-bold text-masters-dark uppercase tracking-wide block mb-2">Green in Regulation</label>
        <div className="flex gap-2">
          {[{ label: '✓ GIR', val: true }, { label: '✗ Missed', val: false }].map(opt => (
            <motion.button
              key={String(opt.val)}
              whileTap={{ scale: 0.92 }}
              onClick={() => onChange({ gir: hole.gir === opt.val ? undefined : opt.val })}
              className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                hole.gir === opt.val
                  ? opt.val ? 'bg-happy text-white border-happy' : 'bg-sad text-white border-sad'
                  : 'bg-gray-50 text-gray-400 border-gray-100'
              }`}
            >
              {opt.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Club */}
      <div>
        <label className="text-xs font-bold text-masters-dark uppercase tracking-wide block mb-2">Club Used</label>
        <div className="flex flex-wrap gap-1.5">
          {CLUBS.map(club => (
            <motion.button
              key={club}
              whileTap={{ scale: 0.88 }}
              onClick={() => onChange({ club: hole.club === club ? undefined : club })}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                hole.club === club
                  ? 'bg-masters-green text-white border-masters-green'
                  : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-masters-green'
              }`}
            >
              {club}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
