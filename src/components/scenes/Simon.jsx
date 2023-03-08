import React, {useState, useEffect} from 'react'
import './Simon.scss'
import useIncrement from '../../hooks/useIncrement'
import VertexPolygon from '../VertexPolygon'
import useHighScore from '../../hooks/useHighScore'
import {HIGH_SCORE_SIMON} from '../../constants/game'
import PropTypes from 'prop-types'
import useArray from '../../hooks/useArray'
import useDoOnceTimer from '../../hooks/useDoOnceTimer'
import RoundTracker from '../RoundTracker'

const CLICK_FEEDBACK_TIMER = 'click-feedback'
const ROUND_PAUSE_TIMER = 'round-pause'
const CLICK_FEEDBACK_DURATION = 1000 // how long the vertex glows when interacted
const WIN_PAUSE_DURATION = 2000 // how long the user waits after a win before the collapse starts

const REVEAL_TIMER = 'reveal-timer'
const REVEAL_TIMEOUT = 1000 // the pace to reveal the next target vertex, should probably be >= CLICK_FEEDBACK

const INTER_ROUND_DURATION = 3000 // how long the user sits in a collapsed state
const INTER_ROUND_TIMER = 'inter-round'

function Simon(props) {
  const vertexCount = props.vertexCount || 3
  const [animatingRound, setAnimatingRound] = useState(false)
  const {highScore, recordScore} = useHighScore(HIGH_SCORE_SIMON)
  const {
    array: correctPath,
    append: appendCorrectStep,
    resetArray: resetCorrectSteps,
  } = useArray([])
  const [canTouch, setCanTouch] = useState(false)
  const [activeVertex, setActiveVertex] = useState(null)
  const [revealing, setRevealing] = useState(0)
  const {
    value: guessCount,
    increment: markGuess,
    setValue: setGuessCount,
  } = useIncrement(0)
  const {setTimer, isTimerSet, cancelAllTimers} = useDoOnceTimer()

  const startNextRound = () => {
    console.log('Round Reset')
    setAnimatingRound(true)

    // starting a round involves selecting a new correct path vertex number
    const prevVert = correctPath[correctPath.length - 1]
    let nextVert = Math.floor(Math.random() * vertexCount)
    console.log('NEXT TERM:', nextVert, vertexCount)
    if (nextVert === prevVert) {
      nextVert =
        (nextVert + 1 + Math.floor(Math.random() * (vertexCount - 1))) %
        vertexCount
      console.log('repicked ' + nextVert)
    }

    setTimer(
      INTER_ROUND_TIMER,
      () => {
        setGuessCount(0)
        console.log('Starting Round')
        setAnimatingRound(false)
        // by setting this negative we effectively multiply the time we wait by REVEAL_TIMEOUT
        // so -2 is waiting an extra (2 * REVEAL_TIMEOUT) before starting to reveal
        setRevealing(-2)
        appendCorrectStep(nextVert)
      },
      INTER_ROUND_DURATION,
    )
  }

  // on Mount, we wait a pause and then start next round
  useEffect(() => {
    startNextRound()
    return () => {
      cancelAllTimers()
    }
  }, [])

  useEffect(() => {
    if (typeof revealing === 'number') {
      // if we haven't revealed every vertex along the correct path
      if (revealing < correctPath.length) {
        // we shown the next vertex,
        setActiveVertex(correctPath[revealing])
        // then wait the reveal timeout before recursively invoking revealNext
        setTimer(REVEAL_TIMER, () => setRevealing(p => p + 1), REVEAL_TIMEOUT)
      } else {
        // if we have shown every vertex in the correct path, then it's the player's turn to repeat
        setActiveVertex(null)
        setCanTouch(true)
        setRevealing(null)
        // round starts here!
      }
    }
  }, [revealing])

  // we only increment guess count when they guess correctly
  useEffect(() => {
    // if we've guessed the correct number of times, then we won!
    if (guessCount > 0 && guessCount === correctPath.length) {
      // ROUND WON!
      setCanTouch(false)
      setTimer(ROUND_PAUSE_TIMER, startNextRound, WIN_PAUSE_DURATION)
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

  const isRevealing = typeof revealing === 'number'

  return (
    <div className={`simon-game ${animatingRound && 'round-reset'}`}>
      <div className="game-container">
        <VertexPolygon
          isCollapsed={animatingRound}
          isSecondary={isRevealing}
          count={vertexCount}
          onContactStart={handleVertexTouch}
          activeVertex={activeVertex}
        />
      </div>
      <RoundTracker
        total={correctPath.length}
        showing={isRevealing ? revealing + 1 : correctPath.length}
        completed={isRevealing ? null : guessCount}
      />
    </div>
  )
}

Simon.propTypes = {
  vertexCount: PropTypes.number,
}

export default Simon
