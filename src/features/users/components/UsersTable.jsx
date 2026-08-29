/** @import { User } from '../types.js' */

/**
 * @param {{ users: User[] }} props
 */
function UsersTable({ users }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-6 py-3 font-medium">Name</th>
            <th className="px-6 py-3 font-medium">Email</th>
            <th className="px-6 py-3 font-medium">Role</th>
            <th className="px-6 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {users.map((user) => (
            <tr className="transition hover:bg-slate-50" key={user.id}>
              <td className="px-6 py-4 text-slate-700">
                {user.first_name + ' ' + user.last_name}
              </td>
              <td className="px-6 py-4 text-slate-700">{user.email}</td>
              <td className="px-6 py-4 text-slate-700">{user.role.name}</td>
              <td className="px-6 py-4 text-slate-700">
                {user.is_active ? 'Active' : 'Inactive'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default UsersTable
