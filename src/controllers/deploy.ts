import type { H3Event } from 'h3'
import { readBody } from 'h3'
import type { GithubPayload, GitlabPayload } from '@/types'

export default async (event: H3Event) => {
  const body = await readBody<GithubPayload | GitlabPayload | undefined>(event)
  if (!body) {
    return {
      message: 'No body',
    }
  }

  console.log(body)
  console.log(body.repository.name)
  console.log(event.headers)

  return {
    message: 'Deploy',
  }
}
