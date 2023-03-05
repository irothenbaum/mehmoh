import {useState} from 'react'

/**
 * @typedef onContactConstructor
 * @property {function?} onContactStart
 * @property {function?} onContactEnd
 * @property {function?} onPress
 */

/**
 * @param {onContactConstructor} onContact
 */
function useContact(onContact) {
  const [isTouching, setTouching] = useState(false)
  const handleOnPress = e => {
    if (typeof onContact.onPress === 'function') {
      onContact.onPress()
    }
  }

  const handleOnTouchStart = e => {
    setTouching(true)
    if (typeof onContact.onContactStart === 'function') {
      onContact.onContactStart()
    }
  }

  const handleOnTouchEnd = e => {
    setTouching(false)
    if (typeof onContact.onContactStart === 'function') {
      onContact.onContactEnd()
    }
  }

  const handleOnMouseDown = e => {
    setTouching(true)
    if (typeof onContact.onContactStart === 'function') {
      onContact.onContactStart()
    }
  }

  const handleOnMouseUp = e => {
    setTouching(false)
    if (typeof onContact.onContactStart === 'function') {
      onContact.onContactEnd()
    }
  }

  return {
    isTouching,
    contactProps: {
      onClick: handleOnPress,
      onTouchStart: handleOnTouchStart,
      onTouchEnd: handleOnTouchEnd,
      onMouseDown: handleOnMouseDown,
      onMouseUp: handleOnMouseUp,
    },
  }
}

export default useContact
