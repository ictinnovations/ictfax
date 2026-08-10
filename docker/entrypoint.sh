#!/usr/bin/env bash
set -euo pipefail

ICTCORE_DIR=/usr/ictcore
CONF="$ICTCORE_DIR/etc/ictcore.conf"

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-ictfax}"
DB_USER="${DB_USER:-ictfaxuser}"
DB_PASS="${DB_PASS:-}"
DB_ROOT_PASS="${DB_ROOT_PASS:-}"

WEB_HOST="${ICTCORE_HOST:-localhost}"
FS_PASSWORD="${FS_ESL_PASSWORD:-ClueCon}"

log() { echo "[entrypoint] $*"; }

is_local_db() { [[ "$DB_HOST" == "127.0.0.1" || "$DB_HOST" == "localhost" ]]; }

# Set key=value inside one [section] of an ini file, leaving other sections
# alone. Plain sed can't do this because host/port appear in several sections.
ini_set() {
  local file="$1" section="$2" key="$3" value="$4"
  awk -v sec="$section" -v k="$key" -v v="$value" '
    /^[[:space:]]*\[/ { in_sec = ($0 ~ "^[[:space:]]*\\[" sec "\\][[:space:]]*$") }
    in_sec && $0 ~ "^[[:space:]]*" k "[[:space:]]*=" { print k " = " v; next }
    { print }
  ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
}

# ── secrets ──────────────────────────────────────────────────
if [[ -z "$DB_PASS" ]]; then
  if is_local_db; then
    DB_PASS="$(openssl rand -hex 16)"
    log "DB_PASS not set, generated one for the bundled database"
  else
    log "FATAL: DB_HOST points at an external server but DB_PASS is empty"
    exit 1
  fi
fi

# ── bundled MariaDB ──────────────────────────────────────────
if is_local_db; then
  if [[ ! -d /var/lib/mysql/mysql ]]; then
    log "initialising MariaDB data directory"
    # Renamed in MariaDB 10.4; keep the old name working on older bases.
    if command -v mariadb-install-db >/dev/null 2>&1; then
      mariadb-install-db --user=mysql --datadir=/var/lib/mysql >/dev/null
    else
      mysql_install_db --user=mysql --datadir=/var/lib/mysql >/dev/null
    fi
  fi

  log "starting MariaDB for provisioning"
  mysqld_safe --datadir=/var/lib/mysql --user=mysql >/dev/null 2>&1 &
  for i in $(seq 1 60); do
    mysqladmin ping --silent 2>/dev/null && break
    [[ $i -eq 60 ]] && { log "FATAL: MariaDB did not come up"; exit 1; }
    sleep 1
  done
  log "MariaDB is up"
fi

mysql_run() {
  if is_local_db; then
    mysql --protocol=socket -u root ${DB_ROOT_PASS:+-p"$DB_ROOT_PASS"} "$@"
  else
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$@"
  fi
}

# ── schema ───────────────────────────────────────────────────
if is_local_db; then
  mysql_run -e "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` DEFAULT CHARACTER SET utf8;"
  mysql_run -e "CREATE USER IF NOT EXISTS '$DB_USER'@'%' IDENTIFIED BY '$DB_PASS';"
  mysql_run -e "ALTER USER '$DB_USER'@'%' IDENTIFIED BY '$DB_PASS';"
  mysql_run -e "GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'%'; FLUSH PRIVILEGES;"
fi

if ! mysql_run -N -B -e "SELECT 1 FROM \`$DB_NAME\`.account LIMIT 1" >/dev/null 2>&1; then
  log "loading schema into $DB_NAME"
  # db/ictfax.sql is deliberately absent. It redefines the usr_insert and
  # usr_update triggers that database.sql already created, so sourcing both
  # aborts the load. ICTCore's own install instructions do not source it either.
  for f in database.sql voice.sql fax.sql sms.sql email.sql tenant.sql \
           fax_activity.sql forgot_password.sql block_contacts.sql; do
    [[ -f "$ICTCORE_DIR/db/$f" ]] || continue
    log "  $f"
    mysql_run "$DB_NAME" < "$ICTCORE_DIR/db/$f"
  done
  # Explicit order, not a glob. demo_users.sql looks up the role ids that
  # role_user.sql and role_admin.sql insert, and alphabetically it sorts first.
  for f in role_user.sql role_admin.sql demo_users.sql; do
    [[ -f "$ICTCORE_DIR/db/data/$f" ]] || continue
    log "  data/$f"
    mysql_run "$DB_NAME" < "$ICTCORE_DIR/db/data/$f"
  done
  log "schema loaded"
else
  log "schema already present, skipping load"
fi

# ── configuration ────────────────────────────────────────────
log "writing $CONF"
ini_set "$CONF" db       host "$DB_HOST"
ini_set "$CONF" db       port "$DB_PORT"
ini_set "$CONF" db       name "$DB_NAME"
ini_set "$CONF" db       user "$DB_USER"
ini_set "$CONF" db       pass "$DB_PASS"
ini_set "$CONF" website  host "$WEB_HOST"
ini_set "$CONF" website  url  "http://$WEB_HOST/api"
ini_set "$CONF" freeswitch password "$FS_PASSWORD"
chown ictcore:ictcore "$CONF"
chmod 640 "$CONF"

# ── JWT / node keypair ───────────────────────────────────────
mkdir -p "$ICTCORE_DIR/etc/ssh"
if [[ ! -f "$ICTCORE_DIR/etc/ssh/ib_node" ]]; then
  log "generating node keypair"
  bash "$ICTCORE_DIR/bin/keygen"
else
  log "node keypair already present"
fi

# The FreeSWITCH event socket password has to agree on both sides or ICTCore
# connects and is silently rejected, which looks like "calls just don't dial".
if [[ -f /etc/freeswitch/autoload_configs/event_socket.conf.xml ]]; then
  sed -i "s|name=\"password\" value=\"[^\"]*\"|name=\"password\" value=\"$FS_PASSWORD\"|" \
    /etc/freeswitch/autoload_configs/event_socket.conf.xml
fi

if is_local_db; then
  log "stopping provisioning MariaDB, supervisord takes over"
  mysqladmin shutdown ${DB_ROOT_PASS:+-p"$DB_ROOT_PASS"} 2>/dev/null || true
  sleep 2
else
  log "external database in use, dropping the bundled MariaDB from supervisord"
  rm -f /etc/supervisord.d/mariadb.ini
fi

log "ready"
exec "$@"
