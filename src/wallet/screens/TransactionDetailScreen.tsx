import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { Link, useParams } from 'react-router-dom'
import { useTransactions } from '../useTransactions'
import { formatMoney, formatTxAmount } from '../utils'

export function TransactionDetailScreen() {
  const { id } = useParams<{ id: string }>()
  const state = useTransactions()

  const tx =
    state.status === 'ready' && id
      ? state.transactions.find((t) => t.id === id)
      : null

  const detail =
    state.status === 'ready'
      ? tx
        ? (
          <TransactionDetailView />
        )
        : (
          <div className="card">
            <div className="cardLabel">Transaction not found.</div>
          </div>
        )
      : null

  function TransactionDetailView() {
    if (!tx) return null
    const amountClass = tx.type === 'Payment' ? 'payment' : 'credit'
    const status = tx.pending ? 'Pending' : 'Approved'
    const dateTime = new Date(tx.date).toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    const source = tx.authorizedUser ?? tx.name

    return (
      <div className="detailScreen">
        <div className="detailHero">
          <div className={`detailHeroAmount txAmount ${amountClass}`}>
            {formatTxAmount(tx.type, tx.amount)}
          </div>
          <div className="detailHeroName">{source}</div>
          <div className="detailHeroDate">{dateTime}</div>
        </div>

        <div className="detailInfoCard">
          <div className="detailInfoTop">
            <div className="detailStatus">Status: {status}</div>
            <div className="detailSource">{tx.description}</div>
          </div>
          <div className="detailInfoRow">
            <span>Total</span>
            <strong>{formatMoney(tx.amount)}</strong>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="phone">
      <div className="topBar">
        <Link to="/transactions" className="navBackLink" aria-label="Back to transactions">
          <FontAwesomeIcon icon={faChevronLeft} />
        </Link>
        <div className="title">Transaction detail</div>
        <div className="spacerIconButton" />
      </div>

      {state.status === 'loading' && (
        <div className="card">
          <div className="cardLabel">Loading…</div>
        </div>
      )}

      {state.status === 'error' && (
        <div className="card">
          <div className="cardLabel">Couldn’t load transactions</div>
          <div className="txSub">{state.error}</div>
        </div>
      )}

      {detail}
    </div>
  )
}

