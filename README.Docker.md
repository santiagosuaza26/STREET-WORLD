# Docker setup for STREET WORLD

This project is a PNPM monorepo with:
- Web app: `apps/web` (Next.js) on port `3000`
- API app: `apps/api` (NestJS) on port `3001`
- Infra: PostgreSQL (`5432`) and Redis (`6379`)

## Files added
- `.dockerignore`
- `Dockerfile.web`
- `Dockerfile.api`
- `compose.yaml`

## Start everything
```bash
docker compose up --build
```

## Run in detached mode
```bash
docker compose up --build -d
```

## Stop and remove containers
```bash
docker compose down
```

## Stop and remove containers + volumes
```bash
docker compose down -v
```

## Services
- Web: http://localhost:3000
- API: http://localhost:3001
- Postgres: localhost:5432
- Redis: localhost:6379

## Notes
- The API currently uses SQLite through `DB_PATH` inside the container (`/data/street_world.db`) and persists it in the `api_data` volume.
- PostgreSQL and Redis are provisioned in compose for future use and compatibility with existing environment variables.
- `NEXT_PUBLIC_API_URL` is set to `http://localhost:3001` so browser requests work from your host machine.
