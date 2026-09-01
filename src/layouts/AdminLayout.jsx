import { Outlet } from 'react-router-dom'
import Sidebar from '../shared/components/Sidebar'

function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  )
}
export default AdminLayout
