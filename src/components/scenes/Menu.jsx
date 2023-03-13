import React, {useContext, useState} from 'react'
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

const NAVIGATING_TIMEOUT = 500

function Menu(props) {
  const {vertexCount} = useContext(SettingsContext)
  const [isNavigating, setIsNavigating] = useState(false)
  const {getHighScore} = useHighScore()
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

  return (
    <div
      className={constructClassString(
        {navigating: isNavigating},
        'menu-container',
      )}>
      <h1>
        m<span className="active">e</span>h
        <br />m<span className="secondary">o</span>h
      </h1>

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
  )
}

Menu.propTypes = {
  onNavigate: PropTypes.func,
}

export default Menu
