import { toast } from 'sonner'
import { AppError } from '../../../shared/api/errors'
/** @import {ChangeEvent, SubmitEvent } from 'react'*/
import { useState } from 'react'
import { FormField } from '../../../shared/components/form/FormField'
export function ResetPasswordPage() {
  const [form, setForm] = useState({
    email: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  /** @param {SubmitEvent<HTMLFormElement>} e */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
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
    return (
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg"
      >
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-slate-900">
          Reset password
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
      </form>
    )
  }
}
