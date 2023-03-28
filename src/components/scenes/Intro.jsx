import React, {useRef} from 'react'
import './Intro.scss'
import FireEffect from '../FireEffect'

function Intro(props) {
  return (
    <div className="intro-container">
      <FireEffect />
    </div>
  )
}

export default Intro
