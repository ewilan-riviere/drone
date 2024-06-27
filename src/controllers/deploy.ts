import fs from 'node:fs'
import type { H3Event } from 'h3'
import { createError, readBody } from 'h3'
import type { GithubPayload, GitlabPayload } from '@/types'

export default async (event: H3Event) => {
  const body = await readBody<GithubPayload | GitlabPayload | undefined>(event)
  if (!body || !body.repository || !body.repository.name) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid body',
      data: !body ? 'No body' : !body.repository ? 'No repository' : 'No repository name',
    })
  }

  const userAgent = event.headers.get('user-agent')
  const userAgentL = userAgent?.toLowerCase()
  let origin = 'unknown'

  if (userAgentL?.includes('github')) {
    origin = 'github'
  }
  else if (userAgentL?.includes('gitlab')) {
    origin = 'gitlab'
  }

  console.log(body.repository.name)
  console.log(origin)

  await getRepositoriesList()

  return {
    message: 'Deploy',
  }
}

/**
 * Get the list of repositories at root of repository.
 */
async function getRepositoriesList() {
  const rootPath = process.cwd()
  const filePath = `${rootPath}/repositories.json`
  const isExists = checkFileExists(filePath)

  console.log(`File exists: ${isExists} at ${filePath}`)
}

function checkFileExists(path: string): boolean {
  let isExists = false
  fs.access(path, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(err)
      isExists = false
    }

    isExists = true
  })

  return isExists
}
