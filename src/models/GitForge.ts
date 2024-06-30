import { createError } from 'h3'
import type { BitbucketPayload, GiteaPayload, GithubPayload, GitlabPayload, Payload, RepositoryList } from '../types'
import { ForgeType } from '../types'
import { getFile, rootPath } from '../utils/files'
import { Logger } from './Logger'

export class GitForge {
  protected constructor(
    protected body: Payload,
    protected headers: Headers,
    protected type?: ForgeType,
    protected userAgent?: string,
    protected repositoryFullName?: string,
    protected repositoryOwner?: string,
    protected repositoryName?: string,
    protected repositories?: RepositoryList,
    protected signature?: string,
    protected paths?: string[],
  ) {
  }

  public static async create(body: Payload, headers: Headers): Promise<GitForge> {
    const self = new GitForge(body, headers)

    self.parseBody()
    self.parseUserAgent()
    self.tryToFindRepositoryFullName()

    if (!self.type || !self.repositoryFullName) {
      return self
    }

    self.repositories = await getFile<RepositoryList>(`${rootPath}/config/repositories.json`)
    if (!self.repositoryFullName) {
      return self
    }

    if (!self.repositoryFullName.includes('/')) {
      self.createError('Repository name must be in the format `owner/repo`.')

      return self
    }

    const [owner, name] = self.repositoryFullName.split('/')
    self.repositoryOwner = owner
    self.repositoryName = name

    self.paths = self.findRepository()

    return self
  }

  public getBody(): Payload {
    return this.body
  }

  public getHeaders(): Headers {
    return this.headers
  }

  public getType(): ForgeType | undefined {
    return this.type
  }

  public getUserAgent(): string | undefined {
    return this.userAgent
  }

  public getRepositoryFullName(): string | undefined {
    return this.repositoryFullName
  }

  public getRepositoryOwner(): string | undefined {
    return this.repositoryOwner
  }

  public getRepositoryName(): string | undefined {
    return this.repositoryName
  }

  public getRepositories(): RepositoryList | undefined {
    return this.repositories
  }

  public getSignature(): string | undefined {
    return this.signature
  }

  public getPaths(): string[] | undefined {
    return this.paths
  }

  private findRepository(): string[] | undefined {
    if (!this.repositories || !this.repositoryFullName) {
      return undefined
    }

    if (!Object.hasOwn(this.repositories, this.repositoryFullName)) {
      return undefined
    }

    let paths = this.repositories[this.repositoryFullName]

    if (!Array.isArray(paths)) {
      paths = [paths]
    }

    return paths
  }

  private createError(statusMessage: string, data?: string, status = 500): Error {
    Logger.create(statusMessage, 'error', this.headers.get('user-agent') || '')
    throw createError({
      status,
      statusMessage,
      data,
    })
  }

  private tryToFindRepositoryFullName(): void {
    if (this.type) {
      return
    }

    const error = 'Unknown Git forge type (Github, Gitlab, Bitbucket, Gitea).'

    if (!Object.hasOwn(this.body, 'repository')) {
      this.createError(`${error} Missing repository key in payload.`)

      return
    }

    if (!Object.hasOwn(this.body.repository, 'full_name')) {
      this.createError(`${error} Missing full_name key in repository object.`)

      return
    }

    this.type = ForgeType.Unknown
    const repository = this.body.repository as any
    this.repositoryFullName = repository.full_name

    if (!this.type || !this.repositoryFullName) {
      this.createError(`${error} Unable to find repository name.`)
    }
  }

  private parseBody(): void {
    if (this.isGithub(this.body)) {
      this.type = ForgeType.Github
      this.repositoryFullName = this.body.repository.full_name // `ewilan-riviere/drone-test`
      this.signature = this.headers.get('x-hub-signature-256') || undefined
    }
    else if (this.isGitlab(this.body)) {
      this.type = ForgeType.Gitlab
      this.repositoryFullName = this.body.project.path_with_namespace // `ewilan-riviere/drone-test`
      this.signature = this.headers.get('x-gitlab-token') || undefined
    }
    else if (this.isBitbucket(this.body)) {
      this.type = ForgeType.Bitbucket
      this.repositoryFullName = this.body.repository.full_name // `ewilan-riviere/drone-test`
      this.signature = this.headers.get('x-hub-signature') || undefined
    }
    else if (this.isGitea(this.body)) {
      this.type = ForgeType.Gitea
      this.repositoryFullName = this.body.repository.full_name // `ewilan-riviere/drone-test`
      this.signature = this.headers.get('x-gitea-signature') || undefined
    }
  }

  private parseUserAgent(): void {
    this.userAgent = this.headers.get('user-agent') || ''
  }

  private isGithub(body: Payload): body is GithubPayload {
    return (<GithubPayload>body).repository?.id !== undefined
  }

  private isGitlab(body: Payload): body is GitlabPayload {
    return (<GitlabPayload>body).project !== undefined
  }

  private isBitbucket(body: Payload): body is GitlabPayload {
    return (<BitbucketPayload>body).push?.changes !== undefined
  }

  private isGitea(body: Payload): body is GiteaPayload {
    return (<GiteaPayload>body).secret !== undefined
  }
}
