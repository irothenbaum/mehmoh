import React from 'react'
import './Vertex.scss'
import PropTypes from 'prop-types'
import useContact from '../../hooks/useContact'

function Vertex(props) {
  const {contactProps} = useContact({
    onContactStart: props.onContactStart,
    onContactEnd: props.onContactEnd,
  })
  return (
    <div
      className={`vertex ${props.isActive ? 'active' : ''} ${
        props.className || ''
      }`}
      {...contactProps}>
      <div className="vertex-inner" />
    </div>
  )
}

Vertex.propTypes = {
  isActive: PropTypes.bool,
  onContactStart: PropTypes.func,
  onContactEnd: PropTypes.func,
  className: PropTypes.string,
}

export default Vertex
