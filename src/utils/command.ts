import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { Logger } from '@/models/Logger'

const execAsync = promisify(exec)

export async function runCommand(command: string): Promise<string | undefined> {
  try {
    const { stdout, stderr } = await execAsync(command)
    if (stderr) {
      Logger.log(`Error executing command: ${stderr}`)
    }

    return stdout
  }
  catch (error) {
    Logger.log(`Error executing command: ${error}`)

    return undefined
  }
}
