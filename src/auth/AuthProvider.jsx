import { useState } from 'react'

import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  function login(userData) {
    setUser(userData)
  }

  function logout() {
    setUser(null)
  }

  const value = {
    user,
    isAuthLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
