require('dotenv').config()
const slugify = require('slugify')
const fs = require('node:fs')

const port = Number.parseInt(process.env.PORT || '3000', 10)

const express = require('express')
const http = require('node:http')

const app = express()
const childprocess = require('node:child_process')
const path = require('node:path')
const bodyParser = require('body-parser')
const shell = require('shelljs')

app.use(bodyParser.json())

app.post(process.env.WEBHOOK_PATH || '/deploy', (req, res) => {
  if (!req.body || !req.body.repository || !req.body.repository.name) {
    return res.status(400).json({
      message: 'Invalid request!',
    })
  }

  const name = slugify(req.body.repository.name, {
    lower: true,
  })

  let dirs = [name]

  const repositories = JSON.parse(fs.readFileSync('repositories.json'))
  if (repositories[name]) {
    dirs = repositories[name]
  }

  dirs.forEach((dirname) => {
    const projectDir = path.normalize(process.env.PROJECTS_ROOT + dirname)

    childprocess.exec(`cd ${projectDir} && git pull`)

    const date = new Date()
    console.log(`${projectDir} pulled at ${date.toString()} !`)
  })

  res.status(200).json({
    message: 'Git Hook received!',
  })
})

app.post(process.env.WEBSCRIPT_PATH || '/script', (req, res) => {
  if (!req.body || !req.body.name || !req.body.key) {
    return res.status(400).json({
      message: 'Invalid request!',
    })
  }

  if (req.body.key !== process.env.SCRIPT_KEY) {
    return res.status(400).json({
      message: 'Invalid key!',
    })
  }

  const commands = JSON.parse(fs.readFileSync('commands.json'))
  const command = commands[req.body.name]

  if (!command) {
    return res.status(400).json({
      message: 'Invalid script!',
    })
  }

  childprocess.execSync(command)

  const date = new Date()
  console.log(`Command ${command} launched at ${date.toString()} !`)

  res.status(200).json({
    message: `Command ${command} executed!`,
  })
})

http.createServer(app).listen(port, () => {
  console.log(`Express server listening on port ${port}`)
})
