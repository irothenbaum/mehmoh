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
      <div className="game-over-section">
        <h1>Game Over</h1>
      </div>
      <RoundTracker
        initialShowing={props.answerValues.length}
        isRevealing={false}
        total={props.answerValues.length}
        completed={props.answerValues.length}
        pointValue={props.answerValues}
        onShowNext={() => {}}
        maxPointValue={props.difficulty}
      />
      <div className="game-over-section">
        <h3>
          Score: <span>{props.score}</span>
        </h3>
        <h3>
          Answered Correct: <span>{props.answerValues.length}</span>
        </h3>
        <h3>
          Longest streak: <span>{props.longestStreak}</span>
        </h3>

        <Score score={score} />
      </div>
    </div>
  )
}

GameOverResult.propTypes = {
  score: PropTypes.number.isRequired,
  answerValues: PropTypes.arrayOf(PropTypes.number).isRequired,
  longestStreak: PropTypes.number.isRequired,
  difficulty: PropTypes.number,
}

export default GameOverResult
