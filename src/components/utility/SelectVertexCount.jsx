import React, {useContext, useEffect, useRef, useState} from 'react'
import './SelectVertexCount.scss'
import SettingsContext from '../../SettingsContext'
import useContact from '../../hooks/useContact'
import {constructClassString} from '../../utilities'
import {MAX_VERTEX_COUNT, MIN_VERTEX_COUNT} from '../../constants/game'
import Icon, {CHEVRON_UP, CHEVRON_DOWN} from './Icon'
import useDoOnceTimer from '../../hooks/useDoOnceTimer'

const CHANGE_TIMER = 'change-vertex-count-timer'

function SelectVertexCount() {
  const {vertexCount, updateSettings} = useContext(SettingsContext)
  const prevVertexCount = useRef(vertexCount)
  const [changeDirection, setChangeDirection] = useState(0)
  const {setTimer} = useDoOnceTimer()

  const {contactProps: incContactProps} = useContact({
    onPress: () =>
      vertexCount < MAX_VERTEX_COUNT
        ? updateSettings({vertexCount: vertexCount + 1})
        : null,
  })
  const {contactProps: decContactProps} = useContact({
    onPress: () =>
      vertexCount > MIN_VERTEX_COUNT
        ? updateSettings({vertexCount: vertexCount - 1})
        : null,
  })

  useEffect(() => {
    if (prevVertexCount.current === vertexCount) {
      return
    }

    setChangeDirection(prevVertexCount.current < vertexCount ? 1 : -1)

    prevVertexCount.current = vertexCount
    setTimer(CHANGE_TIMER, () => setChangeDirection(0), 500)
  }, [vertexCount])

  return (
    <div
      className={constructClassString(
        {active: false, secondary: false},
        'select-vertex-count-container',
      )}>
      <h3>{vertexCount}</h3>
      <div className="vertex-count-controls">
        <Icon
          {...incContactProps}
          icon={CHEVRON_UP}
          className={constructClassString({active: changeDirection > 0})}
        />
        <Icon
          {...decContactProps}
          icon={CHEVRON_DOWN}
          className={constructClassString({secondary: changeDirection < 0})}
        />
      </div>
    </div>
  )
}

export default SelectVertexCount
