import type { Transaction } from './types'

let cache: Promise<Transaction[]> | null = null

export async function loadTransactions(): Promise<Transaction[]> {
  if (!cache) {
    cache = (async () => {
      const res = await fetch('/transactions.json', { headers: { Accept: 'application/json' } })
      if (!res.ok) throw new Error(`Failed to load transactions.json (${res.status})`)
      const data = (await res.json()) as unknown
      if (!Array.isArray(data)) throw new Error('Invalid transactions.json: expected an array')
      return data as Transaction[]
    })()
  }
  return cache
}

