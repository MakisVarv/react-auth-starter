export class AppError extends Error {
  /**
   * @param {string} message
   * @param {number | null} [status=null]
   * @param {Record<string, string[]> | null} [errors=null]
   */
  constructor(message, status = null, errors = null) {
    super(message)

    this.name = 'AppError'
    this.status = status
    this.errors = errors
  }
}
