import type { H3Event } from 'h3'
import { readBody } from 'h3'
import type { GitPayload } from '@/types'

export default async (event: H3Event) => {
  const body = await readBody<GitPayload | undefined>(event)
  if (!body) {
    return {
      message: 'No body',
    }
  }

  console.log(body)

  return {
    message: 'Deploy',
  }
}
