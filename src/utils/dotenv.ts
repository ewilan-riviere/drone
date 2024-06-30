import 'dotenv/config'

export interface IDotenv {
  ENV: 'development' | 'production' | 'test'
  PORT: number
  HOST: string
  HTTPS: boolean
  ENDPOINT: string
  SECRET_KEY?: string
}

export class Dotenv {
  public static load(): IDotenv {
    let port = process.env.PORT ?? 3000
    port = Number(port)

    return {
      ENV: process.env.ENV as 'development' | 'production' | 'test',
      PORT: port,
      HOST: process.env.HOST ?? 'localhost',
      HTTPS: process.env.HTTPS === 'true',
      ENDPOINT: process.env.ENDPOINT ?? '/deploy',
      SECRET_KEY: process.env.SECRET_KEY,
    }
  }
}
