export interface GiteaPayload {
  secret: string
  ref: string
  before: string
  after: string
  compare_url: string
  commits: Commit[]
  repository: Repository
  pusher: AuthUser
  sender: AuthUser
}

interface Commit {
  id: string
  message: string
  url: string
  author: User
  committer: User
  timestamp: '2017-03-13T13:52:11-04:00'
}

interface User {
  name: string
  email: string
  username: string
}

interface AuthUser {
  id: number
  login: string
  full_name: string
  email: string
  avatar_url: string
  username: string
}

interface Repository {
  id: number
  owner: {
    id: number
    login: string
    full_name: string
    email: string
    avatar_url: string
    username: string
  }
  name: string
  full_name: string
  description: string
  private: boolean
  fork: boolean
  html_url: string
  ssh_url: string
  clone_url: string
  website: ''
  stars_count: number
  forks_count: number
  watchers_count: number
  open_issues_count: number
  default_branch: string
  created_at: string
  updated_at: string
}
