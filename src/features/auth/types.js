/** @import { User } from '../users/types.js' */
/**
 * @typedef {Object} LoginCredentials
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} RegisterCredentials
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} email
 * @property {string} password
 * @property {string | null} phone
 */

/**
 * @typedef {Object} UpdateProfileData
 * @property {string} first_name
 * @property {string} last_name
 * @property {string | null} phone
 */

/**
 * @typedef {Object} LoginResponse
 * @property {string} access_token
 * @property {User} user
 */

/**
 * @typedef {Object} AuthContextValue
 * @property {(data: UpdateProfileData) => Promise<User>} updateProfile
 * @property {User | null} user
 * @property {string | null} accessToken
 * @property {boolean} isAuthLoading
 * @property {(credentials: LoginCredentials) => Promise<User>} login
 * @property {() => Promise<void>} logout
 */

export {}
