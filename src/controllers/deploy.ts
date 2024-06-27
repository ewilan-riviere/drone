import type { H3Event } from 'h3'
import { readBody } from 'h3'

export default async (event: H3Event) => {
  const body = await readBody(event)
  console.log(body)

  return {
    message: 'Deploy',
  }
}
