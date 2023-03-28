import {useState} from 'react'

function useIncrement(startingValue) {
  const [value, setValue] = useState(startingValue)
  return {
    value,
    setValue,
    increment: (amount = 1) =>
      setValue(i => i + Math.max(1, Math.round(amount))),
    decrement: (amount = 1) =>
      setValue(i => i - Math.max(1, Math.round(amount))),
  }
}

export default useIncrement
