import { Link } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth.js'

function HomePage() {
  const { user } = useAuth()

  const features = [
    {
      title: 'Authentication',
      description:
        'Secure login, registration, session handling, and protected application areas.',
    },
    {
      title: 'Role-Based Access',
      description:
        'Permission-aware routes, navigation, and actions backed by server-side authorization.',
    },
    {
      title: 'User Management',
      description:
        'Create, update, activate, deactivate, assign roles, and manage user accounts.',
    },
    {
      title: 'API-Ready Architecture',
      description:
        'A clean separation between frontend and backend designed for scalable application development.',
    },
  ]

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              Production-oriented starter
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Build on a solid foundation
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              A reusable application foundation with authentication, role-based
              access control, user management, and a clean frontend-backend
              architecture.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {user ? (
                <Link
                  to="/dashboard"
                  className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold text-slate-900">
              Core capabilities
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Common application concerns already organized into a reusable
              foundation.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">
                  {feature.title.charAt(0)}
                </div>

                <h3 className="font-semibold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10">
          <h2 className="text-2xl font-semibold text-slate-900">
            Ready to get started?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Use the existing application foundation and focus on building the
            features that make your product unique.
          </p>

          <div className="mt-6">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Open Dashboard
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-flex rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
