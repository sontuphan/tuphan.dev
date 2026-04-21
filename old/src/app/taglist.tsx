'use client'
import ky from 'ky'
import useSWR from 'swr'
import Tags from '@/components/tags'

import { useTag } from '@/lib/hooks/useTag'

export default function TagList() {
  const tag = useTag()
  const { data: tags = [] } = useSWR('/api/tag', async (api: string) => {
    const data = await ky.get(api).json<string[]>()
    return data
  })
  return (
    <Tags className="flex flex-row flex-wrap gap-2" value={tags} active={tag} />
  )
}
