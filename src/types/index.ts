import { GithubPayload } from './github'
import { GitlabPayload } from './gitlab'
import type { BitbucketPayload } from './bitbucket'

interface Repository {
  path: string
  branch?: string | 'any'
}

interface RepositoryList {
  [key: string]: Repository[] | Repository
}

type Payload = GithubPayload | GitlabPayload | BitbucketPayload

export {
  GithubPayload,
  GitlabPayload,
  BitbucketPayload,
  Repository,
  RepositoryList,
  Payload,
}
