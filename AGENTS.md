# Spark Pay

Web payments terminal built for a frontend technical test. The UI is in Spanish; code and commits are in English.

## What it does

Role-based terminal. The user logs in and the backend returns a **JWT whose `Role` claim** (`Operador` | `Supervisor`) decides which views are available:

- **Operador** → Ventas y Consultas.
- **Supervisor** → Cancelaciones y Devoluciones.

## Backend (mock)

A **Mockoon** server simulates the API. It runs locally on **`http://localhost:3001`** with prefix **`/api`** (config: `spark-pay-api.json`, started by the repo owner). The browser never calls it directly — our **BFF Route Handlers under `app/api/*` proxy** to it and keep the JWT in an **httpOnly cookie**.

Endpoints (all JSON, response envelope `{ codigo, mensaje, data? }`):

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/api/auth/login` | Body `{ username, password }`. Creds: `operador/Operador123`, `supervisor/Supervisor123`. Returns `{ token, usuario }`. |
| POST | `/api/transacciones/venta` | Card number, expiry and CVV are sent **AES-encrypted**. Returns approval no. (6 digits), financial reference (8 digits), masked card. |
| GET | `/api/transacciones` | Min. 10 approved transactions. |
| PATCH | `/api/transacciones/cancelacion` | Body `{ referenciaFinanciera (8 digits), numeroTarjeta }`. Returns `estatus: "Aplicado"`. |
| PATCH | `/api/transacciones/devolucion` | Same shape as cancelación. |

`codigo` 200 = success, 400 = error. The backend only shape-checks fields (it does not actually decrypt).

## Hard requirements from the test

- **Every request shows a notification**: a success toast on `200`, a distinct error toast on `400`.
- **Venta encrypts** `numeroTarjeta`, `fechaExpiracion` and `cvv` with **AES** before they leave for the backend. We encrypt server-side in the Route Handler (key from validated env), so the key never reaches the client.
- Role drives navigation and route access (enforced in `proxy.ts`).
- UI/UX is weighted heavily in the evaluation.

## Environment

Validated in `src/lib/env.ts` (Zod). See `.env.example`. Never read `process.env` directly.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
