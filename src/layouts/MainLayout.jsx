import { Outlet } from 'react-router-dom'
import NavBar from '../shared/components/Navbar'
function MainLayout() {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default MainLayout
