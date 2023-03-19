import React, {useState, useEffect} from 'react'
import './GameOverResult.scss'
import RoundTracker from './RoundTracker'
import PropTypes from 'prop-types'
import Score from './Score'
import useDoOnceTimer from '../hooks/useDoOnceTimer'

const FINAL_SCORE_REVEAL = 'final-score-reveal'
const FINAL_SCORE_REVEAL_TIMEOUT = 3000

function GameOverResult(props) {
  const [score, setScore] = useState(0)
  const {setTimer} = useDoOnceTimer()

  useEffect(() => {
    const finalScore = props.score + props.longestStreak * props.difficulty
    setTimer(
      FINAL_SCORE_REVEAL,
      () => setScore(finalScore),
      FINAL_SCORE_REVEAL_TIMEOUT,
    )
  }, [])

  return (
    <div className="game-over-results-container">
      <div>
        <h1>Game Over</h1>

        <RoundTracker total={props.answeredCorrected} onShowNext={() => {}} />

        <h3>Score: {props.score}</h3>
        <h3>Answered Correct: {props.answeredCorrected}</h3>
        <h3>Longest streak: {props.longestStreak}</h3>

        <Score score={score} />
      </div>
    </div>
  )
}

GameOverResult.propTypes = {
  score: PropTypes.number.isRequired,
  answeredCorrected: PropTypes.number.isRequired,
  longestStreak: PropTypes.number.isRequired,
  difficulty: PropTypes.number,
}

export default GameOverResult
