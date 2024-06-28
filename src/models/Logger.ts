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
      await self.purgeLogFile()
    }
    await self.write()

    return self
  }

  public static async createLogFile(): Promise<void> {
    const self = new Logger('', 'info', new Date())
    if (await self.checkFileExists(self.logPath())) {
      return
    }

    try {
      await fs.promises.writeFile(self.logPath(), '')
      await self.purgeLogFile()
    }
    catch (error) {
      console.error(`Error creating log file: ${error}`)
    }
  }

  private async checkFileExists(path: string): Promise<boolean> {
    try {
      await fs.promises.access(path, fs.constants.F_OK)
      return true
    }
    catch (err) {
      return false
    }
  }

  private async write(): Promise<void> {
    const log = `${this.timestamp.toISOString()} [${this.level.toUpperCase()}] ${this.message}`
    if (this.data) {
      log.concat(`: ${this.data}`)
    }
    log.concat('')

    try {
      await fs.promises.appendFile(this.logPath(), `${log}\n`)
    }
    catch (error) {
      console.error(`Error writing to log file: ${error}`)
    }
  }

  private async purgeLogFile(): Promise<void> {
    await fs.promises.truncate(this.logPath(), 0)
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
