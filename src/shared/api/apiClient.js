import axios from 'axios'
import { AppError } from './errors'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})
apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status ?? null
    const message =
      error.response?.data?.message ?? 'Unable to connect to the server.'
    const errors = error.response?.data?.errors ?? null

    throw new AppError(message, status, errors)
  },
)
export default apiClient
