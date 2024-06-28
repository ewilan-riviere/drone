import fs from 'node:fs'
import type { LogLevel } from '@/types'

export class Logger {
  protected constructor(
    protected message: string,
    protected level: LogLevel,
    protected timestamp: Date,
    protected data?: string,
  ) {
  }

  public static async create(message: string, level: LogLevel, data?: string): Promise<Logger> {
    const self = new Logger(message, level, new Date(), data)
    const size = await self.sizeOfLogFile()
    if (size > 1024 * 1024) {
      await fs.promises.truncate(self.logPath(), 0)
    }
    await self.write()

    return self
  }

  private async write(): Promise<void> {
    const log = `${this.timestamp.toISOString()} [${this.level.toUpperCase()}] ${this.message}`
    if (this.data) {
      log.concat(`: ${this.data}`)
    }
    log.concat('')

    await fs.promises.appendFile(this.logPath(), `${log}\n`)
  }

  private async sizeOfLogFile(): Promise<number> {
    const stats = await fs.promises.stat(this.logPath())

    return stats.size
  }

  private logPath(): string {
    let root = process.cwd()
    if (!root.endsWith('/')) {
      root += '/'
    }

    return `${root}drone.log`
  }
}
