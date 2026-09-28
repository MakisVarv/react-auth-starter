/**
 * @param {{
 *   label: string,
 *   name: string,
 *   value: string,
 *   onChange: (event: import('react').ChangeEvent<HTMLInputElement>) => void,
 *   type?: string,
 *   placeholder?: string,
 *   required?: boolean,
 *   autoComplete?: string
 * }} props
 */
export function FormField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  autoComplete,
}) {
  return (
    <>
      <label
        className="mb-1.5 block text-sm font-medium text-slate-700"
        htmlFor={name}
      >
        {label}
      </label>
      <input
        className="mb-3 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        placeholder={placeholder}
        name={name}
        type={type}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
      />
    </>
  )
}
