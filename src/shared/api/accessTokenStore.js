/** @type {string | null} */
let accessToken = null

/**
 * @param {string} token
 * @returns {void}
 */
export function setAccessToken(token) {
  accessToken = token
}

/**
 * @returns {string | null}
 */
export function getAccessToken() {
  return accessToken
}

/**
 * @returns {void}
 */
export function clearAccessToken() {
  accessToken = null
}
