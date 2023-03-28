import useDoOnceTimer from './useDoOnceTimer'
import useIncrement from './useIncrement'
import {useEffect, useState} from 'react'

const TICK_TIMER = 'score-tick-timer'
// this is the how long it'll take the very last value to tick, values before will tick faster
const TIME_TIMEOUT = 300

/**
 * @param {number?} startingValue
 */
function useTicker(startingValue = 0) {
  const {setTimer, cancelTimer, cancelAllTimers} = useDoOnceTimer()
  const {value, increment, decrement} = useIncrement(startingValue)
  const [ticking, setTicking] = useState(0)

  useEffect(() => {
    return () => cancelAllTimers()
  }, [])

  useEffect(() => {
    // if the score hasn't actually changed, we do nothing
    if (startingValue === value) {
      return
    }

    // we stop any previous ticking
    cancelTimer(TICK_TIMER)

    // when the score changes we want to animate into the correct numbers
    // so we record how many changes (ticks) we need to make and start ticking
    // each tick increments (or decrements based on score change) the cached
    // copy of score by 1
    // we do current - score so that ticks will go up with score change.
    // just feels nicer to have + and inc together...
    let ticks = value - startingValue

    setTicking(ticks < 0 ? -1 : 1)

    const tickScore = () => {
      // when ticks is exactly 0, we're done
      if (ticks === 0) {
        setTicking(0)
        return
      }

      const tickAmount = Math.max(1, Math.round(Math.abs(ticks) / 20))

      if (ticks < 0) {
        ticks += tickAmount
        increment(tickAmount)
      } else {
        ticks -= tickAmount
        decrement(tickAmount)
      }

      // we recurse to see if there are more ticks to give
      setTimer(
        TICK_TIMER,
        tickScore,
        // divide by number of ticks so our number eases into the final value
        Math.abs(TIME_TIMEOUT / ticks),
      )
    }
    tickScore()
  }, [startingValue])

  return {
    ticking, // -1 = ticking up, +1 = ticking down, 0 = not ticking
    value,
  }
}

export default useTicker
