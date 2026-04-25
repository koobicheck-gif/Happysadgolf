'use client'
import { Hole } from '@/types'

interface ScoreCardProps {
  holes: Hole[]
}

export default function ScoreCard({ holes }: ScoreCardProps) {
  const half = Math.ceil(holes.length / 2)
  const front = holes.slice(0, half)
  const back = holes.slice(half)

  const frontHappy = front.filter(h => h.emoji === 'happy').length
  const frontSad = front.filter(h => h.emoji === 'sad').length
  const backHappy = back.filter(h => h.emoji === 'happy').length
  const backSad = back.filter(h => h.emoji === 'sad').length

  const renderSection = (sectionHoles: Hole[], label: string) => (
    <div className="mb-4">
      <div className="bg-masters-green text-white text-xs font-bold px-3 py-1.5 rounded-t-xl flex items-center gap-2">
        <span>{label}</span>
      </div>
      <div className="border border-gray-100 rounded-b-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-masters-cream text-masters-dark text-xs font-semibold">
              <th className="py-2 px-2 text-left">Hole</th>
              <th className="py-2 px-2 text-center">Par</th>
              <th className="py-2 px-2 text-center">Mood</th>
              <th className="py-2 px-2 text-center">Score</th>
            </tr>
          </thead>
          <tbody>
            {sectionHoles.map((hole, i) => {
              const diff = hole.strokes != null ? hole.strokes - hole.par : null
              return (
                <tr key={hole.number} className={`border-t border-gray-50 ${i % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}>
                  <td className="py-2.5 px-2 font-semibold text-masters-dark">{hole.number}</td>
                  <td className="py-2.5 px-2 text-center text-gray-500">{hole.par}</td>
                  <td className="py-2.5 px-2 text-center text-xl">
                    {hole.emoji === 'happy' ? '😊' : hole.emoji === 'sad' ? '😔' : <span className="text-gray-200">—</span>}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {hole.strokes != null ? (
                      <span className={`font-bold ${diff! < 0 ? 'text-happy-dark' : diff === 0 ? 'text-masters-green' : diff! === 1 ? 'text-orange-600' : 'text-sad-dark'}`}>
                        {hole.strokes}
                      </span>
                    ) : (
                      <span className="text-gray-200">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div>
      {renderSection(front, holes.length === 18 ? 'Front 9' : `Holes 1–${holes.length}`)}
      {holes.length === 18 && renderSection(back, 'Back 9')}
    </div>
  )
}
