/** @import { User } from '../types.js' */

import { Link } from 'react-router-dom'

/**
 * @param {{
 *   users: User[],
 *   sort: string,
 *   canEditUser:boolean,
 *   onSort: (field: string) => void
 * }} props
 */
function UsersTable({ users, canEditUser, sort, onSort }) {
  /**
   * @param {string} field
   */
  function sortIcon(field) {
    if (sort === field) return '↑'
    if (sort === `-${field}`) return '↓'
    return '↕'
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-180 w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-6 py-3 font-medium">
              <button
                className="inline-flex items-center gap-1.5 font-medium text-slate-500 transition hover:text-slate-900"
                type="button"
                onClick={() => onSort('first_name')}
              >
                First Name {sortIcon('first_name')}
              </button>
            </th>
            <th className="px-6 py-3 font-medium">
              <button
                className="inline-flex items-center gap-1.5 font-medium text-slate-500 transition hover:text-slate-900"
                type="button"
                onClick={() => onSort('last_name')}
              >
                Last Name {sortIcon('last_name')}
              </button>
            </th>
            <th className="px-6 py-3 font-medium">
              <button
                className="inline-flex items-center gap-1.5 font-medium text-slate-500 transition hover:text-slate-900"
                type="button"
                onClick={() => onSort('email')}
              >
                Email {sortIcon('email')}
              </button>
            </th>
            <th className="px-6 py-3 font-medium">
              <button
                className="inline-flex items-center gap-1.5 font-medium text-slate-500 transition hover:text-slate-900"
                type="button"
                onClick={() => onSort('role')}
              >
                Role {sortIcon('role')}
              </button>
            </th>
            <th className="px-6 py-3 font-medium">
              <button
                className="inline-flex items-center gap-1.5 font-medium text-slate-500 transition hover:text-slate-900"
                type="button"
                onClick={() => onSort('is_active')}
              >
                Status {sortIcon('is_active')}
              </button>
            </th>
            <th className="px-6 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {users.map((user) => (
            <tr className="transition hover:bg-slate-50" key={user.id}>
              <td className="px-6 py-4 font-medium text-slate-900">
                {user.first_name}
              </td>
              <td className="px-6 py-4 font-medium text-slate-900">
                {user.last_name}
              </td>
              <td className="px-6 py-4 text-slate-700">{user.email}</td>
              <td className="px-6 py-4 font-medium text-slate-900">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {user.role.name}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    user.is_active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 ">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/users/${user.id}`}
                    className="inline-flex items-center rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  >
                    View
                  </Link>
                  {canEditUser && (
                    <Link
                      to={`/users/${user.id}/edit`}
                      className="inline-flex items-center rounded-lg bg-blue-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      Edit
                    </Link>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default UsersTable
