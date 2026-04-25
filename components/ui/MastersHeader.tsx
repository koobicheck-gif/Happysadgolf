'use client'
import Link from 'next/link'

interface MastersHeaderProps {
  title?: string
  showBack?: boolean
  backHref?: string
  rightElement?: React.ReactNode
}

export default function MastersHeader({
  title = 'Happy Sad Golf',
  showBack = false,
  backHref = '/',
  rightElement,
}: MastersHeaderProps) {
  return (
    <header className="bg-masters-green text-white shadow-lg">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <Link href={backHref} className="text-masters-gold hover:text-white transition-colors p-1 -ml-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xl">⛳</span>
            <span className="font-serif font-bold text-lg tracking-wide text-masters-gold">{title}</span>
          </div>
        </div>
        {rightElement && <div>{rightElement}</div>}
      </div>
      <div className="h-0.5 bg-masters-gold opacity-60" />
    </header>
  )
}
