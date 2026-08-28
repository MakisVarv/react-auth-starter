import { useAuth } from '../useAuth'
import { Navigate, useLocation } from 'react-router-dom'

/**
 * @param {{ children: import('react').ReactNode }} props
 */

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  if (user === null) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}
export default ProtectedRoute
