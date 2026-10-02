/** @import { User } from '../types.js' */
/** @import { Role } from '../../access-control/types.js' */
/** @import {ChangeEvent } from 'react'*/
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { getRoles } from '../../access-control/services/roleService.js'
import { toast } from 'sonner'
import { AppError } from '../../../shared/api/errors.js'
import { changeRole } from '../userService.js'
import { canAssignRole } from '../../access-control/authorization.js'
import { useModalAccessibility } from '../../../shared/hooks/useModalAccessibility'
/**
 * @param {{
 *   user:User,
 *   onClose:() => void
 *   onRoleChange:(updatedUser:User)=>void
 * }} props
 */
function ChangeRoleModal({ user, onClose, onRoleChange }) {
  const roleSelectRef = useRef(/** @type {HTMLSelectElement | null} */ (null))
  const dialogRef = useRef(/** @type {HTMLDivElement | null} */ (null))
  const { user: actor } = useAuth()
  const [roles, setRoles] = useState(/** @type {Role[]} */ ([]))
  const [selectedRoleId, setSelectedRoleId] = useState(user.role.id)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [rolesError, setRolesError] = useState('')
  const [rolesRefreshKey, setRolesRefreshKey] = useState(0)
  useModalAccessibility({
    dialogRef,
    initialFocusRef: roleSelectRef,
    onClose,
    canClose: !isSubmitting,
  })
  useEffect(() => {
    async function loadRoles() {
      setRolesError('')
      setIsLoading(true)
      try {
        const data = await getRoles()
        setRoles(data)
      } catch {
        setRolesError('Could not fetch roles')
      } finally {
        setIsLoading(false)
      }
    }
    loadRoles()
  }, [rolesRefreshKey])
  if (actor === null) return
  const assignableRoles = roles.filter((role) => canAssignRole(actor, role))
  const handleSubmit = async () => {
    setError('')
    setIsSubmitting(true)
    try {
      const updateUser = await changeRole(user.id, selectedRoleId)
      onRoleChange(updateUser)
      toast.success('Role changed successfully.')
      onClose()
    } catch (e) {
      if (e instanceof AppError) {
        setError(e.message)
      } else {
        setError('Something went wrong. Please try again.')
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
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-role-title"
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <div>
          <h2
            id="change-role-title"
            className="text-xl font-semibold text-slate-900"
          >
            Change Role
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Change the role assigned to {user.first_name} {user.last_name}.
          </p>
        </div>
        {isLoading && (
          <div
            role="status"
            className="flex items-center justify-center gap-3 p-8 text-sm text-slate-500"
          >
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
            <span>Loading roles...</span>
          </div>
        )}
        {rolesError && (
          <div
            role="alert"
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-6 text-center"
          >
            <p className="text-sm font-medium text-red-700">{rolesError}</p>

            <button
              type="button"
              onClick={() => setRolesRefreshKey((current) => current + 1)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              Try again
            </button>
          </div>
        )}
        {!rolesError && !isLoading && (
          <div>
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
                ref={roleSelectRef}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="" disabled>
                  Select a role
                </option>
                {assignableRoles.map((roleOption) => (
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
          </div>
        )}
        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="disabled:cursor-not-allowed disabled:opacity-50 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Cancel
          </button>
          {!rolesError && !isLoading && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={selectedRoleId === user.role.id || isSubmitting}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSubmitting ? 'Changing Role...' : 'Change Role'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
export default ChangeRoleModal
