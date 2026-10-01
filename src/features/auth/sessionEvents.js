/** @type {Set<() => void>} */
const listeners = new Set()

/**
 * @param {() => void} handler
 * @returns {() => void}
 */
export function subscribeToSessionExpired(handler) {
  listeners.add(handler)

  return () => {
    listeners.delete(handler)
  }
}

export function notifySessionExpired() {
  for (const listener of listeners) {
    listener()
  }
}
