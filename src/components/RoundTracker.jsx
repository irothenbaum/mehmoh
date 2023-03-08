import React from 'react'
import './RoundTracker.scss'
import PropTypes from 'prop-types'
import Icon, {CHECK, BULLET} from './utility/Icon'

function RoundTracker(props) {
  console.log(props)

  // if the user is solving as opposed to answer revealing
  const isRevealing = !props.completed && typeof props.completed !== 'number'

  return (
    <div className={`round-tracker ${props.className || ''}`}>
      {[...new Array(props.total)].map((e, i) => {
        const isVisible = i < props.showing
        const isCompleted = !isRevealing && i < props.completed
        const isRevealed = isVisible && isRevealing
        const isTip = !isRevealing && i === props.completed // we highlight the one currently being shown
        return (
          <span
            key={i}
            className={`round-step ${isTip ? 'is-tip' : ''} ${
              isCompleted ? 'completed' : ''
            } ${isVisible ? (isRevealed ? 'revealed' : '') : 'not-visible'}`}>
            {isCompleted ? (
              <Icon icon={CHECK} />
            ) : isRevealed ? (
              <Icon icon={BULLET} />
            ) : null}
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
