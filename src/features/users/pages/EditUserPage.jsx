import { useEffect, useState } from 'react'
/** @import {ChangeEvent, SubmitEvent } from 'react'*/
import UserForm from '../components/UserForm.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { AppError } from '../../../shared/api/errors'
import { toast } from 'sonner'
import { useParams } from 'react-router-dom'
import { editUser, getUser } from '../userService'
function EditUserPage() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  })
  const { userId } = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [userRefreshKey, setUserRefreshKey] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const controller = new AbortController()
    async function loadUser() {
      if (!userId) return
      try {
        setLoadError('')
        setIsLoading(true)
        const data = await getUser(userId, controller.signal)
        setForm({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone ?? '',
        })
      } catch (e) {
        if (controller.signal.aborted) {
          return
        }
        if (e instanceof AppError) {
          setLoadError(e.message)
        } else {
          setLoadError('Something went wrong. Please try again.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }
    loadUser()
    return () => {
      controller.abort()
    }
  }, [userId, userRefreshKey])
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

    const payload = {
      ...form,
      phone: form.phone.trim() || null,
    }
    if (!userId) return
    setIsSubmitting(true)
    try {
      await editUser(userId, payload)
      toast.success('User updated successfully.')
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
        {isLoading && (
          <div
            role="status"
            className="flex items-center justify-center gap-3 p-8 text-sm text-slate-500"
          >
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
            <span>Loading user...</span>
          </div>
        )}
        {loadError && (
          <div
            role="alert"
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-6 text-center"
          >
            <p className="text-sm font-medium text-red-700">{loadError}</p>

            <button
              type="button"
              onClick={() => setUserRefreshKey((current) => current + 1)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              Try again
            </button>
          </div>
        )}
        {!loadError && !isLoading && (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg"
          >
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-slate-900">
              Edit User
            </h2>
            <UserForm form={form} onChange={handleChange} />
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
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
export default EditUserPage
