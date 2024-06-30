import { getRepositoriesFile } from '@/utils/files'

export default async () => {
  const repositories = await getRepositoriesFile()

  return {
    message: 'Repositories',
    description: 'List of repositories',
    repositories,
  }
}
