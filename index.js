require('dotenv').config();
const slugify = require('slugify');
const fs = require('fs');
const Client = require('ssh2').Client;

const port = parseInt(process.env.PORT || '3000', 10);

let express = require('express'),
  http = require('http'),
  app = express(),
  bodyParser = require('body-parser'),
  childprocess = require('child_process'),
  path = require('path');

app.use(bodyParser.json());

app.post(process.env.WEBHOOK_PATH || '/deploy', (req, res) => {
  if (!req.body || !req.body.repository || !req.body.repository.name) {
    return res.status(400).json({
      message: 'Invalid request!'
    });
  }

  let name = slugify(req.body.repository.name, {
    lower: true
  });

  let dirs = [name];

  let repositories = JSON.parse(fs.readFileSync('repositories.json'));
  if (repositories[name]) {
    dirs = repositories[name];
  }

  dirs.forEach(function (dirname) {
    let projectDir = path.normalize(process.env.PROJECTS_ROOT + dirname);

    childprocess.exec(`cd ${projectDir} && git pull`);

    const date = new Date();
    console.log(`${projectDir} pulled at ${date.toString()} !`);
  });

  res.status(200).json({
    message: 'Git Hook received!'
  });
});

app.post(process.env.WEBSCRIPT_PATH || '/script', (req, res) => {
  if (!req.body || !req.body.name || !req.body.key) {
    return res.status(400).json({
      message: 'Invalid request!'
    });
  }

  if (req.body.key !== process.env.SCRIPT_KEY) {
    return res.status(400).json({
      message: 'Invalid key!'
    });
  }

  let commands = JSON.parse(fs.readFileSync('commands.json'));
  let command = commands[req.body.name]

  if (!command) {
    return res.status(400).json({
      message: 'Invalid script!'
    });
  }

  childprocess.execSync(command);

  const date = new Date();
  console.log(`Command "${command}" launched at ${date.toString()} !`);

  res.status(200).json({
    message: `Command "${command}" executed!`
  });
});

http.createServer(app).listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
