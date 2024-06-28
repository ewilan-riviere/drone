import type { H3Event } from 'h3'
import { createError, readBody } from 'h3'
import type { Payload } from '@/types'
import { GitForge } from '@/models/GitForge'
import { Logger } from '@/models/Logger'
import { runCommand } from '@/utils/command'

export default async (event: H3Event) => {
  const body = await readBody<Payload | undefined>(event)

  if (!body) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      data: 'No body',
    })
  }

  await Logger.createLogFile()
  const forge = await GitForge.create(body, event.headers)
  console.log(forge.getType())
  console.log(forge.getRepositoryFullName())
  console.log(forge.getRepositoryOwner())
  console.log(forge.getRepositoryName())
  console.log(forge.getRepositories())
  console.log(forge.getPaths())

  if (forge.getPaths() === undefined) {
    await Logger.create(`${forge.getRepositoryFullName()}: no paths found`, 'error')
  }

  const paths = forge.getPaths() as string[]
  for (const path of paths) {
    const command = `cd ${path} && git pull`
    const output = await runCommand(command)
    Logger.log(`Git hook for ${forge.getRepositoryFullName()} to ${path} and output: ${output}`)
  }

  console.log('')

  return {
    message: 'Git Hook received!',
    repository: body.repository.name,
    origin,
  }
}
