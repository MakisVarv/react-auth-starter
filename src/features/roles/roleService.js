import apiClient from '../../shared/api/apiClient'
/** @import { Role } from '../users/types.js' */

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
