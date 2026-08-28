import { NavLink } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'
import hasPermission from '../../features/auth/permissions'

function NavBar() {
  const { user, logout } = useAuth()
  async function handleLogout() {
    await logout()
  }
  /**
   * @param {{ isActive: boolean }} props
   */
  function navLinkClass({ isActive }) {
    return isActive
      ? 'rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white'
      : 'rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900'
  }
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          {user !== null && hasPermission(user, 'dashboard.read') && (
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
        </div>
        <div className="flex items-center gap-2">
          {user === null && (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navLinkClass}>
                Register
              </NavLink>
            </>
          )}

          {user !== null && (
            <>
              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>

              <button
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
export default NavBar
