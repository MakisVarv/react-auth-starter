/** @import { Pagination } from '../../shared/api/types.js' */
/** @import { Role } from '../roles/types.js' */
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
 * @property {string} [sort]
 * @property {string} [role]
 * @property {boolean} [is_active]
 */
export {}
