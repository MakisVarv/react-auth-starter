import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import LoginPage from './features/auth/pages/LoginPage'
import ProtectedRoute from './features/auth/guards/ProtectedRoute'
import GuestOnlyRoute from './features/auth/guards/GuestOnlyRoute'
import DashboardPage from './features/dashboard/DashboardPage'
import PermissionRoute from './features/auth/guards/PermissionRoute'
import RegisterPage from './features/auth/pages/RegisterPage'
import ProfilePage from './features/account/pages/ProfilePage'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PermissionRoute permission="dashboard.read">
              <DashboardPage />
            </PermissionRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestOnlyRoute>
              <LoginPage />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestOnlyRoute>
              <RegisterPage />
            </GuestOnlyRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
