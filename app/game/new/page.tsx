'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import MastersHeader from '@/components/ui/MastersHeader'
import Button from '@/components/ui/Button'
import CourseSearch from '@/components/game/CourseSearch'
import ParEditor from '@/components/game/ParEditor'
import { CourseData, getCoursePars } from '@/lib/courses'
import { generateId } from '@/lib/gameUtils'
import { saveGame, setCurrentGameId } from '@/lib/storage'
import { Game, Hole } from '@/types'
import { DEFAULT_PARS_18, DEFAULT_PARS_9 } from '@/lib/defaultPars'

export default function NewGame() {
  const router = useRouter()
  const [courseName, setCourseName] = useState('')
  const [totalHoles, setTotalHoles] = useState<9 | 18>(18)
  const [pars, setPars] = useState<number[]>(DEFAULT_PARS_18)
  const [showParEditor, setShowParEditor] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleTotalHolesChange = (n: 9 | 18) => {
    setTotalHoles(n)
    setPars(n === 9 ? DEFAULT_PARS_9 : DEFAULT_PARS_18)
  }

  const handleCourseSelect = (course: CourseData) => {
    const coursePars = getCoursePars(course, totalHoles)
    setPars(coursePars)
    setShowParEditor(true)
  }

  const handleStart = () => {
    if (!courseName.trim()) return
    setSubmitting(true)

    const id = generateId()
    const holes: Hole[] = pars.slice(0, totalHoles).map((par, i) => ({
      number: i + 1,
      par,
      emoji: null,
    }))

    const game: Game = {
      id,
      date: new Date().toISOString(),
      courseName: courseName.trim(),
      holes,
      totalHoles,
      result: 'in-progress',
      happyCount: 0,
      sadCount: 0,
    }

    saveGame(game)
    setCurrentGameId(id)
    router.push(`/play?id=${id}`)
  }

  const totalPar = pars.slice(0, totalHoles).reduce((a, b) => a + b, 0)

  return (
    <div className="flex flex-col flex-1">
      <MastersHeader title="New Round" showBack backHref="/" />

      <div className="flex-1 px-5 py-6 overflow-auto pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          {/* Hero */}
          <div className="text-center py-3">
            <div className="text-5xl mb-2">⛳</div>
            <h1 className="font-serif font-bold text-masters-dark text-2xl">Start Your Round</h1>
            <p className="text-gray-400 text-sm mt-1">Track every hole with happy or sad faces</p>
          </div>

          {/* Course Search */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <label className="block text-sm font-bold text-masters-dark mb-2">
              Course Name <span className="text-red-400">*</span>
            </label>
            <CourseSearch
              value={courseName}
              onChange={setCourseName}
              onCourseSelect={course => {
                handleCourseSelect(course)
              }}
            />
            <p className="text-xs text-gray-300 mt-2">Search 25+ famous courses or type any name</p>
          </div>

          {/* Holes Toggle */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <label className="block text-sm font-bold text-masters-dark mb-3">Number of Holes</label>
            <div className="grid grid-cols-2 gap-3">
              {([9, 18] as const).map(n => (
                <motion.button
                  key={n}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleTotalHolesChange(n)}
                  className={`
                    py-4 rounded-xl font-bold text-lg border-2 transition-all
                    ${totalHoles === n
                      ? 'bg-masters-green text-white border-masters-green shadow-md'
                      : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-masters-green hover:text-masters-green'
                    }
                  `}
                >
                  {n} Holes
                </motion.button>
              ))}
            </div>
          </div>

          {/* Par Editor toggle */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => setShowParEditor(s => !s)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-masters-dark">Edit Par Values</span>
                <span className="text-xs bg-masters-gold text-masters-dark font-bold px-2 py-0.5 rounded-full">
                  Par {totalPar}
                </span>
              </div>
              <motion.span
                animate={{ rotate: showParEditor ? 180 : 0 }}
                className="text-gray-400 text-sm"
              >
                ▼
              </motion.span>
            </button>

            <AnimatePresence>
              {showParEditor && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5">
                    <ParEditor
                      pars={pars.slice(0, totalHoles)}
                      onChange={updated => setPars(updated)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button
            fullWidth
            size="lg"
            onClick={handleStart}
            disabled={!courseName.trim() || submitting}
          >
            {submitting ? 'Starting…' : 'Tee Off →'}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
