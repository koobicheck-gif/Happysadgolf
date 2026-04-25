'use client'
import { Game } from '@/types'

interface HoleHeatmapProps {
  games: Game[]
  totalHoles?: 9 | 18
}

export default function HoleHeatmap({ games, totalHoles = 18 }: HoleHeatmapProps) {
  const completed = games.filter(g => g.result !== 'in-progress')
  if (completed.length === 0) return (
    <div className="text-center text-gray-300 text-sm py-4">No data yet</div>
  )

  const holeSummary = Array.from({ length: totalHoles }, (_, i) => {
    const num = i + 1
    let happy = 0, sad = 0
    for (const game of completed) {
      const hole = game.holes.find(h => h.number === num)
      if (!hole || hole.emoji === null) continue
      if (hole.emoji === 'happy') happy++
      else sad++
    }
    const total = happy + sad
    const rate = total > 0 ? happy / total : null
    return { num, happy, sad, total, rate }
  })

  return (
    <div className="grid grid-cols-9 gap-1">
      {holeSummary.map(h => {
        const bg = h.rate === null ? 'bg-gray-100'
          : h.rate >= 0.6 ? 'bg-happy'
          : h.rate >= 0.45 ? 'bg-masters-gold'
          : 'bg-sad'
        const text = h.rate === null ? 'text-gray-300'
          : h.rate >= 0.45 ? 'text-white'
          : 'text-white'
        return (
          <div key={h.num} className="flex flex-col items-center gap-0.5">
            <div
              className={`w-full aspect-square rounded-lg ${bg} flex items-center justify-center transition-all`}
              title={h.total > 0 ? `Hole ${h.num}: ${h.happy}😊 ${h.sad}😔` : `Hole ${h.num}: no data`}
            >
              <span className={`text-[10px] font-bold ${text}`}>{h.num}</span>
            </div>
            {h.rate !== null && (
              <span className="text-[9px] text-gray-400 font-medium leading-none">
                {Math.round(h.rate * 100)}%
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
