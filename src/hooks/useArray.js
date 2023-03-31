import {useState} from 'react'

function useArray(startingArr) {
  const [array, setArray] = useState(startingArr || [])

  return {
    array,
    resetArray: setArray,
    append: val => setArray(prev => [...prev, val]),
  }
}

export default useArray
