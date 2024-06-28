import type { GithubPayload } from './github'
import type { GitlabPayload } from './gitlab'
import type { BitbucketPayload } from './bitbucket'
import type { GiteaPayload } from './gitea'

interface Repository {
  path: string
  branch?: string | 'any'
}

interface RepositoryList {
  [key: string]: Repository[] | Repository
}

type Payload = GithubPayload | GitlabPayload | BitbucketPayload | GiteaPayload

type LogLevel = 'info' | 'warn' | 'error'

enum ForgeType {
  Github = 'github',
  Gitlab = 'gitlab',
  Bitbucket = 'bitbucket',
  Gitea = 'gitea',
  Unknown = 'unknown',
}

export {
  GithubPayload,
  GitlabPayload,
  BitbucketPayload,
  GiteaPayload,
  Repository,
  RepositoryList,
  Payload,
  ForgeType,
  LogLevel,
}
