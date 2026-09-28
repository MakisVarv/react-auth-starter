/**
 * @param {{
 *   error: string|null,
 * }}props
 * */
export function FormError({ error }) {
  if (!error) return null

  return (
    <p
      role="alert"
      className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
    >
      {error}
    </p>
  )
}
