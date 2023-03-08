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
