# Running ICTFax in Docker

This image is the ICTCore base plus the ICTFax dashboard. You get Apache, PHP,
FreeSWITCH, MariaDB and the Angular front end in one container, so there is no
separate install step for the GUI.

## Quick start

```bash
docker run -d --name ictfax \
  -p 8080:80 \
  -p 5060:5060/tcp -p 5060:5060/udp \
  -p 16384-16484:16384-16484/udp \
  ictinnovations/ictfax:latest
```

First boot takes roughly two minutes while the database is created and the
schema loads. Then open `http://localhost:8080/`.

Default login: `admin@ictcore.org` / `helloAdmin`. Change it before the machine
is reachable from anywhere but your laptop.

Publish the RTP range. Skip it and your fax calls will negotiate and then
transfer nothing, which is the single most common first-run complaint.

## How the two halves fit together

The dashboard is a static Angular build served from `/usr/ictfax`, and it calls
the REST API at `/api` on the same origin. The base image already aliases
`/api` to the ICTCore entry point, so both have to be served by the same
Apache. That's why this is one container rather than a GUI container talking to
an API container across a network.

Angular handles its own routing, so Apache falls back to `index.html` for any
path that isn't a real file. Without that, reloading the page on a deep link
would return 404.

## Configuration

Every environment variable from the base image works here. The ones you'll
actually touch:

| Variable | Default | What it does |
|---|---|---|
| `DB_HOST` | `127.0.0.1` | Point it at a real server and the bundled MariaDB never starts |
| `DB_PASS` | generated | Required when `DB_HOST` is external |
| `ICTCORE_HOST` | `localhost` | The hostname the API advertises |
| `FS_ESL_PASSWORD` | `ClueCon` | FreeSWITCH event socket password. Change it |

The full list is in the [ICTCore docker
notes](https://github.com/ictinnovations/ictcore/blob/ictcore/docker/README.md).

## Volumes

- `/usr/ictcore/data` for received faxes and uploaded documents
- `/usr/ictcore/log` for application logs
- `/var/lib/mysql` for the bundled database

Mount at least the first one. Everything you receive lands there, and without a
volume it disappears with the container.

## Building it yourself

```bash
docker build -f docker/Dockerfile -t ictfax:dev .
```

Two stages: Node 16 builds the Angular app, then the result is copied onto the
ICTCore image. Node 16 rather than something current because this is Angular
13, and the OpenSSL 3 that ships with Node 18 breaks the hashing the older
webpack relies on.

To build against a specific base image:

```bash
docker build -f docker/Dockerfile --build-arg ICTCORE_TAG=1.0.0 -t ictfax:dev .
```
