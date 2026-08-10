#!/bin/bash
# Wait until the database accepts connections, then run whatever was asked for.
#
# Supervisord has no way to express that one program depends on another, so httpd
# and the cron worker come up while MariaDB is still starting and the first
# requests fatal with a connection refused. Give up after a minute and start
# anyway: an error you can read beats a container that hangs and says nothing.
set -u

conf=/etc/ictcore.conf

read_db() {
  sed -n "/^[[:space:]]*\[db\]/,/^[[:space:]]*\[/{s/^[[:space:]]*$1[[:space:]]*=[[:space:]]*//p}" \
    "$conf" 2>/dev/null | head -1
}

host="$(read_db host)"
port="$(read_db port)"
host="${host:-127.0.0.1}"
port="${port:-3306}"

for _ in $(seq 1 60); do
  if (exec 3<>"/dev/tcp/$host/$port") 2>/dev/null; then
    break
  fi
  sleep 1
done

exec "$@"
