import React, {useState} from 'react'
import './VertexPolygon.scss'
import PropTypes from 'prop-types'
import Vertex from './utility/Vertex'
import {constructClassString} from '../utilities'

function VertexPolygon(props) {
  const [] = useState()

  const handleContactStart = i => {
    return typeof props.onContactStart === 'function'
      ? props.onContactStart(i)
      : undefined
  }

  const handleContactEnd = i => {
    return typeof props.onContactEnd === 'function'
      ? props.onContactEnd(i)
      : undefined
  }

  return (
    <div
      className={constructClassString(
        {collapsed: props.isCollapsed},
        'vertex-polygon',
        `vp-count-${props.count}`,
        props.className,
      )}>
      {[...new Array(props.count)].map((e, i) => (
        <Vertex
          key={i}
          className={`vp-vertex-${i}`}
          isActive={i === props.activeVertex}
          isSecondary={props.isSecondary}
          onContactStart={() => handleContactStart(i)}
          onContactEnd={() => handleContactEnd(i)}
        />
      ))}
    </div>
  )
}

VertexPolygon.propTypes = {
  count: PropTypes.number.isRequired,
  activeVertex: PropTypes.number,
  isSecondary: PropTypes.bool,
  isCollapsed: PropTypes.bool,
  className: PropTypes.string,
  onContactStart: PropTypes.func,
  onContactEnd: PropTypes.func,
}

export default VertexPolygon
