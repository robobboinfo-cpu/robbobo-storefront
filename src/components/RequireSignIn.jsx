import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RequireSignIn({ children }) {
  const { currentUser, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="page-shell page-section" role="status">Checking your sign-in...</div>
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}${location.hash}`, requireSignIn: true }} />
  }

  return children
}
