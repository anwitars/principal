# Principal [![CI](https://github.com/anwitars/principal/actions/workflows/ci.yml/badge.svg)](https://github.com/anwitars/principal/actions/workflows/ci.yml)

## About the project

The project has been created to help me and my students organize schedules, and to showcase my programming skills and my
best practises. The bot will be actively used on my Discord where I am preparing high school students for their final
exam, as well as mentoring them to get started in coding in a more professional way. Not intended for commercial or even
personal use other than me, only for educational and showcase purposes. The name of this project does not represent what
an actual principal is doing at school, it has been choosen only, because it sounded more fun than the other that came
up in my mind.

I tried to keep the dependency count as low as possible, keeping the developer experience still straight-forward and
convenient.

## Why Typescript?

The only reason a chose this language is because of the mature API. This seemed to be the best option to go with,
although I am planning to use other language for my future projects wherever possible. This attitude has been formed by
the current situation of node packages, the web development community and tooling.

## Usage

### Building

This process is quite straight-forward. Just clone the repo and run the following commands: `yarn && yarn build`. If you
wish to use a package manager other than `yarn`, feel free to do so. In that case, it is recommended to delete the
`yarn.lock` file to not let it cause any issues.

### Running

Some environmental variables must be set in order to start the Discord bot. All of them must be prefixed by
`PRINCIPAL_`, in order to avoid conflicts. The following ones must be present:

- `PRINCIPAL_DISCORD_TOKEN`: The Discord token associated with a Discord bot.
- `PRINCIPAL_CLIENT_ID`: The Discord client ID associated with a Discord bot. This ID, and the token above can be
  obtained by following [this](https://www.writebots.com/discord-bot-token/) guide.
- `PRINCIPAL_MONGO_URI`: The MongoDB uri that contains the host and port of the server, the authorization and the
  database to be used by the application. (E.g.
  `mongodb://adminuser:adminpassword@127.0.0.1:27017/database?authSource=admin`)
- `PRINCIPAL_LOG_LEVEL`: The level the logs will be displayed at. Defaults to `WARNING`. Available options are: `DEBUG`,
  `INFO`, `WARNING`, `ERROR`. The parsing method is case-insensitive.

### Docker

If you wish to use `docker`, the Dockerfile is included along with the code. For more info about building and using the
image, [this](https://docs.docker.com/get-started/) tutorial might help.

## My use of this project

I mainly use this bot to have an official schedule for my students, no other complicated situation. Although the app
does not provide a way to see all the classes of all students, due to the simplicity of the database, I can just simply
query it using a GUI like [MongoDB Compass](https://www.mongodb.com/products/tools/compass). A Raspberry PI 4 is set up
via [docker compose](https://docs.docker.com/compose/), including a MongoDB and the Principal container. Using
[docker rollout](https://github.com/Wowu/docker-rollout) to upgrade to the latest version with zero-downtime.
