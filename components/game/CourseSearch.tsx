'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CourseData, searchCourses } from '@/lib/courses'
import { searchCoursesApi, fetchCourseDetail, hasApiKey, ApiSearchResult } from '@/lib/courseApi'

interface CourseSearchProps {
  value: string
  onChange: (value: string) => void
  onCourseSelect: (course: CourseData) => void
}

export default function CourseSearch({ value, onChange, onCourseSelect }: CourseSearchProps) {
  const [localResults, setLocalResults] = useState<CourseData[]>([])
  const [apiResults, setApiResults] = useState<ApiSearchResult[]>([])
  const [loadingApi, setLoadingApi] = useState(false)
  const [loadingDetailId, setLoadingDetailId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const hits = searchCourses(value)
    setLocalResults(hits)
    if (hits.length > 0) setOpen(true)
  }, [value])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!value.trim() || !hasApiKey()) {
      setApiResults([])
      setLoadingApi(false)
      return
    }
    setLoadingApi(true)
    debounceRef.current = setTimeout(async () => {
      const results = await searchCoursesApi(value)
      setApiResults(results)
      setLoadingApi(false)
      if (results.length > 0) setOpen(true)
    }, 350)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
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

  const handleSelectLocal = (course: CourseData) => {
    onChange(course.name)
    onCourseSelect(course)
    setOpen(false)
  }

  const handleSelectApi = async (result: ApiSearchResult) => {
    onChange(result.name)
    setOpen(false)
    setLoadingDetailId(result.id)
    const detail = await fetchCourseDetail(result.id)
    setLoadingDetailId(null)
    if (detail) onCourseSelect(detail)
  }

  const localNames = new Set(localResults.map(c => c.name.toLowerCase()))
  const filteredApiResults = apiResults.filter(r => !localNames.has(r.name.toLowerCase()))
  const showDropdown = open && (localResults.length > 0 || filteredApiResults.length > 0 || loadingApi)
  const isBusy = loadingApi || !!loadingDetailId

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={e => { onChange(e.target.value); setOpen(true) }}
          placeholder="Search courses or type your own…"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-base text-masters-dark placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-masters-green focus:border-transparent transition"
          autoComplete="off"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">
          {isBusy
            ? <span className="inline-block w-4 h-4 border-2 border-masters-green border-t-transparent rounded-full animate-spin" />
            : <span className="text-gray-300">⛳</span>
          }
        </span>
      </div>

      {loadingDetailId && (
        <p className="text-xs text-masters-green mt-1 animate-pulse">Loading course pars…</p>
      )}

      <AnimatePresence>
        {showDropdown && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-72 overflow-y-auto"
          >
            {localResults.length > 0 && (
              <>
                <li className="px-4 py-1.5 text-[10px] font-bold text-gray-300 uppercase tracking-wider bg-gray-50 sticky top-0">
                  ⭐ Featured Courses
                </li>
                {localResults.map(course => (
                  <li key={`local-${course.id}`}>
                    <button
                      type="button"
                      onClick={() => handleSelectLocal(course)}
                      className="w-full text-left px-4 py-3 hover:bg-masters-light transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div className="font-semibold text-masters-dark text-sm leading-snug">{course.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{course.location}</span>
                        <span className="text-xs text-masters-gold font-bold">Par {course.totalPar}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </>
            )}

            {loadingApi && (
              <li className="px-4 py-3 text-xs text-gray-400 flex items-center gap-2">
                <span className="inline-block w-3 h-3 border-2 border-masters-green border-t-transparent rounded-full animate-spin" />
                Searching live database…
              </li>
            )}

            {!loadingApi && filteredApiResults.length > 0 && (
              <>
                <li className="px-4 py-1.5 text-[10px] font-bold text-gray-300 uppercase tracking-wider bg-gray-50 sticky top-0">
                  🌐 All Courses
                </li>
                {filteredApiResults.map(result => (
                  <li key={`api-${result.id}`}>
                    <button
                      type="button"
                      onClick={() => handleSelectApi(result)}
                      className="w-full text-left px-4 py-3 hover:bg-masters-light transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div className="font-semibold text-masters-dark text-sm leading-snug">{result.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{result.location}</span>
                        {result.numHoles > 0 && (
                          <span className="text-xs text-gray-300">{result.numHoles} holes</span>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
