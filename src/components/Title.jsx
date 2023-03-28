import React, {useEffect, useState} from 'react'
import './Title.scss'
import useDoOnceTimer from '../hooks/useDoOnceTimer'
import useIncrement from '../hooks/useIncrement'
import {constructClassString} from '../utilities'

const elems = ['m', 'e', 'h', <br />, 'm', 'o', 'h']

const ANIMATION_TIMER = 'title-animation-timer'

function Title(props) {
  const {setTimer, isTimerSet, cancelTimer} = useDoOnceTimer()
  const {increment, value} = useIncrement(0)

  useEffect(() => {
    if (value <= elems.length + 1) {
      setTimer(ANIMATION_TIMER, increment, 200)
    }
  }, [value])

  return (
    <h1 className="title">
      {elems.map((e, i) => {
        return (
          <span
            key={i}
            className={constructClassString({
              visible: i < value,
              active: e === 'e' && value > 6,
              secondary: e === 'o' && value > 6,
            })}>
            {e}
          </span>
        )
      })}
    </h1>
  )
}

export default Title
