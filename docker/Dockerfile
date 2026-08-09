# Declared up here because an ARG used in a FROM line has to live outside any
# build stage.
ARG ICTCORE_TAG=latest

# ── stage 1: the Angular front end ───────────────────────────
# Node 16 because this is Angular 13. Node 18 and later ship OpenSSL 3, whose
# removal of md4 breaks the webpack hashing this CLI version relies on.
FROM node:16-bullseye AS gui

WORKDIR /build
COPY package.json package-lock.json ./

# --legacy-peer-deps because package.json mixes @angular/core 13 with
# @angular/animations 16, which npm 7+ refuses to resolve on its own.
RUN npm ci --legacy-peer-deps --no-audit --no-fund

COPY angular.json tsconfig.json tslint.json ngsw-config.json ./
COPY src/ src/
RUN npm run build:prod

# ── stage 2: ICTCore plus the GUI ────────────────────────────
FROM ictinnovations/ictcore:${ICTCORE_TAG}

LABEL org.opencontainers.image.title="ictfax" \
      org.opencontainers.image.description="Open source fax server. T.38 and G.711, fax to email, email to fax, web dashboard and REST API." \
      org.opencontainers.image.vendor="ICT Innovations" \
      org.opencontainers.image.licenses="MPL-2.0" \
      org.opencontainers.image.source="https://github.com/ictinnovations/ictfax" \
      org.opencontainers.image.url="https://ictfax.org"

COPY --from=gui /build/dist/ /usr/ictfax/

# The GUI calls API_URL '/api', which the base image already aliases to the
# ICTCore REST entry point, so both have to answer on the same origin.
# Angular routes are client side, hence the fallback to index.html for any
# path that isn't a real file. Without it a refresh on /pages/fax returns 404.
COPY docker/httpd-ictfax.conf /etc/httpd/conf.d/zz-ictfax.conf

RUN chown -R ictcore:ictcore /usr/ictfax

HEALTHCHECK --interval=30s --timeout=5s --start-period=120s --retries=3 \
  CMD curl -fsS http://127.0.0.1/index.html >/dev/null
