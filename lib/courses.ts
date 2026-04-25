export interface CourseData {
  id: string
  name: string
  location: string
  pars: number[]  // 18 holes
  totalPar: number
  courseRating?: number
  slopeRating?: number
}

export const COURSES: CourseData[] = [
  { id: 'augusta-national', name: 'Augusta National Golf Club', location: 'Augusta, GA', pars: [4,5,4,3,4,3,4,5,4,4,4,3,5,4,5,3,4,4], totalPar: 72, courseRating: 76.2, slopeRating: 148 },
  { id: 'pebble-beach', name: 'Pebble Beach Golf Links', location: 'Pebble Beach, CA', pars: [4,5,4,4,3,5,3,4,4,4,4,3,4,5,4,4,3,5], totalPar: 72, courseRating: 75.5, slopeRating: 145 },
  { id: 'st-andrews', name: 'St Andrews Links (Old Course)', location: 'St Andrews, Scotland', pars: [4,4,4,4,5,4,4,3,4,4,3,4,4,5,4,4,4,4], totalPar: 72, courseRating: 72.1, slopeRating: 132 },
  { id: 'tpc-sawgrass', name: 'TPC Sawgrass (Stadium)', location: 'Ponte Vedra Beach, FL', pars: [4,5,3,4,4,4,4,3,5,4,5,3,4,4,4,5,3,4], totalPar: 72, courseRating: 76.8, slopeRating: 155 },
  { id: 'pinehurst-2', name: 'Pinehurst No. 2', location: 'Pinehurst, NC', pars: [4,4,4,4,4,3,4,3,4,4,4,4,3,4,5,4,3,4], totalPar: 70, courseRating: 76.6, slopeRating: 153 },
  { id: 'bethpage-black', name: 'Bethpage Black Course', location: 'Farmingdale, NY', pars: [4,4,3,4,5,4,4,3,4,4,4,5,3,4,4,3,5,4], totalPar: 71, courseRating: 76.6, slopeRating: 155 },
  { id: 'torrey-pines-south', name: 'Torrey Pines (South Course)', location: 'La Jolla, CA', pars: [4,4,3,4,4,5,4,3,4,5,4,3,4,4,4,5,3,4], totalPar: 72, courseRating: 75.7, slopeRating: 144 },
  { id: 'whistling-straits', name: 'Whistling Straits', location: 'Sheboygan, WI', pars: [4,4,3,4,5,4,3,4,4,5,3,4,4,4,3,5,4,5], totalPar: 72, courseRating: 76.1, slopeRating: 151 },
  { id: 'carnoustie', name: 'Carnoustie Golf Links', location: 'Carnoustie, Scotland', pars: [4,4,3,4,4,5,4,3,4,4,4,3,4,5,5,3,4,4], totalPar: 71, courseRating: 75.4, slopeRating: 145 },
  { id: 'royal-birkdale', name: 'Royal Birkdale Golf Club', location: 'Southport, England', pars: [4,4,4,3,4,4,3,4,4,4,4,3,4,3,5,4,5,4], totalPar: 70, courseRating: 74.1, slopeRating: 142 },
  { id: 'muirfield', name: 'Muirfield (Honourable Company)', location: 'East Lothian, Scotland', pars: [4,4,4,3,5,4,3,4,4,4,4,4,3,4,5,3,5,4], totalPar: 71, courseRating: 73.9, slopeRating: 137 },
  { id: 'royal-troon', name: 'Royal Troon Golf Club', location: 'Troon, Scotland', pars: [4,4,4,5,3,5,4,3,4,4,4,4,4,3,4,5,3,4], totalPar: 71, courseRating: 73.6, slopeRating: 134 },
  { id: 'winged-foot-west', name: 'Winged Foot (West Course)', location: 'Mamaroneck, NY', pars: [4,4,3,5,3,5,4,4,3,4,3,4,5,4,4,4,3,4], totalPar: 70, courseRating: 75.8, slopeRating: 144 },
  { id: 'shinnecock-hills', name: 'Shinnecock Hills Golf Club', location: 'Southampton, NY', pars: [4,5,4,4,3,4,4,3,4,4,4,3,4,4,3,4,4,5], totalPar: 70, courseRating: 75.4, slopeRating: 144 },
  { id: 'oakmont', name: 'Oakmont Country Club', location: 'Oakmont, PA', pars: [4,4,4,4,4,3,4,3,5,4,4,3,4,4,4,3,4,4], totalPar: 70, courseRating: 77.6, slopeRating: 147 },
  { id: 'riviera', name: 'Riviera Country Club', location: 'Pacific Palisades, CA', pars: [4,5,4,3,4,3,4,4,4,4,4,3,4,4,4,5,3,4], totalPar: 71, courseRating: 75.5, slopeRating: 143 },
  { id: 'olympic-club', name: 'Olympic Club (Lake Course)', location: 'San Francisco, CA', pars: [5,4,3,4,4,3,4,4,4,4,4,3,4,3,4,5,4,4], totalPar: 70, courseRating: 75.8, slopeRating: 145 },
  { id: 'harbour-town', name: 'Harbour Town Golf Links', location: 'Hilton Head, SC', pars: [4,4,3,4,5,4,3,4,4,4,4,3,4,3,5,4,3,4], totalPar: 71, courseRating: 73.8, slopeRating: 136 },
  { id: 'kiawah-ocean', name: 'Kiawah Island Ocean Course', location: 'Kiawah Island, SC', pars: [4,5,3,4,4,5,4,3,4,4,4,3,4,5,4,3,5,4], totalPar: 72, courseRating: 79.6, slopeRating: 144 },
  { id: 'bandon-dunes', name: 'Bandon Dunes Golf Resort', location: 'Bandon, OR', pars: [4,4,5,4,3,4,4,4,4,4,5,4,3,4,4,3,4,4], totalPar: 72, courseRating: 74.6, slopeRating: 140 },
  { id: 'congressional-blue', name: 'Congressional Country Club (Blue)', location: 'Bethesda, MD', pars: [4,4,4,3,4,4,3,4,5,4,4,3,4,4,3,4,5,4], totalPar: 70, courseRating: 76.8, slopeRating: 142 },
  { id: 'merion-east', name: 'Merion Golf Club (East Course)', location: 'Ardmore, PA', pars: [4,4,3,4,4,4,4,3,4,4,4,4,3,4,4,3,4,4], totalPar: 70, courseRating: 74.7, slopeRating: 143 },
  { id: 'baltusrol-lower', name: 'Baltusrol Golf Club (Lower)', location: 'Springfield, NJ', pars: [4,5,3,4,4,3,4,4,5,4,4,3,4,4,5,3,4,5], totalPar: 70, courseRating: 75.3, slopeRating: 139 },
  { id: 'cypress-point', name: 'Cypress Point Club', location: 'Pebble Beach, CA', pars: [4,4,4,3,3,5,4,4,3,4,4,5,3,4,3,5,4,4], totalPar: 72, courseRating: 73.9, slopeRating: 141 },
  { id: 'seminole', name: 'Seminole Golf Club', location: 'Juno Beach, FL', pars: [4,4,3,4,4,5,4,3,4,4,4,3,5,4,4,3,4,4], totalPar: 72, courseRating: 74.3, slopeRating: 135 },
]

export function searchCourses(query: string): CourseData[] {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  return COURSES.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.location.toLowerCase().includes(q)
  ).slice(0, 6)
}

export function getCoursePars(course: CourseData, totalHoles: 9 | 18): number[] {
  return totalHoles === 9 ? course.pars.slice(0, 9) : course.pars
}
