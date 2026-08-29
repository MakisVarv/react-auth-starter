import { useState } from 'react'
/** @import {ChangeEvent, SubmitEvent } from 'react'*/
import { useAuth } from '../useAuth'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AppError } from '../../../shared/api/errors'
import { toast } from 'sonner'

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const location = useLocation()
  const from = location.state?.from
  /** @param {SubmitEvent<HTMLFormElement>} e */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await login(form)
      navigate(from ?? '/', { replace: true })
    } catch (e) {
      if (e instanceof AppError) {
        if (e.status === 401) {
          setError(e.message)
        } else {
          toast.error(e.message)
        }
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  /** @param {ChangeEvent<HTMLInputElement>} e */
  function handleChange(e) {
    const { name, value } = e.target

    setError('')

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg"
      >
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-slate-900">
          Login
        </h2>
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
          autoComplete="current-password"
        />
        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <button
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in ...' : 'Login'}
        </button>
        <Link
          to="/register"
          className="mt-3 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-center font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
        >
          Register
        </Link>
      </form>
    </div>
  )
}

export default LoginPage
