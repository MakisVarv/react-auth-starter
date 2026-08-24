import { useState } from 'react'
/** @import { LoginCredentials, AuthContextValue, User } from './types.js' */
import { AuthContext } from './AuthContext'
import { login as loginRequest, logout as logoutRequest } from './authService'

/**
 * @param {{ children: import('react').ReactNode }} props
 */

export function AuthProvider({ children }) {
  const [user, setUser] = useState(/** @type {User | null} */ (null))
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [accessToken, setAccessToken] = useState(
    /** @type {string | null} */ (null),
  )

  /**
   * @param {LoginCredentials} credentials
   * @returns {Promise<User>}
   */

  async function login(credentials) {
    const data = await loginRequest(credentials)

    setAccessToken(data.access_token)
    setUser(data.user)

    return data.user
  }

  async function logout() {
    try {
      await logoutRequest()
    } finally {
      setUser(null)
      setAccessToken(null)
    }
  }
  /** @type {AuthContextValue} */
  const value = {
    user,
    isAuthLoading,
    login,
    logout,
    accessToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
