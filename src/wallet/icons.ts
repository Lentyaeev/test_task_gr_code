import {
  faBagShopping,
  faBolt,
  faBurger,
  faCartShopping,
  faCouch,
  faCreditCard,
  faGasPump,
  faLaptop,
  faMugSaucer,
  faMusic,
  faPrescriptionBottleMedical,
  faShirt,
  faTrainSubway,
} from '@fortawesome/free-solid-svg-icons'

export const ICONS = [
  faBagShopping,
  faCartShopping,
  faCouch,
  faMugSaucer,
  faTrainSubway,
  faMusic,
  faLaptop,
  faGasPump,
  faBurger,
  faBolt,
  faShirt,
  faPrescriptionBottleMedical,
  faCreditCard,
] as const

export const DARK_BACKGROUNDS = [
  '#1b1f2a',
  '#1d1b2a',
  '#12202a',
  '#1a2222',
  '#221a1a',
  '#232019',
  '#141c2f',
  '#1f1630',
] as const

function hashString(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function pickIcon(id: string) {
  const h = hashString(id)
  const icon = ICONS[h % ICONS.length]
  const bg = DARK_BACKGROUNDS[(h >>> 8) % DARK_BACKGROUNDS.length]
  return { icon, bg }
}

