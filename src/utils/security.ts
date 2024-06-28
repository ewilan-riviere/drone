import { Dotenv } from './dotenv'

export function keyIsValid(headers: Headers): boolean {
  const dotenv = Dotenv.load()
  if (dotenv.SECRET_KEY === undefined || dotenv.SECRET_KEY === '') {
    return true
  }

  const authorization = headers.get('authorization')
  if (authorization === null) {
    return false
  }

  if (!authorization.startsWith('Bearer')) {
    return false
  }

  const token = authorization.slice(7)

  if (token === dotenv.SECRET_KEY) {
    return true
  }

  return false
}
