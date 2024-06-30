import type { H3Event } from 'h3'
import { createError, readBody } from 'h3'
import type { Payload } from '@/types'
import { GitForge } from '@/models/GitForge'
import { Logger } from '@/models/Logger'
import { runCommand } from '@/utils/command'
import { verifySignature } from '@/utils/security'

export default async (event: H3Event) => {
  const body = await readBody<Payload | undefined>(event)
  const userAgent = event.headers.get('User-Agent')

  await Logger.createLogFile()

  if (!body) {
    Logger.create(`Received event from ${userAgent}`, 'error')
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      data: 'No body',
    })
  }

  console.log(event.headers)
  Logger.create(`Received event from ${userAgent}`, 'info')
  const forge = await GitForge.create(body, event.headers)
  const isValid = await verifySignature(JSON.stringify(body), forge.getSignature(), forge.getType())
  console.log(isValid)

  if (!isValid) {
    Logger.create('Invalid signature', 'error', userAgent || '')
    throw createError({
      status: 401,
      statusMessage: 'Unauthorized',
      data: 'Invalid signature',
    })
  }

  if (forge.getPaths() === undefined) {
    await Logger.create(`${forge.getRepositoryFullName()}: not founded into 'repositories.json'`, 'error')

    throw createError({
      status: 500,
      statusMessage: 'Repository not found',
      data: 'You should check your configuration',
    })
  }

  const paths = forge.getPaths() as string[]
  for (const path of paths) {
    const command = `cd ${path} && git pull`
    const output = await runCommand(command)

    const msg = `git hook for '${forge.getRepositoryFullName()}' (${forge.getType()?.toString()}) to '${path}'`
    if (output) {
      Logger.create(`Success for ${msg} and output: ${output}`, 'info')
    }
    else {
      Logger.create(`Failed for ${msg}`, 'error')
    }
  }

  return {
    message: 'Git Hook received!',
    repository: forge.getRepositoryFullName(),
    type: forge.getType()?.toString(),
  }
}
