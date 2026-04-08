import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { pickIcon } from '../icons'
import { useTransactions } from '../useTransactions'
import {
  CARD_LIMIT,
  calcDailyPointsForDate,
  formatMoney,
  formatPoints,
  formatTxAmount,
  formatTxDateLabel,
  randomCardBalanceForToday,
} from '../utils'
import type { Transaction } from '../types'

function sortNewestFirst(a: Transaction, b: Transaction) {
  return new Date(b.date).getTime() - new Date(a.date).getTime()
}

export function TransactionsListScreen() {
  const state = useTransactions()

  const balance = randomCardBalanceForToday()
  const available = Math.max(0, CARD_LIMIT - balance)
  const points = calcDailyPointsForDate()

  const top10 =
    state.status === 'ready'
      ? [...state.transactions].sort(sortNewestFirst).slice(0, 10)
      : []

  return (
    <div className="phone">
      <div className="topBar">
        <div className="title">Wallet</div>
        <div className="pill">
          <span className="pillStrong">Limit</span>
          <span>{formatMoney(CARD_LIMIT)}</span>
        </div>
      </div>

      <div className="stack">
        <div className="summaryGrid">
          <div className="summaryCard">
            <div className="cardLabel">Card Balance</div>
            <div className="cardValue">{formatMoney(balance)}</div>
            <div className="subValue">{formatMoney(available)} Available</div>
          </div>

          <div className="summaryCard summaryCardTight">
            <div className="paymentDueContent">
              <div className="cardLabel">No Payment Due</div>
              <div className="txSub mt6">
                You’ve paid your balance.
              </div>
            </div>
            <div className="paymentDueIcons" aria-hidden="true">
              <div className="checkCircle">
                <FontAwesomeIcon icon={faCheck} />
              </div>

            </div>
          </div>

          <div className="summaryCard summaryCardCenter">
            <div className="cardLabel">Daily Points</div>
            <div className="cardValue cardDailyPoints">{formatPoints(points)}</div>
          </div>
        </div>

        <div className="sectionTitle">
          <h2>Latest transactions</h2>
        </div>

        {state.status === 'loading' && (
          <div className="card">
            <div className="cardLabel">Loading transactions…</div>
          </div>
        )}

        {state.status === 'error' && (
          <div className="card">
            <div className="cardLabel">Couldn’t load transactions</div>
            <div className="txSub">{state.error}</div>
          </div>
        )}

        {state.status === 'ready' && (
          <div className="list">
            <div className="listCard">
              {top10.map((tx) => {
                const { icon, bg } = pickIcon(tx.id)
                const metaLeft = tx.authorizedUser ? tx.authorizedUser : null
                const metaRight = formatTxDateLabel(tx.date)
                const amountClass = tx.type === 'Payment' ? 'payment' : 'credit'
                const sub = tx.pending ? (
                  <span>
                    <span className="txPendingTag">Pending</span>
                    <span> - {tx.description}</span>
                  </span>
                ) : (
                  tx.description
                )

                return (
                  <Link key={tx.id} to={`/transactions/${tx.id}`} className="row">
                    <div className="txIcon" style={{ background: bg }}>
                      <FontAwesomeIcon icon={icon} />
                    </div>

                    <div className="txMain">
                      <div className="txName">{tx.name}</div>
                      <div className="txSub">{sub}</div>
                      <div className="txMeta">
                        {metaLeft && (
                          <>
                            <span>{metaLeft}</span>
                            <span className="dot" />
                          </>
                        )}
                        <span>{metaRight}</span>
                      </div>
                    </div>

                    <div className="txRight">
                      <div className={`txAmount ${amountClass}`}>{formatTxAmount(tx.type, tx.amount)}</div>
                      <FontAwesomeIcon icon={faChevronRight} className="txChevron" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

