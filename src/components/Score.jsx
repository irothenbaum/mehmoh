import React, {useEffect} from 'react'
import './Score.scss'
import PropTypes from 'prop-types'
import {constructClassString} from '../utilities'
import useTicker from '../hooks/useTicker'

function Score(props) {
  const {value, ticking} = useTicker(props.score)

  useEffect(() => {
    if (typeof props.onTick === 'function') {
      props.onTick(value)
    }
  }, [value])

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
  onTick: PropTypes.func,
}

export default Score
