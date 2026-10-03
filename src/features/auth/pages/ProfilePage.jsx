import { useState } from 'react'
/** @import {ChangeEvent, SubmitEvent } from 'react'*/
import { useAuth } from '../hooks/useAuth'
import { toast } from 'sonner'
import { AppError } from '../../../shared/api/errors'
import { Link } from 'react-router-dom'
/** @import { UpdateProfileData } from '../types.js' */
function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({
    first_name: user?.first_name ?? '',
    last_name: user?.last_name ?? '',
    phone: user?.phone ?? '',
  })

  const [edit, setEdit] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  /** @param {ChangeEvent<HTMLInputElement>} e */
  function handleChange(e) {
    const { name, value } = e.target

    setError('')

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }
  function handleCancel() {
    setForm({
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      phone: user?.phone ?? '',
    })

    setError('')
    setEdit(false)
  }

  /** @param {SubmitEvent<HTMLFormElement>} e */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    /** @type {UpdateProfileData} */
    const payload = {
      ...form,
      phone: form.phone.trim() || null,
    }
    try {
      await updateProfile(payload)
      toast.success('Account updated successfully.')
      setEdit(false)
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
    <div className="flex-1 bg-slate-50 px-4 py-10">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[2fr_1fr]">
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-lg"
        >
          <h2 className="mb-6 text-2xl font-semibold tracking-tight text-slate-900">
            Account Details
          </h2>
          <div className="mb-6">
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              {user?.role.name}
            </span>
          </div>
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
            readOnly={!edit}
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
            readOnly={!edit}
            value={form.last_name}
            onChange={handleChange}
            required
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
            readOnly={!edit}
            value={form.phone}
            onChange={handleChange}
            autoComplete="tel"
          />
          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <div className="mt-6 flex justify-end gap-3">
            {!edit ? (
              <button
                type="button"
                onClick={() => setEdit(true)}
                className="rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCancel}
                  className="disabled:cursor-not-allowed disabled:opacity-50 rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </>
            )}
          </div>
        </form>
        <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            Security
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage your account credentials and active sessions.
          </p>

          <div className="mt-6 space-y-3">
            <Link
              to="/change-email"
              className="block rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <p className="font-medium text-slate-900">Change email</p>
              <p className="mt-1 text-sm text-slate-500">
                Update the email address used for your account.
              </p>
            </Link>

            <Link
              to="/change-password"
              className="block rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <p className="font-medium text-slate-900">Change password</p>
              <p className="mt-1 text-sm text-slate-500">
                Replace your current account password.
              </p>
            </Link>

            <Link
              to="/logout-all"
              className="block rounded-xl border border-red-200 p-4 transition hover:bg-red-50"
            >
              <p className="font-medium text-red-700">
                Log out from all sessions
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Sign out this account from every active device.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
export default ProfilePage
