# ICTFax

ICTFax is open source fax server software. It sends and receives faxes over IP
using T.38 or G.711 pass through, and it gives you email to fax, fax to email,
web to fax, DIDs, extensions and fax campaigns from one dashboard.

Underneath it runs FreeSWITCH for the telephony and the
[ICTCore](https://ictcore.readthedocs.io/) framework for the API, with an
Angular dashboard on top. Your code never talks to FreeSWITCH directly. You
upload a document, pick a program, and fire a transmission.

## Try it in two minutes

The Docker image bundles Apache, PHP, FreeSWITCH, MariaDB and the dashboard, so
there's nothing else to install.

```bash
docker run -d --name ictfax \
  -p 8080:80 \
  -p 5060:5060/tcp -p 5060:5060/udp \
  -p 16384-16484:16384-16484/udp \
  ictinnovations/ictfax:latest
```

First boot takes about two minutes while the database is created and the schema
loads. Then open `http://localhost:8080/` and sign in with `admin@ictcore.org`
/ `helloAdmin`. Change that password before you point the box at a real trunk.

!!! warning "Publish the RTP range"

    If you skip the `16384-16484/udp` mapping your fax calls will connect and
    then transfer nothing. It's the most common first-run problem.

For a package install on CentOS or Rocky, read the
[installation guide](installation.md). To build the dashboard yourself, read
the [build guide](build-guide.md).

## Where to go next

1. [User guide](user-guide.md) walks through sending your first fax, contacts,
   documents and campaigns.
2. [Admin guide](admin-guide.md) covers users, providers, trunks and
   extensions.
3. [REST API overview](api.md) lists every endpoint, and the
   [full reference](ApiGuide.md) has the request and response bodies.

## There are no webhooks

ICTFax has no outbound webhook or event stream, so nothing pushes a delivery
result back to you. Poll the transmission status until it leaves `pending`,
`processing`, `scheduled` or `ready`. Plan your integration around polling from
the start rather than discovering this later.

## Community edition and commercial edition

This repository is the community edition, released under the GPLv3. It's free
to run, modify and self-host.

[ICTFax.com](https://ictfax.com) is the commercial edition, with HIPAA ready
deployments, support and hosted options. If you need someone accountable for
uptime, start there. If you're happy running your own server, everything you
need is here.

## Getting help

Report bugs and ask questions on
[GitHub issues](https://github.com/ictinnovations/ictfax/issues). Commercial
support is available from
[ICT Innovations](https://www.ictinnovations.com).
