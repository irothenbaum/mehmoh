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
  const [blocksPerLine, setBlocksPerLine] = useState(3)
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

  const isRevealing = props.isRevealing && showing >= 0

  let linesBelow
  let linesAbove
  let blocksToDraw

  if (isRevealing) {
    linesAbove = 0 // there are never any lines above when we're revealing
    // due to the fade in delay, the new line is seeming to appear too son.
    // So I'm doing -1 to make it seems to appear at a better time
    linesBelow = parseInt((showing - 1) / blocksPerLine)
    blocksToDraw = showing % blocksPerLine
  } else {
    linesBelow = parseInt(props.completed / blocksPerLine)
    linesAbove = parseInt((props.total - props.completed) / blocksPerLine)
    blocksToDraw = Math.min(
      props.completed < props.total - blocksPerLine
        ? blocksPerLine
        : props.total % blocksPerLine,
    )
  }

  if (showing > 0 && blocksToDraw === 0) {
    blocksToDraw = blocksPerLine
  }

  const keyCounter = linesBelow * blocksPerLine

  return (
    <div
      className={constructClassString(
        {hidden: props.isHidden || showing < 0},
        'round-tracker',
        props.className,
      )}>
      {[...new Array(linesAbove)].map((e, i) => (
        <div
          key={`line-above-${i}`}
          className={constructClassString(
            {
              // will only ever be black above, never revealed or completed
            },
            'round-line',
          )}
        />
      ))}
      <div className="round-step-container">
        {[...new Array(blocksPerLine)].map((e, i) => {
          // this basically gives you the block position out of total
          const key = keyCounter + i
          const isVisible = i < blocksToDraw
          const isRevealed = props.isRevealing && isVisible
          const isCompleted = !props.isRevealing && key < props.completed
          const isTip = !props.isRevealing && key === props.completed // we highlight the one currently being shown

          const refProps = i === 0 ? {ref: onRefChange} : {}

          return (
            <span
              {...refProps}
              key={key}
              className={constructClassString(
                {
                  [`key-${key}`]: true,
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
      {[...new Array(linesBelow)].map((e, i) => (
        <div
          key={`line-below-${i}`}
          className={constructClassString(
            {
              revealed: props.isRevealing,
              completed: !props.isRevealing,
            },
            'round-line',
          )}
        />
      ))}
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
