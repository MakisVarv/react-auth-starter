/** @import { User } from '../users/types.js' */

/**
 * @param {User | null} user
 * @param {string} permissionName
 * @returns {boolean}
 */

function hasPermission(user, permissionName) {
  if (user === null) return false
  return user.role.permissions.some((p) => p.name === permissionName)
}
export default hasPermission
