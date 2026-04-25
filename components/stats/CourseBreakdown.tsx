'use client'
import { Game } from '@/types'
import Badge from '@/components/ui/Badge'

interface CourseBreakdownProps {
  games: Game[]
}

export default function CourseBreakdown({ games }: CourseBreakdownProps) {
  const completed = games.filter(g => g.result !== 'in-progress')
  if (completed.length === 0) return (
    <div className="text-center text-gray-300 text-sm py-4">No rounds yet</div>
  )

  const courseMap = new Map<string, { happy: number; sad: number; tie: number; rounds: number }>()
  for (const g of completed) {
    const existing = courseMap.get(g.courseName) ?? { happy: 0, sad: 0, tie: 0, rounds: 0 }
    existing.rounds++
    if (g.result === 'happy') existing.happy++
    else if (g.result === 'sad') existing.sad++
    else existing.tie++
    courseMap.set(g.courseName, existing)
  }

  const courses = [...courseMap.entries()]
    .map(([name, s]) => ({ name, ...s, rate: s.happy / s.rounds }))
    .sort((a, b) => b.rate - a.rate)

  return (
    <div className="space-y-2">
      {courses.map(c => (
        <div key={c.name} className="bg-white rounded-2xl p-3 border border-gray-100 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-masters-dark text-sm truncate">{c.name}</div>
            <div className="text-xs text-gray-400 mt-0.5">
              {c.rounds} round{c.rounds !== 1 ? 's' : ''} · {c.happy}😊 {c.sad}😔{c.tie > 0 ? ` ${c.tie}😐` : ''}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className={`text-sm font-bold ${c.rate >= 0.5 ? 'text-happy-dark' : 'text-sad-dark'}`}>
              {Math.round(c.rate * 100)}%
            </div>
            <div className="text-[10px] text-gray-300">happy</div>
          </div>
        </div>
      ))}
    </div>
  )
}
