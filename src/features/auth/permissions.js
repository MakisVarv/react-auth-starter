/** @import { User } from '../users/types.js' */

/**
 * @param {User | null} user
 * @param {string} permissionName
 * @returns {boolean}
 */

export function hasPermission(user, permissionName) {
  if (user === null) return false
  return user.role.permissions.some((p) => p.name === permissionName)
}
/**
 * @param {User | null} user
 * @param {string[]} permissions
 * @returns {boolean}
 */
export function hasAllPermissions(user, permissions) {
  return permissions.every((permission) => hasPermission(user, permission))
}
