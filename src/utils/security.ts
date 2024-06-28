import { Dotenv } from './dotenv'

export function keyIsValid(): boolean {
  const dotenv = Dotenv.load()
  if (dotenv.SECRET_KEY === undefined || dotenv.SECRET_KEY === '') {
    return true
  }

  return false
}
