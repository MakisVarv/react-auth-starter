import { Outlet } from 'react-router-dom'
import Sidebar from '../shared/components/Sidebar'

function AdminLayout() {
  return (
    <div>
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
export default AdminLayout
