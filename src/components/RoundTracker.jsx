import React from 'react'
import './RoundTracker.scss'
import PropTypes from 'prop-types'
import Icon, {CHECK, BULLET} from './utility/Icon'
import {constructClassString} from '../utilities'

function RoundTracker(props) {
  // if the user is solving as opposed to answer revealing
  const isRevealing = !props.completed && typeof props.completed !== 'number'

  return (
    <div
      className={constructClassString(null, 'round-tracker', props.className)}>
      {[...new Array(props.total)].map((e, i) => {
        const isVisible = i < props.showing
        const isCompleted = !isRevealing && i < props.completed
        const isRevealed = isVisible && isRevealing
        const isTip = !isRevealing && i === props.completed // we highlight the one currently being shown
        return (
          <span
            key={i}
            className={constructClassString(
              {
                'is-tip': isTip,
                completed: isCompleted,
                'not-visible': !isVisible,
                revealed: isRevealed,
              },
              'round-step',
            )}>
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
