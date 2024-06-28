export interface BitbucketPayload {
  push: {
    changes: any
  }
  repository: {
    type: string
    full_name: string
    links: { self: object, html: object, avatar: object }
    name: string
    scm: string
    website?: string
    owner: {
      display_name: string
      links: object
      type: string
      uuid: string
      username: string
    }
    workspace: {
      type: string
      uuid: string
      name: string
      slug: string
      links: object
    }
    is_private: boolean
    project: {
      type: string
      key: string
      uuid: string
      name: string
      links: object
    }
    uuid: string
    parent?: any
    actor: {
      display_name: string
      links: { self: object, avatar: object, html: object }
      type: string
      uuid: string
      username: string
    }
  }
}
