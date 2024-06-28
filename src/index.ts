import { createServer } from 'node:http'
import { createApp, createRouter, defineEventHandler, toNodeListener } from 'h3'
import { consola } from 'consola'
import { colors } from 'consola/utils'
import { Dotenv } from './utils/dotenv'
import { deploy, root, script } from './controllers'

const dotenv = Dotenv.load()

consola.log('')
consola.info('Starting server...')

export const app = createApp()

const router = createRouter()
app.use(router)

router.get('/', defineEventHandler(() => root()))
if (dotenv.WEBHOOK_ENDPOINT) {
  router.post(dotenv.WEBHOOK_ENDPOINT, defineEventHandler(event => deploy(event)))
}
if (dotenv.WEBSCRIPT_ENDPOINT) {
  router.post(dotenv.WEBSCRIPT_ENDPOINT, defineEventHandler(event => script(event)))
}

createServer(toNodeListener(app)).listen(dotenv.PORT)

let env = colors.yellow(dotenv.ENV)
if (dotenv.ENV === 'production')
  env = colors.red(dotenv.ENV)

const prefix = dotenv.HTTPS ? 'https' : 'http'
const baseURL = `${prefix}://${dotenv.HOST}:${dotenv.PORT}`
consola.success(`Local server: ${colors.cyanBright(baseURL)}`)
consola.success(`Environment: ${env}`)
consola.success(`Port: ${dotenv.PORT}`)
consola.log('')
