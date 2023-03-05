// This is copied and converted to ESM Export syntax from the scrapeLayer
import {print} from 'graphql'
/**
 * @typedef SimpleGraphQLClientConstructor
 * @property {string} url
 * @property {string} apiKey
 * @property {string?} region
 * @property {boolean?} debug
 */

/**
 * @typedef GraphQLQueryPayload
 * @property {*} query
 * @property {*} variables
 */

/**
 * @typedef GraphQLMutatePayload
 * @property {*} mutation
 * @property {*?} query
 * @property {*} variables
 */

// Currently only supports API Key authentication
// TODO: add IAM and Cognito auth support
class SimpleGraphQLClient {
  /**
   * @param {SimpleGraphQLClientConstructor} config
   */
  constructor(config) {
    this.url = config.url
    this.apiKey = config.apiKey
    this.region = config.region
    this.debug = !!config.debug
  }

  /**
   * @param {GraphQLQueryPayload} payload
   * @returns {Promise<*>}
   */
  async query(payload) {
    return this._send({...payload, query: print(payload.query)})
  }
  /**
   * @param {GraphQLMutatePayload} payload
   * @returns {Promise<*>}
   */
  async mutate(payload) {
    return this._send({
      ...payload,
      query: print(payload.mutation || payload.query),
    })
  }

  /**
   * @param {*} payload
   * @returns {Promise<*>}
   * @private
   */
  async _send(payload) {
    if (this.debug) {
      console.log(`Sending graphql payload:`, payload)
    }

    const options = {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
      },
      body: JSON.stringify(payload),
    }

    const request = new Request(this.url, options)

    const response = await fetch(request)
    try {
      const retVal = await response.json()

      if (this.debug) {
        console.log(retVal)
      }

      return retVal
    } catch (err) {
      if (this.debug) {
        console.error(err)
      }
      throw err
    }
  }
}

export default SimpleGraphQLClient
