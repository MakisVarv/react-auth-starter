function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>

          <p className="mt-2 text-sm text-slate-500">
            Welcome to the administrative area. Use the navigation to manage
            users, roles, and access control.
          </p>
        </div>
      </div>
    </div>
  )
}
export default DashboardPage
