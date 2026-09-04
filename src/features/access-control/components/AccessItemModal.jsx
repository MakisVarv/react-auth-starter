import { useState } from 'react'
import { MAX_ROLE_LEVEL } from '../../auth/permissions.js'
/** @import {ChangeEvent,SubmitEvent } from 'react'*/
/** @import {User} from '../../users/types.js'*/
/** @import {Role} from '../../roles/types.js'*/
/** @import {Permission} from '../../permissions/types.js'*/
/**
 * @param {{
 *  actor:User,
 *   action: string,
 *   type:'Role' | 'Permission'
 *   item: Role | Permission | null,
 *   isSubmitting: boolean,
 *   onSubmit: (values:  {name: string,description: string,level?: number}) => Promise<void>,
 *   onClose: () => void,
 * }} props
 */
function AccessItemModal({
  actor,
  action,
  type,
  item,
  isSubmitting,
  onSubmit,
  onClose,
}) {
  const [form, setForm] = useState({
    name: item?.name ?? '',
    description: item?.description ?? '',
    level: item && 'level' in item ? String(item.level) : '',
  })
  /** @param {ChangeEvent<HTMLInputElement>} e */
  function handleChange(e) {
    const { name, value } = e.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }
  const maxRoleLevel =
    actor.role.level === MAX_ROLE_LEVEL ? MAX_ROLE_LEVEL : actor.role.level - 1
  const numericLevel = Number(form.level)

  const isLevelValid =
    type !== 'Role' ||
    (form.level !== '' &&
      Number.isInteger(numericLevel) &&
      numericLevel >= 1 &&
      numericLevel <= maxRoleLevel)

  const isFormValid = form.name.trim() !== '' && isLevelValid
  /** @param {SubmitEvent<HTMLFormElement>} e */
  function handleSubmit(e) {
    e.preventDefault()
    if (type === 'Role') {
      onSubmit({
        name: form.name.trim(),
        description: form.description,
        level: Number(form.level),
      })
      return
    }

    onSubmit({
      name: form.name,
      description: form.description,
    })
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{`${action} ${type}`}</h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <p className="text-xs text-slate-500">* Required fields</p>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-700"
          >
            Name<span aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            required
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
          {type === 'Role' && (
            <>
              <label
                htmlFor="level"
                className="block text-sm font-medium text-slate-700"
              >
                Level<span aria-hidden="true">*</span>
              </label>
              <input
                id="level"
                type="number"
                min={1}
                max={maxRoleLevel}
                name="level"
                value={form.level}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              ></input>
              <p className="mt-1 text-xs text-slate-500">
                Enter a level from 1 to {maxRoleLevel}.
              </p>
            </>
          )}
          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting || !isFormValid}
            >
              {action === 'Create' ? action : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default AccessItemModal
