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
  faChevronUp,
  faChevronDown,
  faShieldHeart,
  faFireFlameCurved,
} from '@fortawesome/free-solid-svg-icons'
import {faCircle} from '@fortawesome/free-regular-svg-icons'
import {constructClassString} from '../../utilities'

export const CHEVRON_LEFT = faChevronLeft
export const CHEVRON_RIGHT = faChevronRight
export const CHEVRON_UP = faChevronUp
export const CHEVRON_DOWN = faChevronDown
export const DOWNLOAD = faDownload
export const SPINNER = faSpinner
export const CHECK = faCheck
export const BULLET = faCircle
export const CLOSE = faTimes
export const SHIELD = faShieldHeart
export const FIRE = faFireFlameCurved

function Icon(props) {
  return (
    <span
      style={props.style}
      className={constructClassString(
        {
          'has-click-handler': typeof props.onClick === 'function',
          spin: props.icon === SPINNER,
        },
        props.className,
        'icon-container',
      )}
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
