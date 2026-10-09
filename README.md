# Spark Pay

Terminal de pagos web (evaluación Front End) en **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**.

El acceso depende del **rol del JWT** que devuelve el backend: `Operador` (ventas y consultas) o `Supervisor` (cancelaciones y devoluciones).

## Requisitos

- Node 20+ y **pnpm**
- El **backend mock (Mockoon)** corriendo en `http://localhost:3001` (config: `spark-pay-api.json`).

## Puesta en marcha

```bash
cp .env.example .env.local   # ajusta BACKEND_URL y genera AES_SECRET_KEY
pnpm install
pnpm dev                     # http://localhost:3000 → /login
```

Credenciales de demo: `operador / Operador123` · `supervisor / Supervisor123` (también hay botones de acceso rápido en el login).

## Comandos

| Comando | Descripción |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo (puerto 3000) |
| `pnpm build` / `pnpm start` | Build y ejecución de producción |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Chequeo de tipos |

## Cómo funciona

- **Proxy BFF**: el navegador solo habla con el propio Next (`app/api/*`), que reenvía al backend y guarda el JWT en una **cookie httpOnly**. El token nunca llega al cliente.
- **`proxy.ts`** lee la cookie, decodifica el rol y protege las rutas (`/operador`, `/supervisor`), redirigiendo a `/login` o `/sin-acceso`.
- **Venta**: tarjeta, vencimiento y CVV se cifran con **AES-256** en el Route Handler (clave en env) antes de ir al backend (`POST`).
- **Consultas** (`GET`), **cancelación** y **devolución** (`PATCH`) pasan por el mismo patrón.
- **Validación con Zod** en el formulario (React Hook Form) y revalidada en el servidor.
- Cada petición muestra una **notificación** (toast) de éxito (200) o error (400).

## Estructura

Ver `CLAUDE.md` y `AGENTS.md`. Resumen: `app/` solo rutas; `src/features/*` por flujo de negocio; `src/components/{ui,layout}`; `src/lib` (env, api, auth, crypto…); copy en `src/content`.
