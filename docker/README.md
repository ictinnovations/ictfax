# Running ICTFax in Docker

One container with everything ICTFax needs: Apache, PHP, FreeSWITCH, MariaDB,
the ICTCore REST API and the Angular dashboard. Nothing else to install and no
side services to wire up.

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
the REST API at `/api` on the same origin. ICTCore's own Apache config aliases
`/api` to its entry point, so one Apache serves both. That's why this is a
single container rather than a GUI container talking to an API container across
a network.

Angular handles its own routing, so Apache falls back to `index.html` for any
path that isn't a real file. Without that, reloading the page on a deep link
would return 404.

## Configuration

| Variable | Default | What it does |
|---|---|---|
| `DB_HOST` | `127.0.0.1` | Point it at a real server and the bundled MariaDB never starts |
| `DB_PORT` | `3306` | |
| `DB_NAME` | `ictfax` | |
| `DB_USER` | `ictfaxuser` | |
| `DB_PASS` | generated | Required once `DB_HOST` is external |
| `DB_ROOT_PASS` | generated | Only used by the bundled MariaDB |
| `ICTCORE_HOST` | `localhost` | The hostname the API advertises |
| `FS_ESL_PASSWORD` | `ClueCon` | FreeSWITCH event socket password. Change it |

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

Two stages. Node 16 builds the Angular app, then a Rocky Linux 8 stage
assembles Apache, PHP 7.4, MariaDB, FreeSWITCH and ICTCore and drops the built
dashboard on top. Node 16 rather than something current because this is Angular
13, and the OpenSSL 3 that ships with Node 18 breaks the hashing the older
webpack relies on.

ICTCore is cloned from its own repository at build time. To pin a branch or tag:

```bash
docker build -f docker/Dockerfile --build-arg ICTCORE_REF=ictcore -t ictfax:dev .
```

## Where FreeSWITCH comes from

SignalWire moved their EL8 RPMs behind a paid token, so the packages here come
from two Fedora Copr repositories, `beaveryoga/FreeSWITCH-1.10.12` for
FreeSWITCH itself and `beaveryoga/broadvoice` for the libraries EL8 has no
package for (sofia-sip, spandsp3, libks2, signalwire-client-c2). Copr is HTTPS
and GPG signed, which the free third-party mirrors are not.

`mod_spandsp` does the T.38 negotiation and the fax state machine. In these
builds it lives inside the main `freeswitch` package, not a separate module
RPM, and CI fails the build if it isn't loaded.
