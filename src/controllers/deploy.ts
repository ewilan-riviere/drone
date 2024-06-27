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

  console.log(body.repository.name)

  const userAgent = event.headers.get('user-agent')
  console.log(userAgent)

  return {
    message: 'Deploy',
  }
}
