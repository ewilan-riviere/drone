import type { H3Event } from 'h3'
import { readBody } from 'h3'

interface GitPayload {
  ref: string
  repository: {
    name: string
    full_name: string
  }
  pusher: {
    name: string
  }

}

export default async (event: H3Event) => {
  const body = await readBody<GitPayload | undefined>(event)
  if (!body) {
    return {
      message: 'No body',
    }
  }

  console.log(body.pusher.name)

  return {
    message: 'Deploy',
  }
}
