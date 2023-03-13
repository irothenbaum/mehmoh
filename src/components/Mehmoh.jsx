import React, {useRef, useState} from 'react'
import './Mehmoh.scss'
import {SCENE_MENU, SCENE_SIMON, SCENE_MAZE} from '../constants/routes'
import Simon from './scenes/Simon'
import Maze from './scenes/Maze'
import Menu from './scenes/Menu'
import SettingsContext, {
  HydratedSettings,
  flushSettings,
} from '../SettingsContext'

const SCENE_MAP = {
  [SCENE_MAZE]: Maze,
  [SCENE_SIMON]: Simon,
  [SCENE_MENU]: Menu,
}

function Mehmoh(props) {
  const [settings, setSettings] = useState(HydratedSettings)
  const container = useRef()
  const [scene, setScene] = useState(SCENE_MENU)

  const Page = SCENE_MAP[scene]

  return (
    <div id="mehmoh" ref={container}>
      <SettingsContext.Provider
        value={{
          ...settings,
          updateSettings: obj =>
            setSettings(s => {
              const updatedValue = {...s, ...obj}
              flushSettings(updatedValue)
              return updatedValue
            }),
        }}>
        <Page onNavigate={setScene} />
      </SettingsContext.Provider>
    </div>
  )
}

export default Mehmoh
