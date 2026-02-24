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
- Pagos Colombia: se deja un gateway Wompi como placeholder.
- Sustituir claves reales en `.env` antes de pasar a produccion.
