import React, {useState} from 'react'
import './Simon.scss'
import useIncrement from '../../hooks/useIncrement'
import VertexPolygon from '../VertexPolygon'

function Simon() {
  const {value: round, increment: nextRound} = useIncrement(1)
  const [selectedV, setSelected] = useState(null)

  const handleVertexTouch = vertNum => {
    console.log(vertNum)
    setSelected(vertNum)
  }

  return (
    <div className="simon-game">
      <VertexPolygon
        count={3}
        onContactStart={handleVertexTouch}
        activeVertex={selectedV}
      />
    </div>
  )
}

export default Simon
