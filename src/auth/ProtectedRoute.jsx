import { useAuth } from './useAuth'
import { Navigate } from 'react-router-dom'
/**
 * @param {{ children: import('react').ReactNode }} props
 */

function ProtectedRoute({ children }) {
  const { user } = useAuth()

  if (user === null) {
    return <Navigate to="/login" replace />
  } else {
    return children
  }
}
export default ProtectedRoute
