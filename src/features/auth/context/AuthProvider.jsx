import { useState, useEffect, useRef, useCallback } from 'react'
/** @import { User } from '../../users/types.js' */
/** @import { LoginCredentials, AuthContextValue, UpdateProfileData } from '../types.js' */
import { AuthContext } from './AuthContext'
import {
  login as loginRequest,
  logout as logoutRequest,
  updateProfile as updateProfileRequest,
  refresh,
  getCurrentUser,
} from '../authService'
import {
  setAccessToken,
  clearAccessToken,
} from '../../../shared/api/accessTokenStore'
import { subscribeToSessionExpired } from '../../../shared/auth/sessionEvents'
/**
 * @param {{ children: import('react').ReactNode }} props
 */

export function AuthProvider({ children }) {
  const [user, setUser] = useState(/** @type {User | null} */ (null))
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  const hasRestoredSession = useRef(false)

  const clearSession = useCallback(() => {
    setUser(null)
    clearAccessToken()
  }, [])
  useEffect(() => {
    return subscribeToSessionExpired(clearSession)
  }, [clearSession])
  useEffect(() => {
    if (hasRestoredSession.current) {
      return
    }
    hasRestoredSession.current = true
    async function restoreSession() {
      setIsAuthLoading(true)
      try {
        const token = await refresh()

        if (!token) {
          clearAccessToken()
          return
        }

        setAccessToken(token)

        const user = await getCurrentUser()

        setUser(user)
      } catch {
        setUser(null)
        clearAccessToken()
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
      clearSession()
    }
  }
  /**
   * @param {UpdateProfileData} data
   * @returns {Promise<User>}
   */
  async function updateProfile(data) {
    const updatedUser = await updateProfileRequest(data)

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
    clearSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
