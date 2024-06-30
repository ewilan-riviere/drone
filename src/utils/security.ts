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

const encoder = new TextEncoder()

export async function verifySignature(payload: string, header?: string | null, secret?: string): Promise<boolean> {
  if (secret === undefined || secret === '' || header === undefined || header === '' || header === null) {
    return true
  }

  const parts = header.split('=')
  const sigHex = parts[1]

  const algorithm = { name: 'HMAC', hash: { name: 'SHA-256' } }

  const keyBytes = encoder.encode(secret)
  const extractable = false
  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    algorithm,
    extractable,
    ['sign', 'verify'],
  )

  const sigBytes = hexToBytes(sigHex)
  const dataBytes = encoder.encode(payload)
  const equal = await crypto.subtle.verify(
    algorithm.name,
    key,
    sigBytes,
    dataBytes,
  )

  return equal
}

function hexToBytes(hex: string): Uint8Array {
  const len = hex.length / 2
  const bytes = new Uint8Array(len)

  let index = 0
  for (let i = 0; i < hex.length; i += 2) {
    const c = hex.slice(i, i + 2)
    const b = Number.parseInt(c, 16)
    bytes[index] = b
    index += 1
  }

  return bytes
}
