import { useAuth } from '../useAuth'
import { Navigate } from 'react-router-dom'
/**
 * @param {{ children: import('react').ReactNode }} props
 */

function GuestOnlyRoute({ children }) {
  const { user } = useAuth()

  if (user !== null) {
    return <Navigate to="/" replace />
  }

  return children
}

export default GuestOnlyRoute
