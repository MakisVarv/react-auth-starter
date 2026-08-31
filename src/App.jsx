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
import UsersPage from './features/users/pages/UsersPage'
import CreateUserPage from './features/users/pages/CreateUserPage'
import EditUserPage from './features/users/pages/EditUserPage'
import UserDetailsPage from './features/users/pages/UserDetailsPage'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
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
          path="/users"
          element={
            <PermissionRoute permission="user.read">
              <UsersPage />
            </PermissionRoute>
          }
        />
        <Route
          path="/users/new"
          element={
            <PermissionRoute permission="user.create">
              <CreateUserPage />
            </PermissionRoute>
          }
        />
        <Route
          path="/users/:userId/edit"
          element={
            <PermissionRoute permission="user.update">
              <EditUserPage />
            </PermissionRoute>
          }
        />
        <Route
          path="/users/:userId"
          element={
            <PermissionRoute permission="user.read">
              <UserDetailsPage />
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
