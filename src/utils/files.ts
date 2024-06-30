import fs from 'node:fs'
import type { RepositoryList } from '@/types'

export const rootPath = process.cwd()

export async function getRepositoriesFile(): Promise<RepositoryList | undefined> {
  const repositories = await getFile<RepositoryList>(`${rootPath}/config/repositories.json`)

  return repositories
}

/**
 * Get the list of repositories at root of repository.
 */
export async function getFile<T>(path: string): Promise<T | undefined> {
  const isExists = await fileExists(path)

  if (!isExists) {
    return undefined
  }

  const contents = await fileContents(path)
  const json = JSON.parse(contents)

  return json
}

/**
 * Check if file exists.
 */
export async function fileExists(path: string): Promise<boolean> {
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
export async function fileContents(path: string): Promise<string> {
  return await fs.promises.readFile(path, 'utf-8')
}
