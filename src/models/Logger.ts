import fs from 'node:fs'
import type { LogLevel } from '@/types'

export class Logger {
  protected constructor(
    protected message: string,
    protected level: LogLevel,
    protected timestamp: Date,
  ) {
  }

  public static async create(message: string, level: LogLevel): Promise<Logger> {
    const self = new Logger(message, level, new Date())
    await self.write()

    return self
  }

  private async write(): Promise<void> {
    const log = `${this.timestamp.toISOString()} [${this.level.toUpperCase()}] ${this.message}\n`
    await fs.promises.appendFile(this.logPath(), log)
  }

  private logPath(): string {
    let root = process.cwd()
    if (!root.endsWith('/')) {
      root += '/'
    }

    return `${root}drone.log`
  }
}
