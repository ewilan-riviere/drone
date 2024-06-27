import { GithubPayload } from './github'
import { GitlabPayload } from './gitlab'

interface Repository {
  path: string
  branch?: string | 'any'
}

interface RepositoryList {
  [key: string]: Repository[] | Repository
}

export {
  GithubPayload,
  GitlabPayload,
  Repository,
  RepositoryList,
}
