import { NavLink } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'
import { hasPermission } from '../../features/auth/permissions'

function Sidebar() {
  const { user } = useAuth()

  const items = [
    { label: 'Dashboard', to: '/dashboard', permissions: ['dashboard.read'] },
    { label: 'Users', to: '/users', permissions: ['user.read'] },
    {
      label: 'Access Control',
      to: '/accessControl',
      permissions: ['role.read', 'permission.read'],
    },
  ]

  return (
    <aside className="min-h-screen w-60 border-r border-slate-200 bg-blue-900 px-3 py-6">
      <nav className="flex flex-col gap-1">
        {items
          .filter((item) =>
            item.permissions.every((permission) =>
              hasPermission(user, permission),
            ),
          )
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
      </nav>
    </aside>
  )
}

export default Sidebar
