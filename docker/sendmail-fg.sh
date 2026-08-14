#!/usr/bin/env bash
# supervisord can only supervise a process that stays in the foreground, and
# sendmail gives us neither option cleanly on Rocky 8:
#
#   -bD  is documented as "daemon, do not fork" and does stay in the
#        foreground, but on this 8.15.2 build it never binds 25 at all. Verified
#        by polling ss for 30 seconds while the process sat there alive.
#   -bd  binds within two seconds, which is what RHEL's own sendmail.service
#        uses, but it forks and the process supervisord launched exits at once.
#
# So start it the way RHEL does and then block on the pid it writes. supervisord
# watches this wrapper, and because the wrapper exits when the daemon dies, the
# autorestart still does what it looks like it does.
set -euo pipefail

PIDFILE=/run/sendmail.pid
rm -f "$PIDFILE"

/usr/sbin/sendmail -bd -q15m

for i in $(seq 1 30); do
  [[ -s "$PIDFILE" ]] && break
  if [[ $i -eq 30 ]]; then
    echo "sendmail did not write $PIDFILE, giving up" >&2
    exit 1
  fi
  sleep 1
done

PID="$(head -1 "$PIDFILE")"
echo "sendmail listening, pid $PID"

# Forward supervisord's stop signal to the daemon, which is not our child and
# would otherwise be left running after the wrapper is killed.
trap 'kill "$PID" 2>/dev/null || true' TERM INT

while kill -0 "$PID" 2>/dev/null; do
  sleep 5
done

echo "sendmail (pid $PID) is gone" >&2
exit 1
