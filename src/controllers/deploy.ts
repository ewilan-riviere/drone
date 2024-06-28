import type { H3Event } from 'h3'
import { createError, readBody } from 'h3'
import type { Payload } from '@/types'
import { GitForge } from '@/models/GitForge'
import { Logger } from '@/models/Logger'
import { runCommand } from '@/utils/command'

export default async (event: H3Event) => {
  const body = await readBody<Payload | undefined>(event)
  const userAgent = event.headers.get('User-Agent')
  console.log(event.headers)
  await Logger.createLogFile()

  if (!body) {
    Logger.create(`Received event from ${userAgent}`, 'error')
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      data: 'No body',
    })
  }

  Logger.create(`Received event from ${userAgent}`, 'info')
  const forge = await GitForge.create(body, event.headers)

  if (forge.getPaths() === undefined) {
    await Logger.create(`${forge.getRepositoryFullName()}: not founded into 'repositories.json'`, 'error')
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
