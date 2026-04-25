'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CourseData, searchCourses } from '@/lib/courses'

interface CourseSearchProps {
  value: string
  onChange: (value: string) => void
  onCourseSelect: (course: CourseData) => void
}

export default function CourseSearch({ value, onChange, onCourseSelect }: CourseSearchProps) {
  const [results, setResults] = useState<CourseData[]>([])
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hits = searchCourses(value)
    setResults(hits)
    setOpen(hits.length > 0)
  }, [value])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSelect = (course: CourseData) => {
    onChange(course.name)
    onCourseSelect(course)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Search courses or type your own…"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-base text-masters-dark placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-masters-green focus:border-transparent transition"
          autoFocus
          autoComplete="off"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 text-lg">⛳</span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {results.map(course => (
              <li key={course.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(course)}
                  className="w-full text-left px-4 py-3 hover:bg-masters-green-light transition-colors border-b border-gray-50 last:border-0"
                >
                  <div className="font-semibold text-masters-dark text-sm leading-snug">{course.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{course.location}</span>
                    <span className="text-xs text-masters-gold font-bold">Par {course.totalPar}</span>
                  </div>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
