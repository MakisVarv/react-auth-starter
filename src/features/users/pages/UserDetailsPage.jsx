import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { useEffect, useState } from 'react'
import { changeUserStatus, getUser } from '../userService'
import { AppError } from '../../../shared/api/errors'
import ChangeRoleModal from '../components/ChangeRoleModal'
import DeleteUserModal from '../components/DeleteUserModal'
import { toast } from 'sonner'
import { hasPermission } from '../../auth/permissions'
/** @import { User } from '../types.js' */
function UserDetailsPage() {
  const { userId } = useParams()
  const { user: currentUser, accessToken } = useAuth()
  const [loadError, setLoadError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(/** @type {User | null } */ (null))
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const canEditUser = hasPermission(currentUser, 'user.update')
  const canChangeRole = hasPermission(currentUser, 'user.change_role')
  const canDeleteUser = hasPermission(currentUser, 'user.delete')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    async function loadUser() {
      if (!userId || accessToken === null) return
      try {
        setLoadError('')
        setIsLoading(true)
        const data = await getUser(userId, accessToken)
        setUser(data)
      } catch (e) {
        if (e instanceof AppError) {
          setLoadError(e.message)
        } else {
          setLoadError('Something went wrong. Please try again.')
        }
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [userId, accessToken])
  const handleModalClose = () => {
    setIsRoleModalOpen(false)
  }
  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false)
  }
  /** @param  {User} updatedUser */
  const handleRoleChange = (updatedUser) => {
    setUser(updatedUser)
  }
  function handleUserDeleted() {
    navigate('/users', { replace: true })
  }
  /**
   * @param {User} user
   */
  async function handleStatusChange(user) {
    try {
      if (accessToken === null) return

      const updatedUser = await changeUserStatus(
        user.id,
        !user.is_active,
        accessToken,
      )
      setUser(updatedUser)
      toast.success(
        user.is_active
          ? 'User deactivated successfully'
          : 'User activated successfully',
      )
    } catch (e) {
      if (e instanceof AppError) {
        toast.error(e.message)
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/users"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← Back to Users
        </Link>

        {isLoading && (
          <div className="flex items-center justify-center gap-3 p-8 text-sm text-slate-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
            <span>Loading user...</span>
          </div>
        )}
        {loadError && (
          <div className="p-8 text-center text-sm text-red-500">
            {loadError}
          </div>
        )}
        {!loadError && !isLoading && user == null && (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <p className="text-sm font-medium text-slate-700">
              User not found!
            </p>
          </div>
        )}
        {!loadError && !isLoading && user != null && (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  User Details
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage this user account.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {canEditUser && (
                  <Link
                    to={`/users/${user?.id}/edit`}
                    className="text-sm px-3 py-2 font-medium text-blue-600 hover:rounded-lg hover:bg-blue-600 hover:text-white"
                  >
                    Edit
                  </Link>
                )}
                {canChangeRole && (
                  <button
                    type="button"
                    onClick={() => setIsRoleModalOpen(true)}
                    className="text-sm  px-3 py-2 font-medium text-slate-600  hover:rounded-lg hover:bg-slate-600 hover:text-white"
                  >
                    Change Role
                  </button>
                )}
                {canEditUser && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(user)}
                    className={`w-22 text-sm  px-3 py-2 font-medium
                      hover:rounded-lg hover:text-white
                      ${
                        user.is_active
                          ? 'hover:bg-red-700 text-red-600'
                          : 'hover:bg-emerald-700 text-emerald-600'
                      }`}
                  >
                    {user.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                )}
                <div className="w-20">
                  {canDeleteUser && !user.is_active && (
                    <button
                      type="button"
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="text-sm px-3 py-2 font-medium text-red-600  hover:rounded-lg hover:bg-red-600 hover:text-white"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-700">
                  {`${user.first_name.charAt(0).toUpperCase()}${user.last_name.charAt(0).toUpperCase()}`}
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {`${user.first_name} ${user.last_name}`}
                  </h2>

                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 p-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  First name
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {user.first_name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Last name
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {user.last_name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email
                </p>
                <p className="mt-1 text-sm text-slate-700">{user.email}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Phone
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {user.phone ?? '—'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Role
                </p>

                <span className="mt-1 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {user.role.name}
                </span>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Status
                </p>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    user.is_active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            {isRoleModalOpen && (
              <ChangeRoleModal
                user={user}
                onClose={handleModalClose}
                onRoleChange={handleRoleChange}
              />
            )}
            {isDeleteModalOpen && (
              <DeleteUserModal
                user={user}
                onClose={handleDeleteModalClose}
                onDeleted={handleUserDeleted}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
export default UserDetailsPage
