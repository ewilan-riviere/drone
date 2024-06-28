# Drone

[![version][version-src]][version-href]
[![h3][h3-version-src]][h3-version-href]
[![node][node-version-src]][node-version-href]
[![License][license-src]][license-href]

Deployment tool for servers.

## Installation

You can install Drone with [Docker](https://www.docker.com/).

```bash
docker compose up -d
```

### Docker image

Build and run the docker image

```bash
docker build -t drone-app:latest .
docker run -it -p 3000:3000 drone-app:latest
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

