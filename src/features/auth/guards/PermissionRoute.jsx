import { Navigate } from 'react-router-dom'
import { useAuth } from '../useAuth'
import { hasAllPermissions } from '../permissions'
/**
 * @param {{
 *   children: import('react').ReactNode,
 *   permissions: string[]
 * }} props
 */

function PermissionRoute({ children, permissions }) {
  const { user } = useAuth()

  if (user === null) {
    return <Navigate to="/login" replace />
  }
  if (hasAllPermissions(user, permissions)) {
    return children
  }
  return <Navigate to="/" replace />
}
export default PermissionRoute
