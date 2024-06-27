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

  console.log(body)
  console.log(body.repository.name)
  console.log(origin)

  const repositories = await getRepositoriesList()
  if (repositories.length === 0) {
    throw createError({
      status: 500,
      statusMessage: 'No repositories found',
      data: 'No repositories found, check if repositories.json exists at root of project.',
    })
  }

  console.log(repositories)

  return {
    message: 'Git Hook received!',
    repository: body.repository.name,
    origin,
  }
}

/**
 * Get the list of repositories at root of repository.
 */
async function getRepositoriesList(): Promise<string[]> {
  const rootPath = process.cwd()
  const filePath = `${rootPath}/repositories.json`
  const isExists = await checkFileExists(filePath)

  if (!isExists) {
    return []
  }

  const contents = await getFileContent(filePath)
  const json = JSON.parse(contents)

  return json
}

/**
 * Check if file exists.
 */
async function checkFileExists(path: string): Promise<boolean> {
  try {
    await fs.promises.access(path, fs.constants.F_OK)
    return true
  }
  catch (err) {
    return false
  }
}

/**
 * Get file content.
 */
async function getFileContent(path: string) {
  return await fs.promises.readFile(path, 'utf-8')
}
