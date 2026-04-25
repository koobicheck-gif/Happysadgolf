'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import MastersHeader from '@/components/ui/MastersHeader'
import Button from '@/components/ui/Button'
import CourseSearch from '@/components/game/CourseSearch'
import ParEditor from '@/components/game/ParEditor'
import PlayerSetup from '@/components/game/PlayerSetup'
import { CourseData, getCoursePars } from '@/lib/courses'
import { generateId } from '@/lib/gameUtils'
import { saveGame, setCurrentGameId } from '@/lib/storage'
import { Game, Hole, Player } from '@/types'
import { DEFAULT_PARS_18, DEFAULT_PARS_9 } from '@/lib/defaultPars'
import { recordPlayed } from '@/lib/notifications'

export default function NewGame() {
  const router = useRouter()
  const [courseName, setCourseName] = useState('')
  const [totalHoles, setTotalHoles] = useState<9 | 18>(18)
  const [pars, setPars] = useState<number[]>(DEFAULT_PARS_18)
  const [courseRating, setCourseRating] = useState('')
  const [slopeRating, setSlopeRating] = useState('')
  const [players, setPlayers] = useState<string[]>(['Me'])
  const [showParEditor, setShowParEditor] = useState(false)
  const [showHandicapFields, setShowHandicapFields] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleTotalHolesChange = (n: 9 | 18) => {
    setTotalHoles(n)
    setPars(n === 9 ? DEFAULT_PARS_9 : DEFAULT_PARS_18)
  }

  const handleCourseSelect = (course: CourseData) => {
    setPars(getCoursePars(course, totalHoles))
    if (course.courseRating) setCourseRating(String(course.courseRating))
    if (course.slopeRating) setSlopeRating(String(course.slopeRating))
    setShowParEditor(true)
    setShowHandicapFields(true)
  }

  const handleStart = () => {
    if (!courseName.trim()) return
    setSubmitting(true)
    recordPlayed()

    const id = generateId()
    const holePars = pars.slice(0, totalHoles)

    const buildHoles = (): Hole[] => holePars.map((par, i) => ({ number: i + 1, par, emoji: null }))

    const gamePlayers: Player[] = players.map((name, i) => ({
      id: `p${i}`,
      name: name.trim() || `Player ${i + 1}`,
      holes: buildHoles(),
      happyCount: 0,
      sadCount: 0,
      result: 'in-progress',
    }))

    const game: Game = {
      id,
      date: new Date().toISOString(),
      courseName: courseName.trim(),
      courseRating: courseRating ? parseFloat(courseRating) : undefined,
      slopeRating: slopeRating ? parseInt(slopeRating) : undefined,
      holes: gamePlayers[0].holes,
      players: gamePlayers,
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

      <div className="flex-1 px-5 py-5 overflow-auto pb-10 space-y-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Hero */}
          <div className="text-center py-3 mb-5">
            <div className="text-5xl mb-2">⛳</div>
            <h1 className="font-serif font-bold text-masters-dark text-2xl">Start Your Round</h1>
            <p className="text-gray-400 text-sm mt-1">Track every hole with happy or sad faces</p>
          </div>

          {/* Course Search */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
            <label className="block text-sm font-bold text-masters-dark mb-2">
              Course Name <span className="text-red-400">*</span>
            </label>
            <CourseSearch value={courseName} onChange={setCourseName} onCourseSelect={handleCourseSelect} />
            <p className="text-xs text-gray-300 mt-2">Search 25+ famous courses — pars &amp; ratings auto-fill</p>
          </div>

          {/* Holes Toggle */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
            <label className="block text-sm font-bold text-masters-dark mb-3">Number of Holes</label>
            <div className="grid grid-cols-2 gap-3">
              {([9, 18] as const).map(n => (
                <motion.button key={n} whileTap={{ scale: 0.96 }} onClick={() => handleTotalHolesChange(n)}
                  className={`py-4 rounded-xl font-bold text-lg border-2 transition-all ${totalHoles === n ? 'bg-masters-green text-white border-masters-green shadow-md' : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-masters-green hover:text-masters-green'}`}>
                  {n} Holes
                </motion.button>
              ))}
            </div>
          </div>

          {/* Players */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
            <label className="block text-sm font-bold text-masters-dark mb-3">Players (up to 4)</label>
            <PlayerSetup players={players} onChange={setPlayers} />
          </div>

          {/* Par Editor */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
            <button onClick={() => setShowParEditor(s => !s)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-masters-dark">Edit Par Values</span>
                <span className="text-xs bg-masters-gold text-masters-dark font-bold px-2 py-0.5 rounded-full">Par {totalPar}</span>
              </div>
              <motion.span animate={{ rotate: showParEditor ? 180 : 0 }} className="text-gray-400 text-sm">▼</motion.span>
            </button>
            <AnimatePresence>
              {showParEditor && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                  <div className="px-5 pb-5">
                    <ParEditor pars={pars.slice(0, totalHoles)} onChange={updated => setPars(updated)} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Handicap fields */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
            <button onClick={() => setShowHandicapFields(s => !s)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
              <span className="text-sm font-bold text-masters-dark">Handicap Info (Optional)</span>
              <motion.span animate={{ rotate: showHandicapFields ? 180 : 0 }} className="text-gray-400 text-sm">▼</motion.span>
            </button>
            <AnimatePresence>
              {showHandicapFields && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                  <div className="px-5 pb-5 grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1">Course Rating</label>
                      <input type="number" step="0.1" value={courseRating} onChange={e => setCourseRating(e.target.value)}
                        placeholder="72.1" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-masters-green" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 block mb-1">Slope Rating</label>
                      <input type="number" value={slopeRating} onChange={e => setSlopeRating(e.target.value)}
                        placeholder="113" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-masters-green" />
                    </div>
                    <p className="col-span-2 text-xs text-gray-300">Used to calculate your handicap differential after the round</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button fullWidth size="lg" onClick={handleStart} disabled={!courseName.trim() || submitting}>
            {submitting ? 'Starting…' : `Tee Off → ${players.length > 1 ? `(${players.length} players)` : ''}`}
          </Button>

        </motion.div>
      </div>
    </div>
  )
}
