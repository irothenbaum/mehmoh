import React from 'react'
import './Icon.scss'
import PropTypes from 'prop-types'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight,
  faDownload,
  faSpinner,
  faCheck,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'

export const CHEVRON_LEFT = faChevronLeft
export const CHEVRON_RIGHT = faChevronRight
export const DOWNLOAD = faDownload
export const SPINNER = faSpinner
export const CHECK = faCheck
export const CLOSE = faTimes

function Icon(props) {
  return (
    <span
      className={`icon-container ${props.className || ''} ${
        typeof props.onClick === 'function' ? 'has-click-handler' : ''
      } ${props.icon === SPINNER ? 'spin' : ''}`}
      onClick={props.onClick}>
      <FontAwesomeIcon icon={props.icon} />
    </span>
  )
}

Icon.propTypes = {
  icon: PropTypes.any.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
}

export default Icon
