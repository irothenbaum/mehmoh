import React, {useRef, useState} from 'react'
import './Mehmoh.scss'
import {SCENE_MENU, SCENE_SIMON, SCENE_MAZE} from '../constants/routes'
import Simon from './scenes/Simon'
import Maze from './scenes/Maze'
import Menu from './scenes/Menu'

const SCENE_MAP = {
  [SCENE_MAZE]: Maze,
  [SCENE_SIMON]: Simon,
  [SCENE_MENU]: Menu,
}

function Mehmoh(props) {
  const container = useRef()
  const [scene, setScene] = useState(SCENE_SIMON)

  const Page = SCENE_MAP[scene]

  return (
    <div id="mehmoh" ref={container}>
      <Page vertexCount={6} />
    </div>
  )
}

export default Mehmoh
