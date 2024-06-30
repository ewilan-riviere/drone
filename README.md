# Drone

[![version][version-src]][version-href]
[![h3][h3-version-src]][h3-version-href]
[![node][node-version-src]][node-version-href]
[![License][license-src]][license-href]

Deployment tool for servers.

Currently support GitHub, GitLab, Bitbucket and Gitea.

## Installation

You can install Drone with [Docker](https://www.docker.com/).

Build the docker image

```bash
docker build -t drone-app:latest .
```

Create a `.env` file with the following content

```bash
cp .env.example .env
```

And fill in the environment variables:

- `ENV`: environment of the application (`development`, `production`, `test`)
- `PORT`: port of the application (into the container)
- `HOST`: host of the application
- `HTTPS`: enable HTTPS
- `ENDPOINT`: endpoint of deployment
- `APP_PORT`: port of the application to deploy (into the server)

Best configuration for production:

```bash
ENV=production
PORT=3000
HOST=domain.com
HTTPS=true
ENDPOINT=/deploy
APP_PORT=3000
```

Change `APP_PORT` if you want to point to another port.

Run the docker container with docker compose

```bash
docker compose up -d
```

## Configuration

You can add your repositories into `repositories/repositories.json` file.

```json
{
  "owner/git-repository-name": [
    "/path/to/local/repository",
    "/path/to/local/repository-develop"
  ],
  "another-owner/another-git-repository-name": "/path/to/another/local/repository",
  "alternative-owner/alternative-git-repository-name": "/path/to/alternative/local/repository"
}
```

The key is the owner and the repository name separated by a slash. The value is the path to the local repository.

Example for the repository <https://gitlab.com/ewilan-riviere/drone>

```json
{
  "ewilan-riviere/drone": "/path/to/drone"
}
```

You can set a value as an array to deploy multiple instances of the same repository.

```json
{
  "ewilan-riviere/drone": [
    "/path/to/drone",
    "/path/to/drone-develop"
  ]
}
```

## Usage

To deploy an application, you need to create a configuration file in the `config` directory.

```bash
/deploy
```

## Credits

- [`adr1enbe4udou1n/drone`](https://github.com/adr1enbe4udou1n/drone): first version of the project

## License

[MIT](LICENSE)

[version-src]: https://img.shields.io/badge/dynamic/json?label=version&query=version&url=https://gitlab.com/ewilan-riviere/drone/-/raw/main/package.json&colorA=18181B&colorB=F0DB4F
[version-href]: https://gitlab.com/ewilan-riviere/drone/-/tags
[h3-version-src]: https://img.shields.io/badge/dynamic/json?label=h3&query=dependencies['h3']&url=https://gitlab.com/ewilan-riviere/drone/-/raw/main/package.json&colorA=18181B&colorB=F0DB4F
[h3-version-href]: https://github.com/unjs/h3
[license-src]: https://img.shields.io/gitlab/license/ewilan-riviere/drone.svg?style=flat&colorA=18181B&colorB=F0DB4F
[license-href]: https://gitlab.com/ewilan-riviere/drone/-/raw/main/LICENSE?ref_type=heads
[node-version-src]: https://img.shields.io/badge/dynamic/json?label=Node.js&query=engines[%27node%27]&url=https://gitlab.com/ewilan-riviere/drone/-/raw/main/package.json&style=flat-square&colorA=18181B&colorB=F0DB4F
[node-version-href]: https://nodejs.org/en/

