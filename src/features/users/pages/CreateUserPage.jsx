import { useEffect, useState } from 'react'
/** @import {ChangeEvent, SubmitEvent } from 'react'*/
import { useNavigate } from 'react-router-dom'
import { AppError } from '../../../shared/api/errors'
import { toast } from 'sonner'
import { useAuth } from '../../auth/useAuth'
import { getRoles } from '../../roles/roleService'
import { createUser } from '../userService'
/** @import { Role } from '../types.js' */
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
  const { accessToken } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [roles, setRoles] = useState(/** @type {Role[]} */ ([]))
  const navigate = useNavigate()
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
    const { confirm_password, ...credentials } = form

    if (confirm_password !== credentials.password) {
      setError("Passwords don't match!")
      return
    }
    const payload = {
      ...credentials,
      phone: credentials.phone.trim() || null,
    }
    if (accessToken === null) return
    setIsSubmitting(true)
    try {
      await createUser(payload, accessToken)
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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg"
      >
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-slate-900">
          Create new User
        </h2>
        <label
          className="mb-1.5 block text-sm font-medium text-slate-700"
          htmlFor="first_name"
        >
          First Name
        </label>
        <input
          className="mb-3 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="First Name"
          name="first_name"
          id="first_name"
          value={form.first_name}
          onChange={handleChange}
          required
        />
        <label
          className="mb-1.5 block text-sm font-medium text-slate-700"
          htmlFor="last_name"
        >
          Last Name
        </label>
        <input
          className="mb-3 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="Last Name"
          name="last_name"
          id="last_name"
          value={form.last_name}
          onChange={handleChange}
          required
        />
        <label
          className="mb-1.5 block text-sm font-medium text-slate-700"
          htmlFor="email"
        >
          E-mail
        </label>
        <input
          className="mb-3 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="Email"
          name="email"
          id="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
        <label
          className="mb-1.5 block text-sm font-medium text-slate-700"
          htmlFor="phone"
        >
          Phone number
        </label>
        <input
          className="mb-3 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="Phone number"
          name="phone"
          id="phone"
          value={form.phone}
          onChange={handleChange}
          autoComplete="tel"
        />
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
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  )
}
export default CreateUserPage
