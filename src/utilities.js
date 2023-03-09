/**
 * @param {Object<string, boolean>} conditions
 * @param {string?} others
 * @returns {string}
 */
export function constructClassString(conditions, ...others) {
  return Object.entries(conditions || {})
    .filter(([key, value]) => !!value)
    .map(([key, value]) => key)
    .concat(others.filter(o => !!o))
    .join(' ')
}

/**
 * @param {number?} length
 * @return {string}
 */
export function getRandomString(length = 30) {
  return [...Array(length)].map(() => Math.random().toString(36)[2]).join('')
}
