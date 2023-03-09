import {useState, useRef, useEffect} from 'react'
import useDoOnceTimer from './useDoOnceTimer'
import {getRandomString} from '../utilities'

/**
 * @typedef onContactConstructor
 * @property {function?} onContactStart
 * @property {function?} onContactEnd
 * @property {function?} onPress
 */

const BLINK = 182

/**
 * @param {Element} e
 * @param {string} event
 * @return {string}
 */
function hashElement(e, event) {
  if (!e.id) {
    e.id = getRandomString(10)
  }
  return `${e.id}-${event}`
}

/**
 * @param {onContactConstructor} onContact
 */
function useContact(onContact) {
  const {setTimer, cancelTimer} = useDoOnceTimer()
  const [isTouching, setTouching] = useState(false)
  const recentTouches = useRef({})

  /**
   * @param element
   * @param eventType
   * @param callback
   */
  function handleEventWithDuplicateControl(element, eventType, callback) {
    if (typeof callback === 'function') {
      const hash = hashElement(element, eventType)
      if (!recentTouches.current[hash]) {
        recentTouches.current[hash] = true
        setTimer(hash, () => delete recentTouches.current[hash], BLINK)
        callback()
      } else {
        // the element was touched recently, ignore
      }
    } else {
      // no callback, ignore
    }
  }

  useEffect(() => {
    return () => {
      // clear our timers
      Object.keys(recentTouches.current).map(cancelTimer)
    }
  }, [])

  const handleOnPress = e => {
    handleEventWithDuplicateControl(e.target, 'press', onContact.onPress)
  }

  const handleOnTouchStart = e => {
    setTouching(true)
    handleEventWithDuplicateControl(e.target, 'start', onContact.onContactStart)
  }

  const handleOnTouchEnd = e => {
    setTouching(false)
    handleEventWithDuplicateControl(e.target, 'end', onContact.onContactEnd)
  }

  const handleOnMouseDown = e => {
    setTouching(true)
    handleEventWithDuplicateControl(e.target, 'start', onContact.onContactStart)
  }

  const handleOnMouseUp = e => {
    setTouching(false)
    handleEventWithDuplicateControl(e.target, 'end', onContact.onContactEnd)
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
