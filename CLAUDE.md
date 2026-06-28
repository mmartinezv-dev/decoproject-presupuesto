# DecoProject — Guía para Claude

Sistema de presupuestos para construcción y decoración. Stack: **NestJS 11 · Vue 3 · TypeScript · Tailwind CSS 4 · MySQL 8**.

---

## Documentación de referencia

- **[Design System](docs/design-system.md)** — tokens de color, tipografía, dark mode, patrones de componentes (inputs, botones, tablas, cards), iconos, clases de impresión/PDF y convenciones de UI. Leer antes de modificar o crear cualquier componente Vue.

---

## Estructura del proyecto

```
presupuestos-constru/
├── backend/          NestJS — Clean Architecture (domain/application/infrastructure/presentation)
├── frontend/         Vue 3 + Vite + Tailwind 4
├── docs/             Documentación técnica
└── docker-compose.yml
```

### Backend — capas

```
src/
├── application/      Casos de uso (ApplicationServices)
├── domain/           Entidades e interfaces de repositorio
├── infrastructure/   TypeORM entities, repositorios, auth store
└── presentation/     Controllers, Guards, DTOs, Filters, Interceptors
```

### Frontend — estructura

```
src/
├── components/
│   ├── budget/       9 sub-componentes del formulario de presupuesto
│   └── layout/       AppLayout, AppSidebar, AppHeader, CommandPalette
├── composables/      useApi, useAuth, useBudget, useCrud, useFormat, useProductSearch
├── core/             useAuthStore (Pinia), http-client
├── features/budgets/ TanStack Query — useBudgetsList, useDeleteBudget, BudgetListSkeleton
├── shared/ui/        FormField, SkeletonLoader
├── views/            Una vista por ruta
├── router.ts         Vue Router con guard de autenticación silenciosa
└── style.css         Tokens Tailwind 4 + dark mode + print
```

---

## Auth

- **Access token** (15 min): almacenado en Pinia (`useAuthStore`), enviado como `Authorization: Bearer`
- **Refresh token** (7 días): HttpOnly cookie `refresh_token` con `path=/api/auth`, persistido en tabla `refresh_token` de MySQL (JTI único por token)
- Rotación automática en cada `/api/auth/refresh`
- El router intenta refresh silencioso en cada navegación si no hay token en memoria

---

## API

- Prefijo global: `/api`
- Autenticación: guard `JwtAuthGuard` global; rutas públicas marcadas con `@Public()`
- Swagger: `http://localhost:3000/api/docs`
- Archivos subidos: `POST /api/uploads` → servidos desde `/uploads/`

---

## Reglas de desarrollo

### TypeScript
- Prohibido `any` explícito o implícito salvo casos documentados con `as any` (ej. tipos incompletos de librerías)
- DTOs de NestJS deben tener `@IsString()` + `@IsNotEmpty()` como mínimo
- Usar `import type` para tipos de Express en controllers decorados (`emitDecoratorMetadata`)

### Código limpio
- No dejar `console.log`, `console.error` ni `debugger` en código de producción
- No usar `alert()` ni `window.confirm()` — usar `toast` de `vue-sonner`
- Errores de red: capturar con `catch` anónimo y mostrar toast; nunca swallow silencioso sin comentario

### UI
- Ver [`docs/design-system.md`](docs/design-system.md) para todos los patrones visuales
- No usar clases `blue-*`, `slate-*` — siempre `brand-*` y `zinc-*`
- Toda vista con carga async: skeleton loader + `loading` ref con try/finally
- Eliminaciones: confirmación inline con `confirmingId`, nunca `window.confirm()`
- Estados de error: incluir botón "Reintentar"

---

## Comandos útiles

```bash
# Backend
cd backend
npm run start:dev          # Servidor con watch
npm run migration:run      # Aplicar migraciones pendientes
npm run migration:generate # Generar nueva migración desde entidades
npm test                   # Jest unit tests

# Frontend
cd frontend
npm run dev                # Vite dev server
npm run build              # Build + type-check
npx vue-tsc --noEmit       # Solo type-check
```

---

## Deploy

- CI/CD: GitHub Actions (`.github/workflows/`)
  - `ci.yml`: lint + build en cada push/PR a `main`
  - `deploy.yml`: SSH a Lightsail → git pull → build → `migration:run` → `pm2 restart`
- Secrets requeridos: `SSH_HOST`, `SSH_USER`, `SSH_KEY`
- Imágenes en producción: proxied por nginx en `/uploads/` → backend:3000
