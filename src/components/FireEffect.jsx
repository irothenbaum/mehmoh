import React, {useEffect, useState} from 'react'
import './FireEffect.scss'
import Icon, {FIRE} from './utility/Icon'
import useDoOnceTimer from '../hooks/useDoOnceTimer'
import moment from 'moment'
import PropTypes from 'prop-types'
import {constructClassString} from '../utilities'

// how long it animates for. Should match the css settings
const ANIMATION_DURATION = 1000

const START = moment()

function Flame(props) {
  const {setTimer} = useDoOnceTimer()
  const [style, setStyle] = useState({})

  const shuffle = () => {
    const isOdd = Math.random() < 0.5
    const styles = [
      `scale(${Math.floor(100 * (0.9 + Math.random() * 0.2))}%)`,
      `scaleX(${isOdd ? '-' : ''}1) translateX(${isOdd ? '-1em' : '0'})`,
      `rotate(${10 - Math.round(Math.random() * 20)}deg)`,
    ]

    setStyle({
      transform: styles.join(' '),
      zIndex: moment().diff(START),
    })
    setTimer('swap', shuffle, ANIMATION_DURATION)
  }

  useEffect(() => {
    setTimer('start', shuffle, props.delay || 0)
  }, [])

  return <Icon style={style} className="flame" icon={FIRE} />
}

function FireEffect(props) {
  return (
    <div
      className={constructClassString(
        {active: props.isActive},
        'fire-effect-container',
      )}>
      <Flame />
      <Flame delay={250} />
      <Flame delay={500} />
      <Flame delay={750} />
    </div>
  )
}

FireEffect.propTypes = {
  isActive: PropTypes.bool,
}

export default FireEffect
