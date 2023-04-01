import React, {useEffect, useState} from 'react'
import './VertexPolygon.scss'
import PropTypes from 'prop-types'
import Vertex from './utility/Vertex'
import {constructClassString} from '../utilities'

function VertexPolygon(props) {
  const handlePress = i => {
    return typeof props.onPress === 'function' ? props.onPress(i) : undefined
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
            onPress={() => handlePress(i)}
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
  onPress: PropTypes.func,
}

export default VertexPolygon
