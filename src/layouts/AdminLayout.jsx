import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar'

function AdminLayout() {
  return (
    <div className="flex flex-1">
      <Sidebar />

      <div className="flex min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}
export default AdminLayout
