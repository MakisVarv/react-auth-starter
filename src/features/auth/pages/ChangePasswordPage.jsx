import { useNavigate } from 'react-router-dom'
import { FormError } from '../../../shared/components/form/FormError'
import { useState } from 'react'
import { toast } from 'sonner'
import { AppError } from '../../../shared/api/errors'
import { PasswordField } from '../../../shared/components/form/PasswordField'
import { changePassword, reauthenticate } from '../authService'
import { useAuth } from '../hooks/useAuth'
/** @import {ChangeEvent, SubmitEvent } from 'react'*/
export function ChangePasswordPage() {
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { accessToken, clearSession } = useAuth()
  if (!accessToken) return null
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
    const { current_password, confirm_password, new_password } = form

    if (confirm_password !== new_password) {
      setError("Passwords don't match!")
      return
    }
    setIsSubmitting(true)
    try {
      const reauthData = await reauthenticate(accessToken, current_password)

      const freshAccessToken = reauthData.access_token
      const data = await changePassword(freshAccessToken, new_password)
      toast.success(data.message)
      clearSession()
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
        Change password
      </h2>
      <PasswordField
        label="Current Password"
        placeholder="Current Password"
        name="current_password"
        onChange={handleChange}
        required={true}
        value={form.current_password}
        autoComplete="current-password"
      />
      <PasswordField
        label="New Password"
        placeholder="New Password"
        name="new_password"
        onChange={handleChange}
        required={true}
        value={form.new_password}
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
      <FormError error={error} />
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Changing...' : 'Change Password'}
      </button>
    </form>
  )
}
