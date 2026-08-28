import { useState, useEffect, useRef } from 'react'
/** @import { User } from '../users/types.js' */
/** @import { LoginCredentials, AuthContextValue, UpdateProfileData } from './types.js' */
import { AuthContext } from './AuthContext'
import {
  login as loginRequest,
  logout as logoutRequest,
  updateProfile as updateProfileRequest,
  refresh,
  getCurrentUser,
} from './authService'

/**
 * @param {{ children: import('react').ReactNode }} props
 */

export function AuthProvider({ children }) {
  const [user, setUser] = useState(/** @type {User | null} */ (null))
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [accessToken, setAccessToken] = useState(
    /** @type {string | null} */ (null),
  )
  const hasRestoredSession = useRef(false)

  useEffect(() => {
    if (hasRestoredSession.current) {
      return
    }
    hasRestoredSession.current = true
    async function restoreSession() {
      setIsAuthLoading(true)
      try {
        const token = await refresh()
        if (!token) return
        const user = await getCurrentUser(token)
        setUser(user)
        setAccessToken(token)
      } catch {
        setUser(null)
        setAccessToken(null)
      } finally {
        setIsAuthLoading(false)
      }
    }
    restoreSession()
  }, [])
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
  /**
   * @param {UpdateProfileData} data
   * @returns {Promise<User>}
   */
  async function updateProfile(data) {
    if (accessToken === null) {
      throw new Error('Not authenticated')
    }

    const updatedUser = await updateProfileRequest(data, accessToken)

    setUser(updatedUser)

    return updatedUser
  }
  /** @type {AuthContextValue} */
  const value = {
    user,
    isAuthLoading,
    updateProfile,
    login,
    logout,
    accessToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
