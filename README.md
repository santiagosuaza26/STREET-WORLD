# Street World

Tienda online base en Espanol con arquitectura limpia y lista para escalar.

## Requisitos
- Node.js 18+
- pnpm 9+
- Docker (opcional para Postgres/Redis)

## Inicio rapido
1. Copia variables de entorno
   - root: `.env.example` -> `.env`
   - API: `apps/api/.env.example` -> `apps/api/.env`
   - Web: `apps/web/.env.example` -> `apps/web/.env`
2. Instala dependencias
   - `pnpm install`
3. Levanta base de datos y cache
   - `docker compose up -d`
4. Corre en desarrollo
   - `pnpm dev`

## Estructura
- `apps/web` Next.js (frontend)
- `apps/api` NestJS (backend)

## Notas
- Pagos sin llaves: usa `PAYMENTS_PROVIDER=mock` para flujo completo de compra en modo demo.
- Pagos reales: cambia a `PAYMENTS_PROVIDER=wompi` y configura claves/URLs reales en `apps/api/.env`.
- Sustituir claves reales en `.env` antes de pasar a produccion.

## Migraciones de base de datos
- Requisito: define `DATABASE_URL` apuntando a PostgreSQL antes de ejecutar comandos.
- Crear una migracion vacia:
   - `pnpm --filter @street-world/api migration:create`
- Generar migracion desde cambios de entidades:
   - `pnpm --filter @street-world/api migration:generate`
- Ejecutar migraciones pendientes:
   - `pnpm --filter @street-world/api migration:run`
- Revertir la ultima migracion aplicada:
   - `pnpm --filter @street-world/api migration:revert`

## Tracing
- La API y la Web incluyen tracing con OpenTelemetry.
- Abre el visor de trazas de AI Toolkit (comando: `AI Toolkit: Open Tracing`) o usa tu colector OTLP.
- Variables en `apps/api/.env`:
   - `OTEL_ENABLED=true`
   - `OTEL_SERVICE_NAME=street-world-api`
   - `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://localhost:4318/v1/traces`
   - `OTEL_DEBUG=false`
- Variable en `apps/web/.env`:
   - `OTEL_SERVICE_NAME=street-world-web`
   - `OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318`
- La web usa `apps/web/instrumentation.ts` y `instrumentationHook` habilitado en `apps/web/next.config.mjs`.
