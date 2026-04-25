const LAST_PLAYED_KEY = 'hsg_last_played'
const NOTIF_ASKED_KEY = 'hsg_notif_asked'

export function recordPlayed(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(LAST_PLAYED_KEY, new Date().toISOString())
}

export function getLastPlayed(): Date | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(LAST_PLAYED_KEY)
  return raw ? new Date(raw) : null
}

export function daysSinceLastRound(): number | null {
  const last = getLastPlayed()
  if (!last) return null
  return Math.floor((Date.now() - last.getTime()) / 86_400_000)
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false
  if (localStorage.getItem(NOTIF_ASKED_KEY)) return Notification.permission === 'granted'
  localStorage.setItem(NOTIF_ASKED_KEY, '1')
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export function scheduleReminderIfNeeded(): void {
  if (typeof window === 'undefined' || Notification.permission !== 'granted') return
  const days = daysSinceLastRound()
  if (days !== null && days >= 7) {
    new Notification('Time for a round! ⛳', {
      body: 'You haven\'t played in a week. Get out there and make some happy faces 😊',
      icon: '/Happysadgolf/icon-192.png',
    })
  }
}
