import React, {useContext, useEffect, useState} from 'react'
import './Menu.scss'
import SettingsContext from '../../SettingsContext'
import VertexPolygon from '../VertexPolygon'
import useHighScore from '../../hooks/useHighScore'
import {SCENE_SIMON} from '../../constants/routes'
import SelectVertexCount from '../utility/SelectVertexCount'
import useContact from '../../hooks/useContact'
import PropTypes from 'prop-types'
import useDoOnceTimer from '../../hooks/useDoOnceTimer'
import {constructClassString} from '../../utilities'
import Title from '../Title'

const NAVIGATING_TIMEOUT = 500
const INTRO_DURATION = 3000
const INTRO_TIMER = 'into-timer'

function Menu(props) {
  const {vertexCount} = useContext(SettingsContext)
  const [isReady, setIsReady] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const {getHighScore, clearHighScore} = useHighScore()
  const {setTimer} = useDoOnceTimer()
  const {contactProps} = useContact({
    onPress: () => {
      setIsNavigating(true)
      setTimer(
        'navigate-timer',
        () => props.onNavigate(SCENE_SIMON),
        NAVIGATING_TIMEOUT,
      )
    },
  })

  /*
  // to clear the high scores
  useEffect(() => {
    clearHighScore(SCENE_SIMON, vertexCount)
  }, [vertexCount])
  */

  useEffect(() => {
    setTimer(INTRO_TIMER, () => setIsReady(true), INTRO_DURATION)
  }, [])

  return (
    <div
      className={constructClassString(
        {navigating: isNavigating},
        'menu-container',
      )}>
      <Title key={'title'} />

      <div
        className={constructClassString(
          {ready: isReady},
          'controls-container',
        )}>
        <div className="menu-vertex-wrapper">
          <div className="menu-vertex-wrapper-inner">
            <VertexPolygon isCollapsed={isNavigating} count={vertexCount} />
          </div>
        </div>

        <div className="play-button">
          <button {...contactProps}>start</button>
        </div>

        <div className="settings-container">
          <SelectVertexCount />
          <h4>
            high score: <span>{getHighScore(SCENE_SIMON, vertexCount)}</span>
          </h4>
        </div>
      </div>
    </div>
  )
}

Menu.propTypes = {
  onNavigate: PropTypes.func,
}

export default Menu
