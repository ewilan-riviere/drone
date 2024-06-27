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

  const userAgent = event.headers.get('user-agent')
  const userAgentL = userAgent?.toLowerCase()
  let origin: string

  switch (userAgentL) {
    case userAgentL?.includes('github'):
      origin = 'github'
      break

    case userAgentL?.includes('gitlab'):
      origin = 'gitlab'
      break

    default:
      origin = 'unknown'
      break
  }

  console.log(body.repository.name)
  console.log(userAgentL)
  console.log(origin)

  return {
    message: 'Deploy',
  }
}
