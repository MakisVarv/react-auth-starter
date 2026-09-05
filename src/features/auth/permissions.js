/** @import { User } from '../users/types.js' */
/** @import { Role } from '../roles/types.js' */

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
export const MAX_ROLE_LEVEL = 100
export const PROTECTED_ROLE_NAMES = ['Admin', 'User']

/**
 * @param {Role} role
 * @returns {boolean}
 */
export function isProtectedRole(role) {
  return PROTECTED_ROLE_NAMES.includes(role.name)
}

/**
 * @param {User} actor
 * @param {User} target
 * @returns {boolean}
 */
export function canManageUser(actor, target) {
  if (actor.role.level === MAX_ROLE_LEVEL) return true

  return actor.role.level > target.role.level
}

/**
 * @param {User} actor
 * @param {Role} role
 * @returns {boolean}
 */
export function canAssignRole(actor, role) {
  if (actor.role.level === MAX_ROLE_LEVEL) return true

  return actor.role.level > role.level
}

/**
 * @param {User} actor
 * @param {Role} role
 * @returns {boolean}
 */
export function canManageRole(actor, role) {
  if (actor.role.level === MAX_ROLE_LEVEL) return true

  return actor.role.level > role.level
}
