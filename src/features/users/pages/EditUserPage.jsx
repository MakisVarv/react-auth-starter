import { useEffect, useState } from 'react'
/** @import {ChangeEvent, SubmitEvent } from 'react'*/
import UserForm from '../components/UserForm.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { AppError } from '../../../shared/api/errors'
import { toast } from 'sonner'
import { useAuth } from '../../auth/useAuth'
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
  const { accessToken } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadUser() {
      if (!userId || accessToken === null) return
      try {
        setIsLoading(true)
        const data = await getUser(userId, accessToken)
        setForm({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone ?? '',
        })
      } catch (e) {
        if (e instanceof AppError) {
          setLoadError(e.message)
        } else {
          setLoadError('Something went wrong. Please try again.')
        }
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [userId, accessToken])
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
    if (accessToken === null) return
    if (!userId) return
    setIsSubmitting(true)
    try {
      await editUser(userId, payload, accessToken)
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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <Link
          to="/users"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← Back to Users
        </Link>
        {isLoading && (
          <div className="flex items-center justify-center gap-3 p-8 text-sm text-slate-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
            <span>Loading user</span>
          </div>
        )}
        {loadError && (
          <div className="p-8 text-center text-sm text-red-500">
            {loadError}
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
