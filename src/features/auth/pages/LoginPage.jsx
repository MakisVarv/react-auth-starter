import { useState } from 'react'
/** @import {ChangeEvent, SubmitEvent } from 'react'*/
import { useAuth } from '../hooks/useAuth'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AppError } from '../../../shared/api/errors'
import { toast } from 'sonner'
import { FormField } from '../../../shared/components/form/FormField'
import { PasswordField } from '../../../shared/components/form/PasswordField'
import { FormError } from '../../../shared/components/form/FormError'

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
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg"
    >
      <h2 className="mb-6 text-2xl font-semibold tracking-tight text-slate-900">
        Login
      </h2>
      <FormField
        name="email"
        label="E-mail"
        placeholder="Email"
        type="email"
        value={form.email}
        required={true}
        onChange={handleChange}
        autoComplete="email"
      />
      <PasswordField
        label="Password"
        placeholder="Password"
        name="password"
        onChange={handleChange}
        required={true}
        value={form.password}
        autoComplete="current-password"
      />
      <FormError error={error} />
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
      <Link
        to="/forgot-password"
        className="mt-3 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-center font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
      >
        Forgot your password?
      </Link>
    </form>
  )
}

export default LoginPage
