import apiClient from '../../shared/api/apiClient'
/** @import { Role } from './types.js' */

/**
 * @param {string} accessToken
 * @returns {Promise<Role[]>}
 */
export async function getRoles(accessToken) {
  const response = await apiClient.get('/roles/', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return response.data
}

/**
 * @param {string} roleId
 * @param {string} accessToken
 * @returns {Promise<Role>}
 */
export async function getRole(roleId, accessToken) {
  const response = await apiClient.get(`/roles/${roleId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return response.data
}
/**
 * @param {{
 *   name: string,
 *   description: string,
 *   level: number
 * }} payload
 * @param {string} accessToken
 * @returns {Promise<Role>}
 */
export async function createRole(payload, accessToken) {
  const response = await apiClient.post('/roles/', payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}
/**
 * @param {string} roleId
 * @param {{
 *   name?: string,
 *   description?: string,
 *   level?: number
 * }} payload
 * @param {string} accessToken
 * @returns {Promise<Role>}
 */
export async function editRole(roleId, payload, accessToken) {
  const response = await apiClient.patch(`/roles/${roleId}`, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}
/**
 * @param {string} roleId
 * @param {string} permissionId
 * @param {string} accessToken
 * @returns {Promise<Role>}
 */
export async function addPermissionToRole(roleId, permissionId, accessToken) {
  const response = await apiClient.post(
    `/roles/${roleId}/permissions`,
    { permission_id: permissionId },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
  return response.data
}
/**
 * @param {string} roleId
 * @param {string} permissionId
 * @param {string} accessToken
 * @returns {Promise<Role>}
 */
export async function removePermissionFromRole(
  roleId,
  permissionId,
  accessToken,
) {
  const response = await apiClient.delete(
    `/roles/${roleId}/permissions/${permissionId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
  return response.data
}
/**
 * @param {string} roleId
 * @param {string} accessToken
 * @returns {Promise<void>}
 */
export async function deleteRole(roleId, accessToken) {
  await apiClient.delete(`/roles/${roleId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}
