export const CARD_LIMIT = 1500

export function formatMoney(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export function formatTxAmount(type: 'Payment' | 'Credit', amount: number) {
  if (type === 'Payment') return formatMoney(amount)
  return `-${formatMoney(amount)}`
}

export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function daysBetween(a: Date, b: Date) {
  const ms = startOfDay(b).getTime() - startOfDay(a).getTime()
  return Math.floor(ms / 86400000)
}

export function formatTxDateLabel(iso: string, now = new Date()) {
  const d = new Date(iso)
  const ageDays = Math.abs(daysBetween(d, now))
  if (ageDays < 7) {
    return d.toLocaleDateString('en-US', { weekday: 'long' })
  }
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function seasonStartFor(date: Date) {
  const y = date.getFullYear()
  const m = date.getMonth() + 1

  // Meteorological seasons:
  // Spring: Mar 1, Summer: Jun 1, Autumn: Sep 1, Winter: Dec 1
  if (m >= 3 && m <= 5) return new Date(y, 2, 1)
  if (m >= 6 && m <= 8) return new Date(y, 5, 1)
  if (m >= 9 && m <= 11) return new Date(y, 8, 1)
  return new Date(y, 11, 1)
}

export function getSeasonDayIndex(date: Date) {
  const start = seasonStartFor(date)
  return daysBetween(start, date) + 1
}

export function calcDailyPointsForDate(date = new Date()) {
  const n = Math.max(1, getSeasonDayIndex(date))
  if (n === 1) return 2
  if (n === 2) return 3

  let p1 = 2
  let p2 = 3
  for (let i = 3; i <= n; i++) {
    const next = Math.round(p1 + 0.6 * p2)
    p1 = p2
    p2 = next
  }
  return p2
}

export function formatPoints(points: number) {
  if (points >= 1000) return `${Math.round(points / 1000)}K`
  return String(points)
}

function seeded01(seed: number) {
  let x = seed >>> 0
  x ^= x << 13
  x ^= x >>> 17
  x ^= x << 5
  return (x >>> 0) / 0xffffffff
}

export function randomCardBalanceForToday(now = new Date()) {
  const seed =
    now.getFullYear() * 10000 +
    (now.getMonth() + 1) * 100 +
    now.getDate()
  const r = seeded01(seed)
  const raw = Math.round(r * CARD_LIMIT * 0.92 * 100) / 100
  return Math.min(CARD_LIMIT, Math.max(0, raw))
}

