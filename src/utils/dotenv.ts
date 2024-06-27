import 'dotenv/config'

export interface IDotenv {
  PORT: number
  WEBHOOK_ENDPOINT: string
  WEBSCRIPT_ENDPOINT: string
  SCRIPT_KEY: string
  PROJECTS_ROOT?: string
}

export class Dotenv {
  public static load(): IDotenv {
    let port = process.env.PORT ?? 3000
    port = Number(port)

    return {
      PORT: port,
      WEBHOOK_ENDPOINT: process.env.WEBHOOK_ENDPOINT ?? '/deploy',
      WEBSCRIPT_ENDPOINT: process.env.WEBSCRIPT_ENDPOINT ?? '/script',
      SCRIPT_KEY: process.env.SCRIPT_KEY ?? '',
      PROJECTS_ROOT: process.env.PROJECTS_ROOT ?? '/var/www/',
    }
  }
}
