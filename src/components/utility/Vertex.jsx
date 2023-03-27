import React from 'react'
import './Vertex.scss'
import PropTypes from 'prop-types'
import useContact from '../../hooks/useContact'
import {constructClassString} from '../../utilities'

function Vertex(props) {
  const {contactProps} = useContact({
    onContactStart: props.onContactStart,
    onContactEnd: props.onContactEnd,
  })
  return (
    <div
      className={constructClassString(
        {
          active: props.isActive,
          secondary: props.isSecondary,
          disabled: props.isDisabled,
        },
        'vertex',
        props.className,
      )}
      {...contactProps}>
      <div className="vertex-inner" />
    </div>
  )
}

Vertex.propTypes = {
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isSecondary: PropTypes.bool,
  onContactStart: PropTypes.func,
  onContactEnd: PropTypes.func,
  className: PropTypes.string,
}

export default Vertex
