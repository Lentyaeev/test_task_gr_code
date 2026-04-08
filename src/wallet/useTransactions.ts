import { useEffect, useMemo, useState } from 'react'
import { loadTransactions } from './api'
import type { Transaction } from './types'

type State =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'ready'; transactions: Transaction[] }

export function useTransactions() {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    loadTransactions()
      .then((txs) => {
        if (cancelled) return
        setState({ status: 'ready', transactions: txs })
      })
      .catch((e: unknown) => {
        if (cancelled) return
        setState({
          status: 'error',
          error: e instanceof Error ? e.message : 'Failed to load transactions',
        })
      })
    return () => {
      cancelled = true
    }
  }, [])

  return useMemo(() => state, [state])
}

