import type { GithubPayload } from './github'
import type { GitlabPayload } from './gitlab'
import type { BitbucketPayload } from './bitbucket'
import type { GiteaPayload } from './gitea'

interface RepositoryList {
  [key: string]: string[] | string
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
  RepositoryList,
  Payload,
  ForgeType,
  LogLevel,
}
