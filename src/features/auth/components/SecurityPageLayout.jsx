import { Outlet } from 'react-router-dom'

function SecurityPageLayout() {
  return (
    <div className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-10">
      <Outlet />
    </div>
  )
}
export default SecurityPageLayout
