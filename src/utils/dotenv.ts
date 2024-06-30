import 'dotenv/config'

export interface IDotenv {
  ENV: 'development' | 'production' | 'test'
  IS_PRODUCTION: boolean
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

    let key: string | undefined
    if (process.env.SECRET_KEY !== undefined && process.env.SECRET_KEY.length > 0) {
      key = process.env.SECRET_KEY
    }

    return {
      ENV: process.env.ENV as 'development' | 'production' | 'test',
      IS_PRODUCTION: process.env.ENV === 'production',
      PORT: port,
      HOST: process.env.HOST ?? 'localhost',
      HTTPS: process.env.HTTPS === 'true',
      ENDPOINT: process.env.ENDPOINT ?? '/deploy',
      SECRET_KEY: key,
    }
  }
}
