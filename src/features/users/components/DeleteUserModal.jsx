/** @import { User } from '../types.js' */

import { useRef, useState } from 'react'
import { deleteUser } from '../userService.js'
import { toast } from 'sonner'
import { AppError } from '../../../shared/api/errors.js'
import { useModalAccessibility } from '../../../shared/hooks/useModalAccessibility.js'

/**
 * @param {{
 *   user:User,
 *   onClose:() => void
 *   onDeleted:()=>void
 * }} props
 */
function DeleteUserModal({ user, onClose, onDeleted }) {
  const [error, setError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const cancelButtonRef = useRef(/** @type {HTMLButtonElement | null} */ (null))
  const dialogRef = useRef(/** @type {HTMLDivElement | null} */ (null))
  useModalAccessibility({
    dialogRef,
    initialFocusRef: cancelButtonRef,
    onClose,
    canClose: !isDeleting,
  })

  const handleDelete = async () => {
    try {
      setError('')
      setIsDeleting(true)
      await deleteUser(user.id)
      toast.success('User deleted successfully!')
      onDeleted()
    } catch (e) {
      if (e instanceof AppError) {
        setError(e.message)
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } finally {
      setIsDeleting(false)
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-user-title"
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <div>
          <h2
            id="delete-user-title"
            className="text-xl font-semibold text-slate-900"
          >
            Delete User
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Delete User {user.first_name} {user.last_name}? This action cannot
            be undone.
          </p>
          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>
        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            type="button"
            ref={cancelButtonRef}
            onClick={onClose}
            disabled={isDeleting}
            className="disabled:cursor-not-allowed disabled:opacity-50 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isDeleting ? 'Deleting User...' : 'Delete User'}
          </button>
        </div>
      </div>
    </div>
  )
}
export default DeleteUserModal
