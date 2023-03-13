import React, {useState, useEffect} from 'react'
import './Simon.scss'
import useIncrement from '../../hooks/useIncrement'
import VertexPolygon from '../VertexPolygon'
import useHighScore from '../../hooks/useHighScore'
import {
  HIGH_SCORE_SIMON,
  CLICK_FEEDBACK_TIMER,
  CLICK_FEEDBACK_DURATION,
  ROUND_PAUSE_TIMER,
  WIN_PAUSE_DURATION,
  INTER_ROUND_DURATION,
  INTER_ROUND_TIMER,
} from '../../constants/game'
import PropTypes from 'prop-types'
import useArray from '../../hooks/useArray'
import useDoOnceTimer from '../../hooks/useDoOnceTimer'
import RoundTracker from '../RoundTracker'
import {constructClassString} from '../../utilities'
import Score from '../Score'

function Simon(props) {
  const vertexCount = props.vertexCount || 6
  const [animatingRound, setAnimatingRound] = useState(false)
  const {highScore, recordScore} = useHighScore(HIGH_SCORE_SIMON)
  const {
    array: correctPath,
    append: appendCorrectStep,
    resetArray: resetCorrectSteps,
  } = useArray([])
  const [canTouch, setCanTouch] = useState(false)
  const [activeVertex, setActiveVertex] = useState(null)
  const [isRevealing, setIsRevealing] = useState(false)
  const {
    value: guessCount,
    increment: markGuess,
    setValue: setGuessCount,
  } = useIncrement(0)
  const {setTimer, cancelAllTimers} = useDoOnceTimer()
  const [score, setScore] = useState(0)

  const startNextRound = () => {
    console.log('Starting next round')
    setAnimatingRound(true)

    // starting a round involves selecting a new correct path vertex number
    const prevVert = correctPath[correctPath.length - 1]
    let nextVert = Math.floor(Math.random() * vertexCount)
    if (nextVert === prevVert) {
      nextVert =
        (nextVert + 1 + Math.floor(Math.random() * (vertexCount - 1))) %
        vertexCount
    }

    setTimer(
      INTER_ROUND_TIMER,
      () => {
        setGuessCount(0)
        setAnimatingRound(false)
        setIsRevealing(true)
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

  const onShowNext = (index, isDone) => {
    setActiveVertex(correctPath[index])

    if (isDone) {
      setTimer(
        'post-reveal-pause',
        () => {
          setActiveVertex(null)
          setCanTouch(true)
          console.log(correctPath)
          setIsRevealing(false)
        },
        1000, // wait 1 second after the last vertex is shown before we let the user start
      )
    }
  }

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
      // vertexCount is our pointValue
      setScore(s => s + props.vertexCount)
    } else {
      // TODO: How do we actually handle this?
      window.alert('WRONG!')
    }
  }

  return (
    <div
      className={constructClassString({
        'simon-game': true,
        'round-rest': !!animatingRound,
      })}>
      <Score score={score} />
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
        isHidden={!!animatingRound}
        isRevealing={isRevealing}
        total={correctPath.length}
        onShowNext={onShowNext}
        completed={guessCount}
        // vertexCount is our pointValue
        pointValue={props.vertexCount}
      />
    </div>
  )
}

Simon.propTypes = {
  vertexCount: PropTypes.number,
}

export default Simon
