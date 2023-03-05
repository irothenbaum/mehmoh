import {useState} from 'react'

function useIncrement(startingValue) {
  const [value, setValue] = useState(startingValue)
  return {
    value,
    setValue,
    increment: cb =>
      setValue(i => {
        const retVal = i + 1
        typeof cb === 'function' && cb(retVal)
        return retVal
      }),
    decrement: cb =>
      setValue(i => {
        const retVal = i - 1
        typeof cb === 'function' && cb(retVal)
        return retVal
      }),
  }
}

export default useIncrement
