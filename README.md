# Spark Pay — capa visual

Terminal de pagos web (solo diseño) en Next.js 15 (App Router) + TypeScript + Tailwind CSS v4.

```bash
npm install
npm run dev        # http://localhost:3000 → /login
npm run build
```

- Tokens de diseño en `app/globals.css` (`@theme`, sin `tailwind.config`).
- Datos mock en `lib/mock-data.ts`, tipos en `types/`, componentes en `components/`.
- Rutas: `/login`, `/operador` (+ `/venta`, `/consultas`), `/supervisor` (+ `/cancelacion`, `/devolucion`), `/sin-acceso`, `/estados` (hoja de revisión del sistema visual) y 404.
- Sin lógica de negocio: no hay validaciones, JWT, cifrado ni llamadas HTTP. Los envíos se simulan con `useSimulatedRequest` (1.2 s) y muestran toasts y comprobantes mock.
