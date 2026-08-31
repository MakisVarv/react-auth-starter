/** @import { User,Role } from '../types.js' */
/** @import {ChangeEvent } from 'react'*/
import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/useAuth.js'
import { getRoles } from '../../roles/roleService.js'
import { toast } from 'sonner'
import { AppError } from '../../../shared/api/errors.js'
import { changeRole } from '../userService.js'

/**
 * @param {{
 *   user:User,
 *   onClose:() => void
 *   onRoleChange:(updatedUser:User)=>void
 * }} props
 */
function ChangeRoleModal({ user, onClose, onRoleChange }) {
  const { accessToken } = useAuth()
  const [roles, setRoles] = useState(/** @type {Role[]} */ ([]))
  const [selectedRoleId, setSelectedRoleId] = useState(user.role.id)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  useEffect(() => {
    async function loadRoles() {
      try {
        if (accessToken === null) return
        const data = await getRoles(accessToken)
        setRoles(data)
      } catch {
        toast.error('Could not fetch roles')
      }
    }
    loadRoles()
  }, [accessToken])
  const handleSubmit = async (e) => {
    setError('')
    if (accessToken === null) return
    setIsSubmitting(true)
    try {
      const updateUser = await changeRole(user.id, selectedRoleId, accessToken)
      toast.success('Role changed successfully.')
      onRoleChange(updateUser)
      onClose()
    } catch (e) {
      if (e instanceof AppError) {
        setError(e.message)
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  /** @param {ChangeEvent<HTMLSelectElement>} e */
  function handleChange(e) {
    const { value } = e.target
    setSelectedRoleId(value)
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Change Role</h2>

          <p className="mt-1 text-sm text-slate-500">
            Change the role assigned to {user.first_name} {user.last_name}.
          </p>
        </div>

        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Current role
          </p>

          <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {user.role.name}
          </span>
        </div>

        <div className="mt-6">
          <label
            htmlFor="role_id"
            className="block text-sm font-medium text-slate-700"
          >
            New role
          </label>

          <select
            id="role_id"
            name="role_id"
            value={selectedRoleId}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="" disabled>
              Select a role
            </option>
            {roles.map((roleOption) => (
              <option key={roleOption.id} value={roleOption.id}>
                {roleOption.name}
              </option>
            ))}
          </select>
          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>
        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedRoleId === user.role.id || isSubmitting}
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? 'Changing Role...' : 'Change Role'}
          </button>
        </div>
      </div>
    </div>
  )
}
export default ChangeRoleModal
