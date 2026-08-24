/** @import { AuthContextValue } from './types.js' */
import { createContext } from 'react'

export const AuthContext = createContext(
  /** @type {AuthContextValue | null} */ (null),
)
