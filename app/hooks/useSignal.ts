import { usePrevious } from 'react-use'

export function useSwitchSignal<T>(value: T) {
  const wire = usePrevious(value)
  const signal = wire === undefined ? value : wire
  return signal !== value
}

export function useEdgeSignal<T>(value: T, low: T, high: T) {
  const wire = usePrevious(value)
  const signal = wire === undefined ? low : wire
  return signal === low && value === high
}
