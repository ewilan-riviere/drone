import { type H3Event, createError, readBody } from 'h3'
import { keyIsValid } from '@/utils/security'
import { runCommand } from '@/utils/command'

export default async (event: H3Event) => {
  if (event.headers.get('authorization') === null) {
    throw createError({
      status: 400,
      statusMessage: 'Invalid request!',
    })
  }

  const isValid = keyIsValid(event.headers)
  if (!isValid) {
    throw createError({
      status: 401,
      statusMessage: 'Unauthorized, bearer token is invalid or missing.',
    })
  }

  const body = await readBody(event)
  if (!body) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      data: 'No body',
    })
  }

  if (!Object.hasOwn(body, 'command')) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      data: 'No command',
    })
  }

  const command = body.command
  const output = await runCommand(command)

  return {
    message: 'Script received!',
    command,
    output,
  }
}
