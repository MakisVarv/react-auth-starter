import { Link, Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link> <Link to="/login">Login</Link>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;
