import React, {useContext} from 'react'
import SettingsContext from '../SettingsContext'

/**
 * @param {string} game
 * @param {number} vertexCount
 * @return {string}
 */
function getScoreKey(game, vertexCount) {
  return `${game}-${vertexCount}`
}

function useHighScore() {
  const {highScores, updateSettings} = useContext(SettingsContext)

  /**
   * @param {string} game
   * @param {number} vertexCount
   * @param {number} score
   */
  const recordScore = (game, vertexCount, score) => {
    const scoreKey = getScoreKey(game, vertexCount)
    const currentHighScore = highScores[scoreKey]
    updateSettings({
      highScores: {
        ...highScores,
        [scoreKey]: Math.max(currentHighScore, score),
      },
    })
  }

  /**
   * @param {string} game
   * @param {number} vertexCount
   * @return {*}
   */
  const getHighScore = (game, vertexCount) => {
    const scoreKey = getScoreKey(game, vertexCount)
    return highScores[scoreKey] || 0
  }

  /**
   * @param {string} game
   * @param {number} vertexCount
   */
  const clearHighScore = (game, vertexCount) => {
    const scoreKey = getScoreKey(game, vertexCount)
    updateSettings({
      highScores: {
        ...highScores,
        [scoreKey]: 0,
      },
    })
  }

  return {
    recordScore,
    getHighScore,
    clearHighScore,
  }
}

export default useHighScore
