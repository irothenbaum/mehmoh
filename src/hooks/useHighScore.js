import {useState} from 'react'

/**
 * @param {string} gameKey
 */
function useHighScore(gameKey) {
  const [highScore, setHighScore] = useState(
    parseInt(window.localStorage[gameKey]) || 0,
  )

  const handleSetHighScore = newScore => {
    if (newScore > highScore) {
      window.localStorage[gameKey] = newScore
      setHighScore(newScore)
    }
  }

  return {
    recordScore: handleSetHighScore,
    highScore: highScore,
  }
}

export default useHighScore
