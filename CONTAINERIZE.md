# CONTAINERIZE - Solo/todo-app

Archetype: static. Generated 2026-11-20T22:42:24+07:00 by .opencode/scripts/render.sh on branch chore/containerize (uncommitted).

## Generated files
- Dockerfile (template: Dockerfile.static)
- Jenkinsfile (CI only; parameters REGISTRY, HARBOR_PROJECT, HARBOR_CRED_ID)
- .dockerignore
- .containerize/nginx-spa.conf.template

## Local run
```sh
bash .opencode/scripts/build.sh Solo/todo-app
bash .opencode/scripts/smoke.sh Solo/todo-app
```
Manual run: podman run --rm --network=host --env-file /home/richie/Documents/Programming/Projects/.smoke.env -e PORT=<free-port> containerize/todo-app:local

## Required env var NAMES (values never stored here)
unknown - inspect app config (do not print secret values)

## DB smoke
boot + healthcheck only (DB not smoke-tested). db_driver: unknown. Never migrate/seed/modify; DBs are live.

## Flags
- no verify commands exist: verify stage omitted (nothing invented)
- agent label 'node' unverified on k3s Jenkins (only bun/buildah proven by BenchCheck) - confirm with user

Smoke results: 2026-11-20T23:17:50+07:00 boot=PASS http=200 db=not verified (no read-only CLI for static; health endpoint only)
Smoke results: 2026-11-21T21:40:59+07:00 boot=PASS http=200 db=skipped (legacy mysqli app; pgsql not supported without a code rewrite)
