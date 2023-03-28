import React, {useState, useEffect, useContext, useRef} from 'react'
import './Simon.scss'
import useIncrement from '../../hooks/useIncrement'
import VertexPolygon from '../VertexPolygon'
import {
  CLICK_FEEDBACK_TIMER,
  CLICK_FEEDBACK_DURATION,
  ROUND_PAUSE_TIMER,
  WIN_PAUSE_DURATION,
  INTER_ROUND_DURATION,
  INTER_ROUND_TIMER,
} from '../../constants/game'
import useArray from '../../hooks/useArray'
import useDoOnceTimer from '../../hooks/useDoOnceTimer'
import RoundTracker from '../RoundTracker'
import {constructClassString} from '../../utilities'
import Score from '../Score'
import SettingsContext from '../../SettingsContext'
import useHighScore from '../../hooks/useHighScore'
import {SCENE_MENU, SCENE_SIMON} from '../../constants/routes'
import PropTypes from 'prop-types'
import GameOverResult from '../GameOverResult'
import Icon, {SHIELD} from '../utility/Icon'
import ShieldEffect from '../ShieldEffect'

// first 3 correct (offset=-1,0,1) answers are always worth 1, then you can get on fire
const FIRE_OFFSET = 1

function isStreakOnFire(streak) {
  return streak > 2
}

function Simon(props) {
  const {getHighScore} = useHighScore()
  const {vertexCount} = useContext(SettingsContext)
  const [animatingRound, setAnimatingRound] = useState(true)
  const {array: correctPath, append: appendCorrectStep} = useArray([])
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
  const [streak, setStreak] = useState(0)
  const longestStreak = useRef(0)
  const isOnFire = isStreakOnFire(streak)
  const [isGameOver, setIsGameOver] = useState(false)
  const [pointValuesArr, setPointValuesArr] = useState([])
  const [disabledVertex, setDisabledVertex] = useState(null)
  const allPointValues = useRef([])

  // the first FIRE_OFFSET answers are worth 1, then subsequent correct answers are worth +1..Vertex Count
  const pointValue = Math.min(Math.max(1, streak - FIRE_OFFSET), vertexCount)

  const startNextRound = () => {
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
        allPointValues.current = allPointValues.current.concat(pointValuesArr)
        setPointValuesArr([])
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
      setDisabledVertex(null)
      setActiveVertex(vertNum)
      setTimer(
        CLICK_FEEDBACK_TIMER,
        () => setActiveVertex(null),
        CLICK_FEEDBACK_DURATION,
      )
      markGuess()
      setPointValuesArr(s => [...s, pointValue])
      setScore(
        // first 3 answers correct are worth 1, then 2, then 3, then 4 ... up to vertexCount
        s => s + pointValue,
      )
      setStreak(s => s + 1)
    } else {
      if (isOnFire) {
        setStreak(0)
        setDisabledVertex(vertNum)
      } else {
        // store progress from mid round
        allPointValues.current = allPointValues.current.concat(
          pointValuesArr.slice(0, pointValuesArr.length),
        )
        // if you get one wrong not on fire, this will be game over?
        setIsGameOver(true)
      }
    }
  }

  useEffect(() => {
    longestStreak.current = Math.max(longestStreak.current, streak)
  }, [streak])

  const handleReturn = () => {
    props.onNavigate(SCENE_MENU)
  }

  return (
    <div
      className={constructClassString({
        'simon-game': true,
        'round-rest': !!animatingRound,
      })}>
      {isGameOver && (
        <GameOverResult
          answerValues={allPointValues.current}
          longestStreak={longestStreak.current}
          score={score}
          difficulty={vertexCount}
          onDone={handleReturn}
        />
      )}
      <div className="header-container">
        <Score
          score={score}
          isHighScore={
            score > 0 && getHighScore(SCENE_SIMON, vertexCount) <= score
          }
        />
        <Icon
          icon={SHIELD}
          className={constructClassString(
            {'is-on-fire': isOnFire},
            'shield-icon',
          )}
        />
        <Icon
          icon={SHIELD}
          className={constructClassString(
            null,
            `streak-${streak}`,
            'shield-icon-clip',
          )}
        />
      </div>

      <ShieldEffect isActive={isOnFire} />
      <div className="game-container">
        <VertexPolygon
          isCollapsed={animatingRound}
          isSecondary={isRevealing}
          count={vertexCount}
          onContactStart={handleVertexTouch}
          activeVertex={activeVertex}
          disabledVertex={disabledVertex}
        />
      </div>
      <RoundTracker
        isHidden={!!animatingRound}
        isRevealing={isRevealing}
        total={correctPath.length}
        onShowNext={onShowNext}
        completed={guessCount}
        pointValue={[...pointValuesArr, pointValue]}
        maxPointValue={vertexCount}
      />
    </div>
  )
}

Simon.propTypes = {
  onNavigate: PropTypes.func,
}

export default Simon
