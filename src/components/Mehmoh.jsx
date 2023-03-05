import React, {useState} from 'react'
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
  const [scene, setScene] = useState(SCENE_SIMON)

  const Page = SCENE_MAP[scene]

  return <Page vertexCount={7} />
}

export default Mehmoh
