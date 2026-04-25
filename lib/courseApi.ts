import { CourseData } from './courses'

const KEY_STORAGE = 'hsg_golf_api_key'
const BASE = 'https://api.golfcourseapi.com/v1'

// ── Key management ───────────────────────────────────────────────────────────

export function getApiKey(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(KEY_STORAGE) ?? ''
}

export function saveApiKey(key: string): void {
  if (typeof window === 'undefined') return
  if (key.trim()) {
    localStorage.setItem(KEY_STORAGE, key.trim())
  } else {
    localStorage.removeItem(KEY_STORAGE)
  }
}

export function hasApiKey(): boolean {
  return getApiKey().length > 0
}

// ── API shapes ────────────────────────────────────────────────────────────────

interface ApiHole {
  hole_num?: number
  number?: number
  par?: number
  par_men?: number
  handicap?: number
  yardage_blue?: number
  yardage?: number
}

interface ApiTee {
  tee_name?: string
  course_rating?: number
  slope_rating?: number
  bogey_rating?: number
  holes?: ApiHole[]
}

interface ApiCourse {
  id?: string
  _id?: string
  club_name?: string
  course_name?: string
  name?: string
  location?: {
    city?: string
    state?: string
    state_code?: string
    country?: string
    address?: string
  }
  tees?: {
    male?: ApiTee[]
    female?: ApiTee[]
  } | ApiTee[]
  holes?: ApiHole[]
  number_of_holes?: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function authHeaders(): HeadersInit {
  return { Authorization: `Key ${getApiKey()}` }
}

function courseDisplayName(c: ApiCourse): string {
  return c.club_name ?? c.course_name ?? c.name ?? 'Unknown Course'
}

function courseLocation(c: ApiCourse): string {
  const loc = c.location
  if (!loc) return ''
  const parts = [loc.city, loc.state ?? loc.state_code, loc.country].filter(Boolean)
  return parts.join(', ')
}

function extractHoles(c: ApiCourse): ApiHole[] | null {
  // Direct holes array
  if (Array.isArray(c.holes) && c.holes.length > 0) return c.holes

  // Nested under tees
  const tees = c.tees
  if (!tees) return null

  // tees.male / tees.female shape
  if (!Array.isArray(tees)) {
    const male = (tees as { male?: ApiTee[] }).male
    if (Array.isArray(male) && male.length > 0 && Array.isArray(male[0].holes)) {
      return male[0].holes ?? null
    }
    const female = (tees as { female?: ApiTee[] }).female
    if (Array.isArray(female) && female.length > 0 && Array.isArray(female[0].holes)) {
      return female[0].holes ?? null
    }
  }

  // Flat tees array
  if (Array.isArray(tees) && tees.length > 0 && Array.isArray(tees[0].holes)) {
    return tees[0].holes ?? null
  }

  return null
}

function extractRatingSlope(c: ApiCourse): { courseRating?: number; slopeRating?: number } {
  const tees = c.tees
  if (!tees) return {}

  const tryTee = (t: ApiTee) => ({
    courseRating: t.course_rating,
    slopeRating: t.slope_rating,
  })

  if (!Array.isArray(tees)) {
    const male = (tees as { male?: ApiTee[] }).male
    if (Array.isArray(male) && male.length > 0) return tryTee(male[0])
  }
  if (Array.isArray(tees) && tees.length > 0) return tryTee(tees[0])
  return {}
}

function parsePars(holes: ApiHole[]): number[] {
  return holes
    .sort((a, b) => (a.hole_num ?? a.number ?? 0) - (b.hole_num ?? b.number ?? 0))
    .map(h => h.par ?? h.par_men ?? 4)
}

/** Map an API course (with hole detail) → our CourseData shape */
function apiToCourseData(c: ApiCourse): CourseData | null {
  const holes = extractHoles(c)
  if (!holes || holes.length < 9) return null
  const pars = parsePars(holes)
  const { courseRating, slopeRating } = extractRatingSlope(c)
  const name = courseDisplayName(c)
  const location = courseLocation(c)
  const totalPar = pars.slice(0, 18).reduce((s, p) => s + p, 0)
  return {
    id: c.id ?? c._id ?? name,
    name,
    location,
    pars: pars.slice(0, 18),
    totalPar,
    courseRating,
    slopeRating,
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface ApiSearchResult {
  id: string
  name: string
  location: string
  numHoles: number
}

/** Search courses — returns lightweight list (no hole detail yet) */
export async function searchCoursesApi(query: string): Promise<ApiSearchResult[]> {
  const key = getApiKey()
  if (!key || !query.trim()) return []

  try {
    const res = await fetch(`${BASE}/search?search_query=${encodeURIComponent(query)}`, {
      headers: authHeaders(),
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) return []
    const data = await res.json()

    // Response: { courses: [...] } or flat array
    const courses: ApiCourse[] = Array.isArray(data) ? data : (data.courses ?? [])
    return courses.slice(0, 8).map(c => ({
      id: c.id ?? c._id ?? courseDisplayName(c),
      name: courseDisplayName(c),
      location: courseLocation(c),
      numHoles: c.number_of_holes ?? (Array.isArray(c.holes) ? c.holes.length : 18),
    }))
  } catch {
    return []
  }
}

/** Fetch full course detail → parse into CourseData with pars */
export async function fetchCourseDetail(id: string): Promise<CourseData | null> {
  const key = getApiKey()
  if (!key) return null

  try {
    const res = await fetch(`${BASE}/courses/${id}`, {
      headers: authHeaders(),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const data = await res.json()
    const course: ApiCourse = data.course ?? data
    return apiToCourseData(course)
  } catch {
    return null
  }
}
