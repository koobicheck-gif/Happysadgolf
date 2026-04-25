'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface BottomNavProps {
  active: 'home' | 'stats'
}

const items = [
  { id: 'home', href: '/', icon: '🏠', label: 'Home' },
  { id: 'new', href: '/game/new', icon: '⛳', label: 'New Round', accent: true },
  { id: 'stats', href: '/stats', icon: '📊', label: 'Stats' },
] as const

export default function BottomNav({ active }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="max-w-md mx-auto">
        <div className="bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center justify-around px-2 pb-safe">
          {items.map(item => {
            const isActive = item.id === active
            if ('accent' in item && item.accent) {
              return (
                <Link key={item.id} href={item.href} className="flex-1 flex justify-center -mt-5">
                  <motion.div
                    whileTap={{ scale: 0.92 }}
                    className="w-14 h-14 rounded-full bg-masters-green flex items-center justify-center shadow-lg border-4 border-masters-cream"
                  >
                    <span className="text-2xl">{item.icon}</span>
                  </motion.div>
                </Link>
              )
            }
            return (
              <Link key={item.id} href={item.href} className="flex-1 flex flex-col items-center gap-0.5 py-3">
                <span className={`text-xl transition-transform ${isActive ? 'scale-110' : ''}`}>{item.icon}</span>
                <span className={`text-[10px] font-semibold transition-colors ${isActive ? 'text-masters-green' : 'text-gray-400'}`}>
                  {item.label}
                </span>
                {isActive && <div className="w-1 h-1 rounded-full bg-masters-gold mt-0.5" />}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
