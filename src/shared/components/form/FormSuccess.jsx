/**
 * @param {{
 *   message: string | null,
 * }}props
 * */
export function FormSuccess({ message }) {
  if (!message) return null

  return (
    <p
      role="status"
      className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
    >
      {message}
    </p>
  )
}
