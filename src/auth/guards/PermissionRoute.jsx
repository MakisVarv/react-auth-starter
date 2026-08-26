import { Navigate } from 'react-router-dom'
import { useAuth } from '../useAuth'
import hasPermission from '../permissions'
/**
 * @param {{
 *   children: import('react').ReactNode,
 *   permission: string
 * }} props
 */

function PermissionRoute({ children, permission }) {
  const { user } = useAuth()

  if (user === null) {
    return <Navigate to="/login" replace />
  }
  if (hasPermission(user, permission)) {
    return children
  }
  return <Navigate to="/" replace />
}
export default PermissionRoute
