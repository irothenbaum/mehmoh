import {createContext} from 'react'
import {SETTINGS_CACHE_KEY} from './constants/game'

export const DefaultSettings = {
  vertexCount: 4,
  highScores: {},
}

// hydrate from our stored value
const storedValue = localStorage[SETTINGS_CACHE_KEY]
export const HydratedSettings = storedValue
  ? JSON.parse(storedValue)
  : DefaultSettings

/**
 * A function to write to storage. This is called whenever a settings change is made
 * @param {*} obj
 */
export const flushSettings = obj => {
  localStorage[SETTINGS_CACHE_KEY] = JSON.stringify(obj)
}

const SettingsContext = createContext(DefaultSettings)

export default SettingsContext
