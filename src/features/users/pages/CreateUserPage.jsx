import { useEffect, useState } from 'react'
/** @import {ChangeEvent, SubmitEvent } from 'react'*/
import { Link, useNavigate } from 'react-router-dom'
import { AppError } from '../../../shared/api/errors'
import { toast } from 'sonner'
import { useAuth } from '../../auth/hooks/useAuth'
import { getRoles } from '../../access-control/services/roleService'
import { createUser } from '../userService'
import UserForm from '../components/UserForm.jsx'
import { canAssignRole } from '../../access-control/authorization'
/** @import { Role } from '../../access-control/types' */
function CreateUserPage() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
    role_id: '',
  })
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [rolesError, setRolesError] = useState('')
  const [isLoadingRoles, setIsLoadingRoles] = useState(false)
  const [rolesRefreshKey, setRolesRefreshKey] = useState(0)
  const [roles, setRoles] = useState(/** @type {Role[]} */ ([]))
  const navigate = useNavigate()
  useEffect(() => {
    async function loadRoles() {
      try {
        setRolesError('')
        const data = await getRoles()
        setRoles(data)
      } catch (e) {
        if (e instanceof AppError) {
          setRolesError(e.message)
        } else {
          setRolesError('Could not load roles. Please try again.')
        }
      } finally {
        setIsLoadingRoles(false)
      }
    }
    loadRoles()
  }, [rolesRefreshKey])
  if (user === null) return
  const assignableRoles = roles.filter((role) => canAssignRole(user, role))
  /** @param {ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>} e */
  function handleChange(e) {
    const { name, value } = e.target

    setError('')

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }
  /** @param {SubmitEvent<HTMLFormElement>} e */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const { confirm_password, ...userDetails } = form

    if (confirm_password !== userDetails.password) {
      setError("Passwords don't match!")
      return
    }
    const payload = {
      ...userDetails,
      phone: userDetails.phone.trim() || null,
    }
    setIsSubmitting(true)
    try {
      await createUser(payload)
      toast.success('User created successfully.')
      navigate('/users', { replace: true })
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
  return (
    <div className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md">
        <Link
          to="/users"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← Back to Users
        </Link>
        {isLoadingRoles && (
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
        {!isLoadingRoles && !rolesError && (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg"
          >
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-slate-900">
              Create new User
            </h2>
            <UserForm form={form} onChange={handleChange} />
            <label
              className="mb-1.5 block text-sm font-medium text-slate-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <label
              className="mb-1.5 block text-sm font-medium text-slate-700"
              htmlFor="confirm_password"
            >
              Confirm Password
            </label>
            <input
              type="password"
              className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Confirm Password"
              name="confirm_password"
              id="confirm_password"
              value={form.confirm_password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <label
              className="mb-1.5 block text-sm font-medium text-slate-700"
              htmlFor="role_id"
            >
              Role
            </label>
            <select
              className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              id="role_id"
              name="role_id"
              value={form.role_id}
              onChange={handleChange}
              required
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
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
export default CreateUserPage
