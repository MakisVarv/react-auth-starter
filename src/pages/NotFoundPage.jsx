import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
        <p className="text-sm font-semibold text-blue-600">404</p>

        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Page not found
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          The page you requested does not exist or may have been moved.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
