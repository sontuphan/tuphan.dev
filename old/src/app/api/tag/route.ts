import { all } from '@/db'
import { Injectable } from '@/interceptor'
import { NextResponse } from 'next/server'

class Route {
  @Injectable()
  static async GET() {
    const raw = all.map(({ tags }) => tags).flat()
    const tags = Object.entries(
      Object.fromEntries(raw.map((tag) => [tag, ''])),
    ).map(([e]) => e)
    return NextResponse.json(tags)
  }
}

export const { GET } = Route
