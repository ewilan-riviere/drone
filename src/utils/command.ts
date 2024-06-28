import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

export async function runCommand(command: string): Promise<void> {
  try {
    const { stdout, stderr } = await execAsync(command)
    console.log('Output:', stdout)
    if (stderr) {
      console.log('Error:', stderr)
    }
  }
  catch (error) {
    console.log('Execution error:', error)
  }
}
