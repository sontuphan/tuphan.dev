import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import { deepEqual } from 'fast-equals'

/**
 * To delay the i/o value
 * @param value The original value
 * @param ms Miliseconds
 * @returns The delayed value
 */
export function useThrottle<T>(value: T, ms: number = 500): T | undefined {
  const [debounce, setDebounce] = useState<T>()
  const [, cancel] = useDebounce(
    () => {
      setDebounce((prev) => {
        if (deepEqual(prev, value)) return prev
        return value
      })
    },
    ms,
    [value],
  )

  // Stop event if unmounted
  useEffect(() => cancel, [cancel])

  return debounce
}
