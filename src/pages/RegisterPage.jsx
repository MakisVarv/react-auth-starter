import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppError } from '../api/errors'
import { register } from '../auth/authService.js'
import { toast } from 'sonner'
/** @import { RegisterCredentials } from '../auth/types.js' */
function RegisterPage() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  /** @param {import('react').ChangeEvent<HTMLInputElement>} e */
  function handleChange(e) {
    const { name, value } = e.target

    setError('')

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  /** @param {import('react').SubmitEvent<HTMLFormElement>} e */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const { confirm_password, ...credentials } = form

    if (confirm_password !== credentials.password) {
      setError("Passwords don't match!")
      return
    }
    /** @type {RegisterCredentials} */
    const payload = {
      ...credentials,
      phone: credentials.phone.trim() || null,
    }
    setIsSubmitting(true)
    try {
      await register(payload)
      toast.success('Account created successfully.')
      navigate('/login', { replace: true })
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
          Register
        </h2>
        <label className="mb-4 w-full text-sm" htmlFor="first_name">
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
        <label className="mb-4 w-full text-sm" htmlFor="last_name">
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
        <label className="mb-4 w-full text-sm" htmlFor="email">
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
        <label className="mb-4 w-full text-sm" htmlFor="phone">
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
        <label className="mb-4 w-full text-sm" htmlFor="password">
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
        <label className="mb-4 w-full text-sm" htmlFor="confirm_password">
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
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
        <Link
          className="mt-3 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-center font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
          to="/login"
        >
          Already have an account?
        </Link>
      </form>
    </div>
  )
}
