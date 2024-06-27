export interface GitlabPayload {
  object_kind: string
  event_name: string
  before: string
  after: string
  ref: string
  ref_protected: boolean
  checkout_sha: string
  message: any
  user_id: number
  user_name: string
  user_username: string
  user_email: string
  user_avatar: string
  project_id: number
  project: Project
  commits: Commit[]
  total_commits_count: number
  push_options: any
  repository: Repository
}

interface Project {
  id: number
  name: string
  description: string
  web_url: string
  avatar_url: string
  git_ssh_url: string
  git_http_url: string
  namespace: string
  visibility_level: number
  path_with_namespace: string
  default_branch: string
  ci_config_path: string
  homepage: string
  url: string
  ssh_url: string
  http_url: string
}

interface Commit {
  id: string
  message: string
  title: string
  timestamp: string
  url: string
  author: any[]
  added: any[]
  modified: any[]
  removed: any[]
}

interface Repository {
  name: string
  url: string
  description?: string
  homepage: string
  git_http_url: string
  git_ssh_url: string
  visibility_level: number
}
