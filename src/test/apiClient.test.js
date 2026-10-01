import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import apiClient from '../shared/api/apiClient'
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from '../shared/api/accessTokenStore'
import { refreshAccessToken } from '../shared/api/tokenRefresh'

vi.mock('../shared/api/tokenRefresh', () => ({
  refreshAccessToken: vi.fn(),
}))

describe('apiClient transparent refresh', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearAccessToken()
  })
  it('clears the access token and surfaces the refresh failure when refresh fails', async () => {
    setAccessToken('expired-token')

    vi.mocked(refreshAccessToken).mockRejectedValue(
      new axios.AxiosError(
        'Request failed with status code 401',
        'ERR_BAD_REQUEST',
        undefined,
        null,
        {
          status: 401,
          statusText: 'Unauthorized',
          headers: {},
          config: {},
          data: {
            message: 'Refresh token expired.',
            code: 'refresh_token_expired',
          },
        },
      ),
    )

    apiClient.defaults.adapter = vi.fn(async (config) => {
      throw new axios.AxiosError(
        'Request failed with status code 401',
        'ERR_BAD_REQUEST',
        config,
        null,
        {
          status: 401,
          statusText: 'Unauthorized',
          headers: {},
          config,
          data: {
            message: 'Access token expired.',
            code: 'access_token_expired',
          },
        },
      )
    })

    const request = apiClient.get('/protected')

    await expect(request).rejects.toMatchObject({
      name: 'AppError',
      message: 'Refresh token expired.',
      status: 401,
    })

    expect(refreshAccessToken).toHaveBeenCalledOnce()
    expect(getAccessToken()).toBeNull()
  })
  it('clears the expired access token when refresh is unavailable', async () => {
    setAccessToken('expired-token')

    vi.mocked(refreshAccessToken).mockResolvedValue(null)

    apiClient.defaults.adapter = vi.fn(async (config) => {
      throw new axios.AxiosError(
        'Request failed with status code 401',
        'ERR_BAD_REQUEST',
        config,
        null,
        {
          status: 401,
          statusText: 'Unauthorized',
          headers: {},
          config,
          data: {
            message: 'Access token expired.',
            code: 'access_token_expired',
          },
        },
      )
    })

    const request = apiClient.get('/protected')

    await expect(request).rejects.toMatchObject({
      name: 'AppError',
      message: 'Access token expired.',
      status: 401,
    })

    expect(refreshAccessToken).toHaveBeenCalledOnce()
    expect(apiClient.defaults.adapter).toHaveBeenCalledOnce()
    expect(getAccessToken()).toBeNull()
  })
  it('allows a new refresh after the previous refresh has completed', async () => {
    vi.mocked(refreshAccessToken)
      .mockResolvedValueOnce('new-token-1')
      .mockResolvedValueOnce('new-token-2')

    apiClient.defaults.adapter = vi.fn(async (config) => {
      const authorization = config.headers.get('Authorization')

      if (
        authorization === 'Bearer expired-token-1' ||
        authorization === 'Bearer expired-token-2'
      ) {
        throw new axios.AxiosError(
          'Request failed with status code 401',
          'ERR_BAD_REQUEST',
          config,
          null,
          {
            status: 401,
            statusText: 'Unauthorized',
            headers: {},
            config,
            data: {
              message: 'Access token expired.',
              code: 'access_token_expired',
            },
          },
        )
      }

      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: { ok: true },
      }
    })

    setAccessToken('expired-token-1')

    await expect(apiClient.get('/first')).resolves.toMatchObject({
      data: { ok: true },
    })

    setAccessToken('expired-token-2')

    await expect(apiClient.get('/second')).resolves.toMatchObject({
      data: { ok: true },
    })

    expect(refreshAccessToken).toHaveBeenCalledTimes(2)
  })
  it('does not refresh more than once for the same request', async () => {
    setAccessToken('expired-token')

    vi.mocked(refreshAccessToken).mockResolvedValue('new-token')

    apiClient.defaults.adapter = vi.fn(async (config) => {
      throw new axios.AxiosError(
        'Request failed with status code 401',
        'ERR_BAD_REQUEST',
        config,
        null,
        {
          status: 401,
          statusText: 'Unauthorized',
          headers: {},
          config,
          data: {
            message: 'Access token expired.',
            code: 'access_token_expired',
          },
        },
      )
    })

    const request = apiClient.get('/protected')

    await expect(request).rejects.toMatchObject({
      name: 'AppError',
      message: 'Access token expired.',
      status: 401,
    })

    expect(refreshAccessToken).toHaveBeenCalledOnce()
    expect(apiClient.defaults.adapter).toHaveBeenCalledTimes(2)
  })

  it('shares one refresh across concurrent expired managed requests', async () => {
    setAccessToken('expired-token')

    /** @type {(value: string | null) => void} */
    let resolveRefresh = () => {}

    /** @type {Promise<string | null>} */
    const pendingRefresh = new Promise((resolve) => {
      resolveRefresh = resolve
    })

    vi.mocked(refreshAccessToken).mockReturnValue(pendingRefresh)

    apiClient.defaults.adapter = vi.fn(async (config) => {
      const authorization = config.headers.get('Authorization')

      if (authorization === 'Bearer expired-token') {
        throw new axios.AxiosError(
          'Request failed with status code 401',
          'ERR_BAD_REQUEST',
          config,
          null,
          {
            status: 401,
            statusText: 'Unauthorized',
            headers: {},
            config,
            data: {
              message: 'Access token expired.',
              code: 'access_token_expired',
            },
          },
        )
      }

      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: {
          url: config.url,
        },
      }
    })

    const firstRequest = apiClient.get('/first')
    const secondRequest = apiClient.get('/second')

    await vi.waitFor(() => {
      expect(apiClient.defaults.adapter).toHaveBeenCalledTimes(2)
    })

    expect(refreshAccessToken).toHaveBeenCalledOnce()

    resolveRefresh('new-token')

    const [firstResponse, secondResponse] = await Promise.all([
      firstRequest,
      secondRequest,
    ])

    expect(refreshAccessToken).toHaveBeenCalledOnce()
    expect(apiClient.defaults.adapter).toHaveBeenCalledTimes(4)

    expect(firstResponse.data).toEqual({ url: '/first' })
    expect(secondResponse.data).toEqual({ url: '/second' })
  })

  it('does not refresh a request using an explicit access token', async () => {
    setAccessToken('normal-token')

    apiClient.defaults.adapter = vi.fn(async (config) => {
      throw new axios.AxiosError(
        'Request failed with status code 401',
        'ERR_BAD_REQUEST',
        config,
        null,
        {
          status: 401,
          statusText: 'Unauthorized',
          headers: {},
          config,
          data: {
            message: 'Access token expired.',
            code: 'access_token_expired',
          },
        },
      )
    })

    const request = apiClient.get('/sensitive', {
      headers: {
        Authorization: 'Bearer fresh-step-up-token',
      },
    })

    await expect(request).rejects.toMatchObject({
      name: 'AppError',
      message: 'Access token expired.',
      status: 401,
    })

    expect(refreshAccessToken).not.toHaveBeenCalled()
    expect(apiClient.defaults.adapter).toHaveBeenCalledOnce()
  })

  it('refreshes an expired managed access token and retries with the new token', async () => {
    setAccessToken('expired-token')
    vi.mocked(refreshAccessToken).mockResolvedValue('new-token')

    const seenAuthorizationHeaders = []
    let requestCount = 0

    apiClient.defaults.adapter = vi.fn(async (config) => {
      requestCount += 1
      seenAuthorizationHeaders.push(config.headers.get('Authorization'))

      if (requestCount === 1) {
        throw new axios.AxiosError(
          'Request failed with status code 401',
          'ERR_BAD_REQUEST',
          config,
          null,
          {
            status: 401,
            statusText: 'Unauthorized',
            headers: {},
            config,
            data: {
              message: 'Access token expired.',
              code: 'access_token_expired',
            },
          },
        )
      }

      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: { ok: true },
      }
    })

    const response = await apiClient.get('/protected')

    expect(response.data).toEqual({ ok: true })
    expect(refreshAccessToken).toHaveBeenCalledOnce()
    expect(apiClient.defaults.adapter).toHaveBeenCalledTimes(2)

    expect(seenAuthorizationHeaders).toEqual([
      'Bearer expired-token',
      'Bearer new-token',
    ])
  })
})
