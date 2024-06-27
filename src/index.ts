// import { createApp, createRouter, defineEventHandler } from 'h3'
// import { deploy, root, script } from './controllers'

// export const app = createApp()

// app.listen(3000, () => {
//   console.log('Server is running on http://localhost:3000')
// })

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
router.post('/deploy', defineEventHandler(event => deploy(event)))
router.post('/script', defineEventHandler(event => script(event)))

createServer(toNodeListener(app)).listen(dotenv.PORT)

let env = colors.yellow(dotenv.ENV)
if (dotenv.ENV === 'production')
  env = colors.red(dotenv.ENV)

const baseURL = `http://localhost:${dotenv.PORT}`
consola.success(`Local server: ${colors.cyanBright(baseURL)}`)
consola.success(`Environment: ${env}`)
consola.success(`Port: ${dotenv.PORT}`)
consola.log('')
