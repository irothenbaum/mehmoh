import React, {useState} from 'react'
import './Score.scss'
import PropTypes from 'prop-types'
import useIncrement from '../hooks/useIncrement'
import useDoOnceTimer from '../hooks/useDoOnceTimer'
import {useEffect, useRef} from 'react'
import {constructClassString} from '../utilities'

const SCORE_TICK_TIMER = 'score-tick-timer'
// this is the how long it'll take the very last value to tick, values before will tick faster
const SCORE_TIME_TIMEOUT = 300

function Score(props) {
  const {setTimer, cancelTimer, cancelAllTimers} = useDoOnceTimer()
  const {value, increment, decrement} = useIncrement(props.score || 0)
  const [ticking, setTicking] = useState(0)

  useEffect(() => {
    return () => cancelAllTimers()
  }, [])

  useEffect(() => {
    // if the score hasn't actually changed, we do nothing
    if (props.score === value) {
      return
    }

    // we stop any previous ticking
    cancelTimer(SCORE_TICK_TIMER)

    // when the score changes we want to animate into the correct numbers
    // so we record how many changes (ticks) we need to make and start ticking
    // each tick increments (or decrements based on score change) the cached
    // copy of score by 1
    // we do current - score so that ticks will go up with score change.
    // just feels nicer to have + and inc together...
    let ticks = value - props.score

    setTicking(ticks < 0 ? -1 : 1)

    const tickScore = () => {
      // when ticks is exactly 0, we're done
      if (ticks === 0) {
        setTicking(0)
        return
      }

      if (ticks < 0) {
        ticks++
        increment()
      } else {
        ticks--
        decrement()
      }

      // we recurse to see if there are more ticks to give
      setTimer(
        SCORE_TICK_TIMER,
        tickScore,
        // divide by number of ticks so our number eases into the final value
        Math.abs(SCORE_TIME_TIMEOUT / ticks),
      )
    }
    tickScore()
  }, [props.score])

  return (
    <span
      className={constructClassString(
        {
          [`ticking-${ticking < 0 ? 'up' : 'down'}`]: ticking !== 0,
          'high-score': !!props.isHighScore,
        },
        'score',
      )}>
      {value}
    </span>
  )
}

Score.propTypes = {
  score: PropTypes.number.isRequired,
  isHighScore: PropTypes.bool,
}

export default Score
