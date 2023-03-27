import React, {useEffect, useState} from 'react'
import './VertexPolygon.scss'
import PropTypes from 'prop-types'
import Vertex from './utility/Vertex'
import {constructClassString} from '../utilities'

function VertexPolygon(props) {
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
        {
          collapsed: props.isCollapsed,
        },
        'vertex-polygon',
        `vp-count-${props.count}`,
        props.className,
      )}>
      <div className="vertex-polygon-inner">
        {[...new Array(props.count)].map((e, i) => (
          <Vertex
            key={i}
            className={`vp-vertex-${i}`}
            isActive={i === props.activeVertex}
            isDisabled={i === props.disabledVertex}
            isSecondary={props.isSecondary}
            onContactStart={() => handleContactStart(i)}
            onContactEnd={() => handleContactEnd(i)}
          />
        ))}
      </div>
    </div>
  )
}

VertexPolygon.propTypes = {
  count: PropTypes.number.isRequired,
  activeVertex: PropTypes.number,
  disabledVertex: PropTypes.number,
  isSecondary: PropTypes.bool,
  isCollapsed: PropTypes.bool,
  className: PropTypes.string,
  onContactStart: PropTypes.func,
  onContactEnd: PropTypes.func,
}

export default VertexPolygon
