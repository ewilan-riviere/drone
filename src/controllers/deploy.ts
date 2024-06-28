import fs from 'node:fs'
import type { H3Event } from 'h3'
import { createError, readBody } from 'h3'
import type { GithubPayload, GitlabPayload, RepositoryList } from '@/types'

export default async (event: H3Event) => {
  const body = await readBody<GithubPayload | GitlabPayload | undefined>(event)
  console.log(body)

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

  if (origin === 'unknown') {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      data: 'Unknown origin',
    })
  }

  const repositories = await getRepositoriesList()
  if (repositories === undefined) {
    throw createError({
      status: 500,
      statusMessage: 'No repositories found',
      data: 'No repositories found, check if repositories.json exists at root of project.',
    })
  }

  console.log(body.repository.name)
  console.log(origin)
  console.log(repositories)

  let fullName: string | undefined

  if (isGithub(body)) {
    fullName = body.repository.full_name // `ewilan-riviere/drone-test`
  }
  else if (isGitlab(body)) {
    fullName = body.project.path_with_namespace // `ewilan-riviere/drone-test`
  }

  if (!fullName || !fullName.includes('/')) {
    throw createError({
      status: 400,
      statusMessage: 'Bad Request',
      data: 'No full name',
    })
  }

  const repositoryName = fullName.split('/')[1]
  console.log(repositoryName)

  return {
    message: 'Git Hook received!',
    repository: body.repository.name,
    origin,
  }
}

function isGithub(body: GithubPayload | GitlabPayload): body is GithubPayload {
  return (<GithubPayload>body).repository.id !== undefined
}

function isGitlab(body: GithubPayload | GitlabPayload): body is GitlabPayload {
  return (<GitlabPayload>body).project !== undefined
}

/**
 * Get the list of repositories at root of repository.
 */
async function getRepositoriesList(): Promise<RepositoryList | undefined> {
  const rootPath = process.cwd()
  const filePath = `${rootPath}/repositories.json`
  const isExists = await checkFileExists(filePath)

  if (!isExists) {
    return undefined
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
