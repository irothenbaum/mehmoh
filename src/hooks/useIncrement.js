import {useState} from 'react'

function useIncrement(startingValue) {
  const [value, setValue] = useState(startingValue)
  return {
    value,
    setValue,
    increment: () => setValue(i => i + 1),
    decrement: () => setValue(i => i - 1),
  }
}

export default useIncrement
