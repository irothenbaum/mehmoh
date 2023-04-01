import React from 'react'
import './Vertex.scss'
import PropTypes from 'prop-types'
import useContact from '../../hooks/useContact'
import {constructClassString} from '../../utilities'

function Vertex(props) {
  const {contactProps} = useContact({
    onPress: props.onPress,
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
  onPress: PropTypes.func,
  className: PropTypes.string,
}

export default Vertex
