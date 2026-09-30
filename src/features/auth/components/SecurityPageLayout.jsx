import { Outlet } from 'react-router-dom'

function SecurityPageLayout() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-10">
      <Outlet />
    </div>
  )
}
export default SecurityPageLayout
