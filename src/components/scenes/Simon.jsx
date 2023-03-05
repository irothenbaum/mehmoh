import React, {useState, useEffect} from 'react'
import './Simon.scss'
import useIncrement from '../../hooks/useIncrement'
import VertexPolygon from '../VertexPolygon'
import useHighScore from '../../hooks/useHighScore'
import {HIGH_SCORE_SIMON} from '../../constants/game'
import PropTypes from 'prop-types'
import useArray from '../../hooks/useArray'
import useDoOnceTimer from '../../hooks/useDoOnceTimer'

const CLICK_FEEDBACK_TIMER = 'click-feedback'
const ROUND_PAUSE_TIMER = 'round-pause'
const CLICK_FEEDBACK_DURATION = 1000
const ROUND_PAUSE_DURATION = 3000

const REVEAL_TIMER = 'reveal-timer'
const REVEAL_TIMEOUT = 1000

function Simon(props) {
  const vertexCount = props.vertexCount || 3
  const {highScore, recordScore} = useHighScore(HIGH_SCORE_SIMON)
  const {
    array: correctPath,
    append: appendCorrectStep,
    resetArray: resetCorrectSteps,
  } = useArray([])
  const [canTouch, setCanTouch] = useState(false)
  const [activeVertex, setActiveVertex] = useState(null)
  const {
    value: guessCount,
    increment: markGuess,
    setValue: setGuessCount,
  } = useIncrement(0)
  const {setTimer, isTimerSet, cancelAllTimers} = useDoOnceTimer()

  const startNextRound = () => {
    console.log('STARTING ROUND')
    // starting a round involves selecting a new correct path vertex number
    setGuessCount(0)
    const prevVert = correctPath[correctPath.length - 1]
    let nextVert = Math.floor(Math.random() * vertexCount)
    console.log(nextVert, vertexCount)
    if (nextVert === prevVert) {
      nextVert =
        (nextVert + 1 + Math.floor(Math.random() * vertexCount - 1)) %
        vertexCount
    }
    appendCorrectStep(nextVert)
  }

  // on Mount, we wait a pause and then start next round
  useEffect(() => {
    setTimer(ROUND_PAUSE_TIMER, startNextRound, ROUND_PAUSE_DURATION)
    return () => {
      cancelAllTimers()
    }
  }, [])

  // when the correct path changes, we slowly reveal the correct path
  useEffect(() => {
    console.log(correctPath)
    let revealing = 0

    const revealNext = () => {
      // if we haven't revealed every vertex along the correct path
      if (revealing < correctPath.length) {
        // we shown the next vertex,
        setActiveVertex(correctPath[revealing++])
        // then wait the reveal timeout before recursively invoking revealNext
        setTimer(REVEAL_TIMER, revealNext, REVEAL_TIMEOUT)
      } else {
        // if we have shown every vertex in the correct path, then it's the player's turn to repeat
        setActiveVertex(null)
        setCanTouch(true)
        // round starts here!
      }
    }
    revealNext()
  }, [correctPath])

  // we only increment guess count when they guess correctly
  useEffect(() => {
    // if we've guessed the correct number of times, then we won!
    if (guessCount > 0 && guessCount === correctPath.length) {
      // ROUND WON!
      setCanTouch(false)
      setTimer(ROUND_PAUSE_TIMER, startNextRound, ROUND_PAUSE_DURATION)
    }
  }, [guessCount])

  const handleVertexTouch = vertNum => {
    if (!canTouch) {
      return
    }

    if (correctPath[guessCount] === vertNum) {
      setActiveVertex(vertNum)
      setTimer(
        CLICK_FEEDBACK_TIMER,
        () => setActiveVertex(null),
        CLICK_FEEDBACK_DURATION,
      )
      markGuess()
    } else {
      window.alert('WRONG!')
    }
  }

  return (
    <div className="simon-game">
      <VertexPolygon
        count={vertexCount}
        onContactStart={handleVertexTouch}
        activeVertex={activeVertex}
      />
    </div>
  )
}

Simon.propTypes = {
  vertexCount: PropTypes.number,
}

export default Simon
