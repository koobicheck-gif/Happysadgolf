'use client'
import { Game } from '@/types'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts'
import { format } from 'date-fns'

interface TrendChartProps {
  games: Game[]
}

export default function TrendChart({ games }: TrendChartProps) {
  const completed = games.filter(g => g.result !== 'in-progress').slice(-20)
  if (completed.length < 2) return (
    <div className="flex items-center justify-center h-32 text-gray-300 text-sm">
      Play at least 2 rounds to see your trend
    </div>
  )

  const data = completed.map((g, i) => {
    const scored = g.holes.filter(h => h.emoji !== null).length || 1
    return {
      name: format(new Date(g.date), 'M/d'),
      happy: Math.round((g.happyCount / scored) * 100),
      result: g.result,
      index: i + 1,
    }
  })

  return (
    <ResponsiveContainer width="100%" height={140}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} tickFormatter={v => `${v}%`} />
        <ReferenceLine y={50} stroke="#C9A84C" strokeDasharray="4 2" strokeWidth={1.5} />
        <Tooltip
          formatter={(v) => [`${v}%`, 'Happy rate']}
          contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
        />
        <Line
          type="monotone"
          dataKey="happy"
          stroke="#006747"
          strokeWidth={2.5}
          dot={(props) => {
            const { cx, cy, payload } = props
            const color = payload.result === 'happy' ? '#16a34a' : payload.result === 'sad' ? '#dc2626' : '#6b7280'
            return <circle key={`dot-${payload.index}`} cx={cx} cy={cy} r={4} fill={color} stroke="white" strokeWidth={1.5} />
          }}
          activeDot={{ r: 6, stroke: '#006747', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
