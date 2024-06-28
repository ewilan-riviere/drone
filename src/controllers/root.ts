import { getFile, rootPath } from '@/utils/files'

export default async () => {
  let repositories = await getFile<any>(`${rootPath}/repositories.json`)

  return {
    message: 'Drone',
    description: 'A simple webhook server for deploying projects',
    repositories: repositories || [],
  }
}
