import React, {useCallback, useEffect, useState} from 'react'
import './RoundTracker.scss'
import PropTypes from 'prop-types'
import Icon, {CHECK, BULLET} from './utility/Icon'
import {constructClassString} from '../utilities'
import useDoOnceTimer from '../hooks/useDoOnceTimer'
import {REVEAL_TIMER, REVEAL_TIMEOUT} from '../constants/game'

const DEFAULT_BLOCKS_COUNT = 1

function RoundTracker(props) {
  const [showing, setShowing] = useState(-5)
  const [blocksPerLine, setBlocksPerLine] = useState(DEFAULT_BLOCKS_COUNT)
  const isRevealing = props.isRevealing
  const {setTimer} = useDoOnceTimer()

  // if the component has been set to revealing state
  useEffect(() => {
    if (typeof props.isRevealing !== 'boolean') {
      return
    }

    if (props.isRevealing) {
      setShowing(0)
    }
  }, [props.isRevealing])

  useEffect(() => {
    if (typeof showing !== 'number') {
      return
    }

    const isDoneShowing = showing >= props.total
    if (showing > 0) {
      // report that we're showing the next
      props.onShowNext(showing - 1, isDoneShowing)
    }

    // if we haven't revealed every block
    if (!isDoneShowing) {
      // then wait the reveal timeout before recursively invoking revealNext
      setTimer(REVEAL_TIMER, () => setShowing(p => p + 1), REVEAL_TIMEOUT)
    }
  }, [showing])

  const onRefChange = useCallback(node => {
    if (node && blocksPerLine === DEFAULT_BLOCKS_COUNT) {
      // TODO: What if screen size changes???
      const containerWidth = node.parentElement.clientWidth
      const blockWidth = node.clientWidth + 4 // add a little extra padding because we want them spaced
      setBlocksPerLine(Math.floor(containerWidth / blockWidth))
    }
  }, [])

  let linesToDraw = parseInt(showing / blocksPerLine)
  const keyCounter = linesToDraw * blocksPerLine
  let blocksToDraw = showing & blocksPerLine

  return (
    <div
      className={constructClassString(
        {hidden: props.isHidden || showing < 0},
        'round-tracker',
        props.className,
      )}>
      {[...new Array(blocksPerLine)].map((e, i) => {
        const isVisible = i < blocksToDraw
        const isCompleted = !isRevealing && i < props.completed
        const isRevealed = isVisible && isRevealing
        const isTip = !isRevealing && i === props.completed // we highlight the one currently being shown

        const refProps = i === 0 ? {ref: onRefChange} : {}

        return (
          <span
            {...refProps}
            key={keyCounter + i} // this basically gives you the block position out of total
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
  onShowNext: PropTypes.func.isRequired,
  isRevealing: PropTypes.bool,
  isHidden: PropTypes.bool,
  // showing: PropTypes.number,
  completed: PropTypes.number,
  className: PropTypes.string,
}

export default RoundTracker

/*

total = 10
showing = 4

blocksPerLine = 4
linesToDraw = 1
blocksToDraw = 0


 */
