import React from 'react'
import './RoundTracker.scss'
import PropTypes from 'prop-types'
import Icon, {CHECK} from './utility/Icon'

function RoundTracker(props) {
  console.log(props)
  return (
    <div className={`round-tracker ${props.className || ''}`}>
      {[...new Array(props.total)].map((e, i) => {
        const isVisible = i < props.showing
        const isCompleted = i < props.completed
        return (
          <span
            key={i}
            className={`round-step ${isCompleted ? 'completed' : ''} ${
              isVisible ? '' : 'not-visible'
            }`}>
            {isCompleted ? <Icon icon={CHECK} /> : null}
          </span>
        )
      })}
    </div>
  )
}

RoundTracker.propTypes = {
  total: PropTypes.number.isRequired,
  showing: PropTypes.number,
  completed: PropTypes.number,
  className: PropTypes.string,
}

export default RoundTracker
