import { useState } from 'react'
/** @import {ChangeEvent, SubmitEvent } from 'react'*/
import { Link, useNavigate } from 'react-router-dom'
import { AppError } from '../../../shared/api/errors'
import { register } from '../authService.js'
import { toast } from 'sonner'
import { FormField } from '../../../shared/components/FormField'
import { PasswordField } from '../../../shared/components/PasswordField'
/** @import { RegisterCredentials } from '../types.js' */
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
  /** @param {ChangeEvent<HTMLInputElement>} e */
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
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg"
    >
      <h2 className="mb-6 text-2xl font-semibold tracking-tight text-slate-900">
        Register
      </h2>
      <FormField
        name="first_name"
        label="First Name"
        placeholder="First Name"
        value={form.first_name}
        required={true}
        onChange={handleChange}
      />
      <FormField
        name="last_name"
        label="Last Name"
        placeholder="Last Name"
        value={form.last_name}
        required={true}
        onChange={handleChange}
      />
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
      <FormField
        name="phone"
        label="Phone number"
        placeholder="Phone number"
        value={form.phone}
        onChange={handleChange}
        autoComplete="tel"
      />
      <FormField
        name="phone"
        label="Phone number"
        placeholder="Phone number"
        value={form.phone}
        onChange={handleChange}
        autoComplete="tel"
      />
      <PasswordField
        label="Password"
        placeholder="Password"
        name="password"
        onChange={handleChange}
        required={true}
        value={form.password}
        autoComplete="new-password"
      />
      <PasswordField
        label="Confirm Password"
        placeholder="Confirm Password"
        name="confirm_password"
        onChange={handleChange}
        required={true}
        value={form.confirm_password}
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
  )
}
export default RegisterPage
