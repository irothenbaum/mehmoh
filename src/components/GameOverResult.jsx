import React, {useState, useEffect, useRef} from 'react'
import './GameOverResult.scss'
import RoundTracker from './RoundTracker'
import PropTypes from 'prop-types'
import Score from './Score'
import useDoOnceTimer from '../hooks/useDoOnceTimer'
import useContact from '../hooks/useContact'
import useHighScore from '../hooks/useHighScore'
import {SCENE_SIMON} from '../constants/routes'
import {constructClassString} from '../utilities'
import useTicker from '../hooks/useTicker'
import FireEffect from './FireEffect'

const FINAL_SCORE_REVEAL = 'final-score-reveal'
const FINAL_SCORE_REVEAL_TIMEOUT = 3000

function ScoreUnit(props) {
  const [v, setV] = useState(props.delay > 0 ? 0 : props.value)
  const {value, ticking} = useTicker(v)
  const {setTimer} = useDoOnceTimer()

  useEffect(() => {
    setTimer(
      'timer',
      () => {
        setV(props.value)
      },
      props.delay,
    )
  }, [])

  return (
    <div className={constructClassString({ticking: !!ticking}, 'score-unit')}>
      <span>{props.label}</span> <span>{value}</span>
    </div>
  )
}
ScoreUnit.propTypes = {
  delay: PropTypes.number,
  label: PropTypes.string,
  value: PropTypes.number,
}

function GameOverResult(props) {
  const {recordScore, getHighScore} = useHighScore()
  const prevBest = useRef(getHighScore(SCENE_SIMON, props.difficulty))
  const [value, setValue] = useState(0)
  const [score, setScore] = useState(0)
  const {setTimer} = useDoOnceTimer()
  const {contactProps} = useContact({
    onPress: props.onDone,
  })

  useEffect(() => {
    const finalScore =
      props.score + props.longestStreak + props.answerValues.length
    recordScore(SCENE_SIMON, props.difficulty, finalScore)
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
      {/*TODO: we want the top row of roundTracker to also be collapsed, not sure how yet*/}
      <div className="round-tracker-container">
        <RoundTracker
          initialShowing={props.answerValues.length}
          isRevealing={false}
          total={props.answerValues.length}
          completed={props.answerValues.length}
          pointValue={props.answerValues}
          onShowNext={() => {}}
          maxPointValue={props.difficulty}
        />
      </div>
      <div className="game-over-section">
        <ScoreUnit value={props.score} label="Score" delay={0} />
        <ScoreUnit
          value={props.answerValues.length}
          label="Answered correct"
          delay={1000}
        />
        <ScoreUnit
          value={props.longestStreak}
          label="Longest streak"
          delay={1000}
        />
      </div>

      <div className="score-container">
        <div>
          <h3>TOTAL</h3>
          <div className="score-container-inner">
            <Score onTick={v => setValue(v)} score={score} />
            <FireEffect isActive={value && value > prevBest.current} />
          </div>
          <p>prev best: {prevBest.current}</p>
        </div>
      </div>

      <div className="back-button">
        <button {...contactProps}>Back</button>
      </div>
    </div>
  )
}

GameOverResult.propTypes = {
  score: PropTypes.number.isRequired,
  answerValues: PropTypes.arrayOf(PropTypes.number).isRequired,
  longestStreak: PropTypes.number.isRequired,
  difficulty: PropTypes.number,
  onDone: PropTypes.func.isRequired,
}

export default GameOverResult
