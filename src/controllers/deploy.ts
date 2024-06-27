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

  const host = event.headers.get('host')
  console.log(host)
  console.log(body.repository.name)

  if (event.node.req.url) {
    const requestUrl = new URL(event.node.req.url)
    console.log(requestUrl)
  }

  return {
    message: 'Deploy',
  }
}
