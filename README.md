# Spark Pay

Terminal de pagos web para la **Evaluación Técnica Front End**. Hecha con **Next.js 16** (App Router), **TypeScript** y **Tailwind CSS v4**. El backend se simula con **Mockoon**.

El acceso depende del claim `Role` del **JWT** que devuelve el backend al iniciar sesión:

| Rol | Operaciones |
| --- | --- |
| **Operador** | Ventas y Consultas |
| **Supervisor** | Cancelaciones y Devoluciones |

---

## Requisitos

- **Node.js 20.9 o superior**
- **pnpm** (`npm i -g pnpm` o `corepack enable`)
- **Mockoon**: la [app de escritorio](https://mockoon.com/download/) o el CLI (`npx @mockoon/cli`)

## Puesta en marcha

### 1. Levantar el backend mock (Mockoon)

El archivo `spark-pay-api.json` del repo define el environment completo. Escucha en el puerto **3001** con el prefijo **`/api`**.

**Opción A: app de escritorio**

1. Abre Mockoon y elige *Open environment* (o `File → Open environment`).
2. Selecciona `spark-pay-api.json` **de este repositorio**. Si abres una copia en otra carpeta, los cambios del repo no se reflejan.
3. Pulsa ▶ *Start server*.

**Opción B: CLI**

```bash
npx @mockoon/cli start --data ./spark-pay-api.json
```

Comprueba que responde:

```bash
curl http://localhost:3001/api/transacciones
```

### 2. Variables de entorno

```bash
cp .env.example .env.local
```

| Variable | Descripción |
| --- | --- |
| `BACKEND_URL` | URL base del mock, con prefijo. Por defecto `http://localhost:3001/api`. |
| `AES_SECRET_KEY` | Clave AES-256 en hexadecimal (64 caracteres = 32 bytes). |

Genera una clave propia:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Las variables se validan con Zod en `src/lib/env.ts`. Si falta alguna o tiene un formato inválido, la app no arranca y el error dice cuál es.

### 3. Instalar y correr

```bash
pnpm install
pnpm dev          # http://localhost:3000 → redirige a /login
```

### Comandos

| Comando | Descripción |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo (puerto 3000) |
| `pnpm build` | Build de producción |
| `pnpm start` | Ejecuta el build de producción (puerto 3000) |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Chequeo de tipos (`tsc --noEmit`) |

---

## Datos de prueba

### Usuarios

| Usuario | Contraseña | Rol |
| --- | --- | --- |
| `operador` | `Operador123` | Operador |
| `supervisor` | `Supervisor123` | Supervisor |

El login también tiene botones de **acceso rápido** para cada rol.

### Tarjetas

El número de tarjeta se valida con el **algoritmo de Luhn**, así que un número inventado normalmente se rechaza. Usa tarjetas de prueba:

| Tarjeta | Número | CVV |
| --- | --- | --- |
| Visa | `4111 1111 1111 1111` | `123` |
| Mastercard | `5555 5555 5555 4444` | `123` |
| American Express | `3782 822463 10005` | `123` |

La fecha de vencimiento debe ser `MM/AA` y no estar vencida (por ejemplo `12/28`).

### Referencias financieras

Para cancelación y devolución sirve cualquier referencia de 8 dígitos. Puedes copiar una de **Consultas** (por ejemplo `30246633`) o la que devuelve una venta recién hecha.

---

## Guía de pruebas

Cada caso indica qué requisito de la evaluación cubre.

### 1. Login y roles

| # | Pasos | Resultado esperado |
| --- | --- | --- |
| 1.1 | Inicia sesión con `operador / Operador123` | Toast verde **200 OK** "Sesión iniciada". Te lleva a `/operador`, que muestra Ventas y Consultas. |
| 1.2 | Inicia sesión con `supervisor / Supervisor123` | Toast verde. Te lleva a `/supervisor`, que muestra Cancelación y Devolución. |
| 1.3 | Inicia sesión con una contraseña incorrecta (8+ caracteres) | Toast rojo **400 Bad Request** "Usuario o contraseña incorrectos". |
| 1.4 | Envía el login vacío o con un usuario de menos de 3 caracteres | Errores en línea bajo cada campo. No se hace ninguna petición. |
| 1.5 | Como operador, abre `/supervisor/cancelacion` en la barra de direcciones | Te redirige a `/sin-acceso`. |
| 1.6 | Sin sesión, abre `/operador` | Te redirige a `/login`. |
| 1.7 | Cierra sesión desde el menú de perfil | Te lleva a `/login` con el toast "Sesión cerrada". |

### 2. Venta (Operador, `POST`)

| # | Pasos | Resultado esperado |
| --- | --- | --- |
| 2.1 | Llena importe `150.50`, titular `Ana López`, tarjeta `4111 1111 1111 1111`, vencimiento `12/28`, CVV `123` y pulsa *Procesar venta* | Toast verde **200 OK** "Venta aprobada". El comprobante muestra el **no. de aprobación (6 dígitos)**, la **referencia financiera (8 dígitos)** y la **tarjeta enmascarada** (`1234*****1234`). |
| 2.2 | Pulsa *Procesar venta* con el formulario vacío | Errores en línea en los 5 campos. |
| 2.3 | Escribe letras en tarjeta, vencimiento o CVV | No se escriben: el campo solo acepta dígitos. La tarjeta se agrupa sola de 4 en 4 y el vencimiento pone la `/` solo. |
| 2.4 | Tarjeta `4111 1111 1111 1112` | "El número de tarjeta no es válido" (falla Luhn). |
| 2.5 | Vencimiento en un mes pasado (p. ej. `01/25`) | "La tarjeta está vencida". |
| 2.6 | Titular de una sola palabra o con números | Error de nombre y apellido; los números no se escriben. |
| 2.7 | Importe `0` | "Ingresa un importe mayor a 0". |

**Cifrado AES.** El Route Handler de venta cifra `numeroTarjeta`, `fechaExpiracion` y `cvv` con **AES-256-CBC** (IV aleatorio por campo, formato `iv:ciphertext` en base64) antes de enviarlos al backend. Para verlo, abre la pestaña **Logs** de Mockoon y selecciona la petición `POST /api/transacciones/venta`: en el body esos tres campos llegan cifrados y no en claro.

### 3. Consultas (Operador, `GET`)

| # | Pasos | Resultado esperado |
| --- | --- | --- |
| 3.1 | Abre *Consultas* | Toast verde "Se cargaron 12 transacciones aprobadas". Tabla paginada con **12 transacciones aprobadas** (el mínimo pedido es 10) y resumen de total, monto y ticket promedio. |
| 3.2 | Abre el inicio del operador | Las estadísticas y "Últimas transacciones" se calculan con la misma respuesta de la API. |
| 3.3 | Detén Mockoon y recarga *Consultas* | Toast rojo "No se pudo consultar" y estado vacío. |

### 4. Cancelación y devolución (Supervisor, `PATCH`)

| # | Pasos | Resultado esperado |
| --- | --- | --- |
| 4.1 | En *Cancelación*, escribe la referencia `30246633` y la tarjeta `4111 1111 1111 1111`, pulsa *Aplicar cancelación* y confirma en el modal | Toast verde "Cancelación aplicada". El comprobante muestra el **no. de aprobación (6)**, la **referencia (8)**, la **tarjeta enmascarada** y el **estatus "Aplicado"**. |
| 4.2 | Repite el caso en la pestaña *Devolución* | Toast verde "Devolución aplicada" con los mismos datos. |
| 4.3 | Referencia de menos de 8 dígitos, o tarjeta inválida | Errores en línea; el campo de referencia no acepta letras ni más de 8 dígitos. |
| 4.4 | Abre *Operaciones* o el inicio del supervisor | Toast "Se cargaron 10 operaciones aplicadas". La lista y los conteos vienen de `GET /transacciones/reversos`. |

### 5. Pruebas directas a la API (respuestas 400 / 403)

La UI valida antes de enviar, así que el 400 del backend en venta y reversos se prueba directamente contra el BFF. Estos ejemplos usan Git Bash, macOS o Linux. En Windows, manda los textos con acentos desde un archivo (`--data-binary @body.json`), porque la consola puede alterar la codificación.

```bash
# Inicia sesión y guarda la cookie httpOnly
curl -c op.txt  -H "Content-Type: application/json" -X POST http://localhost:3000/api/auth/login \
  -d '{"username":"operador","password":"Operador123"}'
curl -c sup.txt -H "Content-Type: application/json" -X POST http://localhost:3000/api/auth/login \
  -d '{"username":"supervisor","password":"Supervisor123"}'

# 400: datos inválidos (revalidados en el servidor con el mismo schema de Zod)
curl -b op.txt -H "Content-Type: application/json" -X POST http://localhost:3000/api/transacciones/venta \
  -d '{"importe":"1e5","nombreTitular":"A","numeroTarjeta":"123","fechaExpiracion":"13/99","cvv":"1"}'

# 403: un rol no puede ejecutar las operaciones del otro
curl -b sup.txt -H "Content-Type: application/json" -X POST http://localhost:3000/api/transacciones/venta \
  -d '{"importe":"10","nombreTitular":"Ana Lopez","numeroTarjeta":"4111111111111111","fechaExpiracion":"12/28","cvv":"123"}'
curl -b op.txt -H "Content-Type: application/json" -X PATCH http://localhost:3000/api/transacciones/cancelacion \
  -d '{"referenciaFinanciera":"30246633","numeroTarjeta":"4111111111111111"}'

# 401: sin sesión
curl -H "Content-Type: application/json" -X POST http://localhost:3000/api/transacciones/venta -d '{}'
```

### 6. Sistema visual

`/estados` muestra todos los componentes y estados de la UI: toasts 200/400 (con botones para dispararlos), botones, inputs, badges, comprobantes, tabla vacía y skeleton de carga.

---

## Cómo funciona

```
Navegador ──JSON──▶ Next.js (BFF: app/api/*) ──JSON──▶ Mockoon :3001/api
                    · valida con Zod
                    · cifra con AES (venta)
                    · guarda el JWT en cookie httpOnly
                    · verifica el rol
```

- **BFF.** El navegador solo habla con el propio Next. Los Route Handlers de `app/api/*` reenvían al mock, así que el JWT y la clave AES nunca llegan al cliente.
- **Sesión.** El JWT se guarda en una cookie `httpOnly` y `SameSite=Lax`. `proxy.ts` (el antiguo middleware en Next 16) lee el rol y protege `/operador` y `/supervisor`. Los Route Handlers vuelven a verificar el rol y responden **403** si no corresponde.
- **Validación.** Un solo schema de Zod por formulario. El cliente lo usa con React Hook Form y el servidor lo revalida. Los mensajes están en español.
- **Notificaciones.** Cada petición muestra un toast: verde con chip `200 OK` en caso de éxito, rojo con chip `400 Bad Request` en caso de error.
- **Métodos HTTP.** `POST` para venta, `PATCH` para cancelación y devolución, `GET` para consultas.

### Endpoints del mock

Todas las respuestas usan el formato `{ codigo, mensaje, data? }`, donde `codigo` es 200 si la operación salió bien y 400 si hubo error.

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/api/auth/login` | `{ username, password }` → `{ token, usuario }` |
| `POST` | `/api/transacciones/venta` | Importe, titular y los datos de tarjeta **cifrados** → aprobación, referencia y tarjeta enmascarada |
| `GET` | `/api/transacciones` | 12 transacciones aprobadas |
| `GET` | `/api/transacciones/reversos` | 10 cancelaciones y devoluciones aplicadas |
| `PATCH` | `/api/transacciones/cancelacion` | `{ referenciaFinanciera, numeroTarjeta }` → estatus `Aplicado` |
| `PATCH` | `/api/transacciones/devolucion` | Igual que cancelación |

### Reglas de validación

| Campo | Regla |
| --- | --- |
| Usuario | 3–30 caracteres: letras, números, `.`, `_`, `-` |
| Contraseña | 8–64 caracteres |
| Importe | Número mayor a 0, máximo 2 decimales, hasta $999,999.99 |
| Nombre del titular | 5–40 caracteres, solo letras (con acentos), nombre y apellido |
| Número de tarjeta | 16 dígitos (15 para Amex) y algoritmo de Luhn |
| Vencimiento | `MM/AA`, no vencida, hasta 20 años hacia adelante |
| CVV | Exactamente 3 dígitos |
| Referencia financiera | Exactamente 8 dígitos |

## Estructura

```
app/                    Rutas (App Router) y Route Handlers (app/api/*)
src/features/           Un folder por flujo: auth, venta, consultas, reversal, supervisor, home
src/components/ui/      Primitivas propias (Button, Input, Toast, Modal…)
src/components/layout/  Shell, navbar, sidebar, page header
src/content/copy.ts     Textos de la UI (navegación, toasts, etiquetas)
src/lib/                env, api, auth, session, crypto (AES), card (Luhn), input-format, zod
proxy.ts                Protección de rutas por rol
spark-pay-api.json      Environment de Mockoon
```

Para las convenciones del proyecto, ver `CLAUDE.md` y `AGENTS.md`.
