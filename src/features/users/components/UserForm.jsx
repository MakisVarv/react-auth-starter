/** @import { ChangeEvent } from 'react' */

/**
 * @param {{
 *   form: {
 *     first_name: string,
 *     last_name: string,
 *     email: string,
 *     phone: string
 *   },
 *   onChange: (e: ChangeEvent<HTMLInputElement>) => void
 * }} props
 */
function UserForm({ form, onChange }) {
  return (
    <>
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
        value={form.first_name}
        onChange={onChange}
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
        value={form.last_name}
        onChange={onChange}
        required
      />

      <label
        className="mb-1.5 block text-sm font-medium text-slate-700"
        htmlFor="email"
      >
        E-mail
      </label>
      <input
        className="mb-3 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        placeholder="Email"
        name="email"
        id="email"
        type="email"
        value={form.email}
        onChange={onChange}
        required
        autoComplete="email"
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
        value={form.phone}
        onChange={onChange}
        autoComplete="tel"
      />
    </>
  )
}

export default UserForm
