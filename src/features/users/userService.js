import apiClient from '../../shared/api/apiClient'
/** @import { UsersQueryParams, UsersResponse } from './types.js' */

/**
 * @param {UsersQueryParams} params
 * @param {string} accessToken
 * @returns {Promise<UsersResponse>}
 */

export async function getUsers(params, accessToken) {
  const response = await apiClient.get('/users/', {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}
