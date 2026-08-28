/** @import { Pagination } from '../../shared/api/types.js' */
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
 * @typedef {Object} UsersResponse
 * @property {User[]} items
 * @property {Pagination} pagination
 */

/**
 * @typedef {Object} UsersQueryParams
 * @property {number} [page]
 * @property {number} [page_size]
 * @property {string} [search]
 * @property {string} [role]
 * @property {boolean} [is_active]
 */
export {}
