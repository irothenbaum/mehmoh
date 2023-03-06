import React from 'react'
import './LoadingSpinner.scss'
import Icon, {SPINNER} from './Icon'
import PropTypes from 'prop-types'

function LoadingSpinner(props) {
  return (
    <div
      className={`loading-spinner ${
        props.size || LoadingSpinner.SIZE_DEFAULT
      }`}>
      <Icon icon={SPINNER} />
    </div>
  )
}

LoadingSpinner.SIZE_EXTRA_SMALL = 'x-small'
LoadingSpinner.SIZE_SMALL = 'small'
LoadingSpinner.SIZE_DEFAULT = ''
LoadingSpinner.SIZE_LARGE = 'large'
LoadingSpinner.SIZE_EXTRA_LARGE = 'x-large'

LoadingSpinner.propTypes = {
  size: PropTypes.string,
}

export default LoadingSpinner
