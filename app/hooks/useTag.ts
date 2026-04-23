import { useSearchParams } from 'react-router'

export function useTag() {
  const [params] = useSearchParams()
  const tag = params.get('tag') || ''
  return tag
}
