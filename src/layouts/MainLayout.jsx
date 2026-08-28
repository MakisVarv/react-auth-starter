import { Outlet } from 'react-router-dom'
import NavBar from '../components/Navbar'
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
