import { useEffect } from 'react'
import { useNavigate } from 'react-router'

export default function Blog() {
  const push = useNavigate()

  useEffect(() => {
    push('/')
  }, [push])
}
