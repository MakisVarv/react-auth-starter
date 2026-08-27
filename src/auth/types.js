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
 * @typedef {Object} Permission
 * @property {string} id
 * @property {string} name
 * @property {string} description
 */

/**
 * @typedef {Object} Role
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {Permission[]} permissions
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} first_name
 * @property {string} last_name
 * @property {string | null} phone
 * @property {boolean} is_active
 * @property {Role} role
 */

/**
 * @typedef {Object} LoginResponse
 * @property {string} access_token
 * @property {User} user
 */

/**
 * @typedef {Object} AuthContextValue
 * @property {User | null} user
 * @property {string | null} accessToken
 * @property {boolean} isAuthLoading
 * @property {(credentials: LoginCredentials) => Promise<User>} login
 * @property {() => Promise<void>} logout
 */

export {}
