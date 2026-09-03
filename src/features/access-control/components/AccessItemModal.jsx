import { useState } from 'react'
/** @import {ChangeEvent } from 'react'*/
/**
 * @param {{
 *   title: string,
 *   initialValues: {
 *     name: string,
 *     description: string,
 *   },
 *   submitLabel: string,
 *   isSubmitting: boolean,
 *   onSubmit: (values: {name: string, description: string}) => Promise<void>,
 *   onClose: () => void,
 * }} props
 */
function AccessItemModal({
  title,
  initialValues,
  submitLabel,
  isSubmitting,
  onSubmit,
  onClose,
}) {
  const [form, setForm] = useState({
    name: initialValues.name ?? '',
    description: initialValues.description ?? '',
  })
  /** @param {ChangeEvent<HTMLInputElement>} e */
  function handleChange(e) {
    const { name, value } = e.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        </div>
        <div className="mt-6 space-y-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-700"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          ></input>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-slate-700"
          >
            Description
          </label>
          <input
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          ></input>
          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSubmit(form)}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AccessItemModal
