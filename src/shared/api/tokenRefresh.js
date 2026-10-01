import axios from 'axios'
import { getCookie } from '../utils/cookies'

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

/**
 * @returns {Promise<string | null>}
 */
export async function refreshAccessToken() {
  const csrfToken = getCookie('csrf_refresh_token')

  if (csrfToken == null) {
    return null
  }

  const response = await refreshClient.post(
    '/auth/refresh',
    {},
    {
      headers: {
        'X-CSRF-TOKEN': csrfToken,
      },
    },
  )

  return response.data.access_token
}
