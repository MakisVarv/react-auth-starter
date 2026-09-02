import apiClient from '../../shared/api/apiClient'
/** @import { Permission } from './types.js' */

/**
 * @param {string} accessToken
 * @returns {Promise<Permission[]>}
 */
export async function getPermissions(accessToken) {
  const response = await apiClient.get('/permissions/', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return response.data
}

/**
 * @param {string} permissionId
 * @param {string} accessToken
 * @returns {Promise<Permission>}
 */
export async function getPermission(permissionId, accessToken) {
  const response = await apiClient.get(`/permissions/${permissionId}`, {
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
 * }} payload
 * @param {string} accessToken
 * @returns {Promise<Permission>}
 */
export async function createPermission(payload, accessToken) {
  const response = await apiClient.post('/permissions/', payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}
/**
 * @param {string} permissionId
 * @param {{
 *   name: string,
 *   description: string,
 * }} payload
 * @param {string} accessToken
 * @returns {Promise<Permission>}
 */
export async function editPermission(permissionId, payload, accessToken) {
  const response = await apiClient.patch(
    `/permissions/${permissionId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
  return response.data
}
/**
 * @param {string} permissionId
 * @param {string} accessToken
 * @returns {Promise<void>}
 */
export async function deletePermission(permissionId, accessToken) {
  await apiClient.delete(`/permissions/${permissionId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}
