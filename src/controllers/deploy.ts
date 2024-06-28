import childprocess from 'node:child_process'
import type { H3Event } from 'h3'
import { createError, readBody } from 'h3'
import type { Payload } from '@/types'
import { GitForge } from '@/models/GitForge'
import { Logger } from '@/models/Logger'

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
  console.log('')

  if (forge.getPaths() === undefined) {
    await Logger.create(`${forge.getRepositoryFullName()}: no paths found`, 'error')
  }

  const paths = forge.getPaths() as string[]
  for (const path of paths) {
    console.log(path)
    const command = `cd ${path} && git pull`
    try {
      const { stdout, stderr } = await childprocess.exec(command)
      console.log(stdout)
      console.log(stderr)
    }
    catch (error) {
      console.log(error)
    }
  }

  return {
    message: 'Git Hook received!',
    repository: body.repository.name,
    origin,
  }
}
