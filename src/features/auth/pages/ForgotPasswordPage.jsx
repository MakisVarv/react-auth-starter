import { toast } from 'sonner'
import { AppError } from '../../../shared/api/errors'
/** @import {ChangeEvent, SubmitEvent } from 'react'*/
import { useState } from 'react'
import { FormField } from '../../../shared/components/form/FormField'
import { FormError } from '../../../shared/components/form/FormError'
import { forgotPassword } from '../authService'
import { FormSuccess } from '../../../shared/components/form/FormSuccess'
import { Link } from 'react-router-dom'
export function ForgotPasswordPage() {
  const [form, setForm] = useState({
    email: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  /** @param {SubmitEvent<HTMLFormElement>} e */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const data = await forgotPassword(form.email)
      setSuccessMessage(data.message)
      setIsSubmitted(true)
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
  /** @param {ChangeEvent<HTMLInputElement>} e */
  function handleChange(e) {
    const { name, value } = e.target

    setError('')

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }
  if (isSubmitted) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight text-slate-900">
          Check your email
        </h2>

        <FormSuccess message={successMessage} />

        <Link
          to="/login"
          className="mt-6 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-center font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
        >
          Back to login
        </Link>
      </div>
    )
  }
  return (
    <div className="w-full max-w-md">
      <Link
        to="/login"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        ← Back to Profile
      </Link>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg"
      >
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-slate-900">
          Forgot password?
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
        <FormError error={error} />
        <button
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending ...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  )
}
