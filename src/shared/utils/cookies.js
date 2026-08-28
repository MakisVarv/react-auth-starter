/**
 * @param {string} name
 * @returns {string | null}
 */
export function getCookie(name) {
  let cname = name + '='
  let ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let cookie = ca[i].trim()
    if (cookie.startsWith(cname)) {
      return cookie.slice(cname.length)
    }
  }
  return null
}
