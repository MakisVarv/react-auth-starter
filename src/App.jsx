import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './auth/ProtectedRoute'
import GuestOnlyRoute from './auth/GuestOnlyRoute'

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
          path="/login"
          element={
            <GuestOnlyRoute>
              <LoginPage />
            </GuestOnlyRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
