import { createApp, createRouter, defineEventHandler } from 'h3'
import { deploy, root, script } from './controllers'

export const app = createApp()

const router = createRouter()
app.use(router)

router.get('/', defineEventHandler(() => root()))
router.post('/deploy', defineEventHandler(event => deploy(event)))
router.post('/script', defineEventHandler(event => script(event)))
