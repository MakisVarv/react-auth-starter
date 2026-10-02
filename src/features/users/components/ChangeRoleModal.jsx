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

  useEffect(() => {
    roleSelectRef.current?.focus()
  }, [])
  useEffect(() => {
    /** @param {KeyboardEvent} event */
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const focusableElements = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), select:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      )

      const firstElement = focusableElements?.[0]
      const lastElement = focusableElements?.[focusableElements.length - 1]

      if (
        !(firstElement instanceof HTMLElement) ||
        !(lastElement instanceof HTMLElement)
      ) {
        return
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
        return
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])
  useEffect(() => {
    async function loadRoles() {
      try {
        const data = await getRoles()
        setRoles(data)
      } catch {
        toast.error('Could not fetch roles')
      }
    }
    loadRoles()
  }, [])
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
        ref={dialogRef}
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
