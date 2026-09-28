import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
/**
 * @param {{
 *   label: string,
 *   name: string,
 *   value: string,
 *   onChange: (event: import('react').ChangeEvent<HTMLInputElement>) => void,
 *   placeholder?: string,
 *   required?: boolean,
 *   autoComplete?: string
 * }} props
 */
export function PasswordField({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
}) {
  const [isVisible, setIsVisible] = useState(false)
  return (
    <>
      <label
        className="mb-1.5 block text-sm font-medium text-slate-700"
        htmlFor={name}
      >
        {label}
      </label>
      <div className="relative">
        <input
          className="mb-3 w-full pl-3 pr-11 rounded-lg border border-slate-300 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder={placeholder}
          name={name}
          type={isVisible ? 'text' : 'password'}
          id={name}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </>
  )
}
