import React, {useEffect, useState} from 'react'
import './ShieldEffect.scss'
import {constructClassString} from '../utilities'
import PropTypes from 'prop-types'
import useDoOnceTimer from '../hooks/useDoOnceTimer'

const CRACKED_TIMEOUT = 500
function ShieldEffect(props) {
  // true is recently cracked, false is definitely not cracked, null is cracked, but not recently
  const [cracked, setIsCracked] = useState(null)
  const {setTimer} = useDoOnceTimer()

  useEffect(() => {
    if (props.isActive) {
      setIsCracked(false)
    } else if (cracked === false) {
      setIsCracked(true)
      setTimer('clear-cracked', () => setIsCracked(null), CRACKED_TIMEOUT)
    }
  }, [props.isActive, cracked])
  return (
    <div
      className={constructClassString(
        {
          active: props.isActive,
          cracked: cracked,
        },
        'shield-effect-container',
      )}>
      <div className="shimmer-effect" />
    </div>
  )
}

ShieldEffect.propTypes = {
  isActive: PropTypes.bool,
}

export default ShieldEffect
