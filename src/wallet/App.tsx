import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { TransactionsListScreen } from './screens/TransactionsListScreen'
import { TransactionDetailScreen } from './screens/TransactionDetailScreen'

export function App() {
  const location = useLocation()
  const isDetail = /^\/transactions\/[^/]+$/.test(location.pathname);

  return (
    <div className="appShell">
      <div
        key={location.pathname}
        className={`routeTransition ${isDetail ? 'toDetail' : 'toList'}`}
      >
        <Routes location={location}>
          <Route path="/" element={<Navigate to="/transactions" replace />} />
          <Route path="/transactions" element={<TransactionsListScreen />} />
          <Route path="/transactions/:id" element={<TransactionDetailScreen />} />
          <Route path="*" element={<Navigate to="/transactions" replace />} />
        </Routes>
      </div>
    </div>
  )
}

