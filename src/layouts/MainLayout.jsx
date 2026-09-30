import { Outlet } from 'react-router-dom'
import NavBar from './components/Navbar'
function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <main className="flex flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
