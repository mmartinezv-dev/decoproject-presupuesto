# Presupuestos Constru — DecoProject

Aplicación web para generar y gestionar presupuestos de construcción y decoración. Permite crear presupuestos multi-sección con items de productos, registro de visita técnica, imágenes, y exportación a PDF.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Backend | NestJS 11 + TypeScript — Clean Architecture / DDD |
| Base de datos | MySQL 8 (TypeORM, migrations, soft deletes) |
| Frontend | Vue 3 + Vite + Tailwind CSS 4 + TanStack Query + Pinia |
| Auth | JWT Access Token (15 min) + Refresh Token rotatorio en HttpOnly cookie |
| Contenedores | Docker multi-stage + docker-compose |
| Servidor | AWS Lightsail + Nginx + PM2 |
| CI/CD | GitHub Actions (CI + Deploy) |

---

## Estructura del proyecto

```
presupuestos-constru/
├── backend/
│   ├── src/
│   │   ├── domain/               # Entidades y contratos de repositorio (puro TS)
│   │   ├── application/          # Servicios de aplicación (casos de uso)
│   │   ├── infrastructure/
│   │   │   ├── auth/             # RefreshTokenStore (JTI en memoria)
│   │   │   ├── config/           # TypeORM config + DataSource CLI
│   │   │   └── database/
│   │   │       ├── typeorm/
│   │   │       │   ├── entities/ # ORM entities (con audit columns e índices)
│   │   │       │   └── repositories/
│   │   │       └── migrations/   # Migraciones TypeORM
│   │   └── presentation/
│   │       ├── http/
│   │       │   ├── controllers/
│   │       │   ├── guards/       # JwtAuthGuard
│   │       │   ├── filters/
│   │       │   ├── interceptors/
│   │       │   └── decorators/   # @Public()
│   │       └── modules/          # NestJS modules
│   ├── Dockerfile
│   └── .env                      # Variables de entorno (no commitear)
├── frontend/
│   ├── src/
│   │   ├── core/
│   │   │   ├── api/              # httpClient (fetch + silent refresh) + QueryClient
│   │   │   └── auth/             # useAuthStore (Pinia, token en memoria)
│   │   ├── features/
│   │   │   └── budgets/
│   │   │       ├── api/          # Funciones fetch tipadas
│   │   │       ├── queries/      # useQuery hooks (TanStack Query)
│   │   │       ├── mutations/    # useMutation hooks
│   │   │       └── components/   # Skeleton loaders
│   │   ├── shared/ui/            # SkeletonLoader
│   │   ├── composables/          # useAuth (proxy Pinia), useApi (alias http)
│   │   ├── components/           # Componentes del formulario de presupuesto
│   │   ├── views/                # Vistas por ruta
│   │   └── types/                # Interfaces TypeScript
│   ├── docker/nginx.conf         # Nginx: static + proxy /api + history mode
│   └── Dockerfile
├── docker-compose.yml            # db + backend + frontend para dev/prod local
└── .github/workflows/
    ├── ci.yml                    # Lint + type-check + build
    └── deploy.yml                # SSH deploy + migration:run + pm2 restart
```

---

## Levantar en desarrollo

### Requisitos

- Node.js 20+
- Docker Desktop

### Opción A — Con docker-compose (recomendado)

```bash
# Levantar todo (db + backend + frontend)
docker compose up --build
```

- Frontend: `http://localhost`
- API: `http://localhost/api`

### Opción B — Manual (desarrollo con hot-reload)

#### 1. Base de datos

Puedes iniciar un contenedor de base de datos MySQL 8.0 usando la configuración provista en `docker-compose.yml`:

```bash
# Iniciar solo el servicio de base de datos en segundo plano
docker compose up -d db
```

> Si prefieres usar una base de datos propia, asegúrate de crear una base de datos llamada `decoproject` y configurar un usuario con permisos completos.

#### 2. Backend

```bash
cd backend
npm install
npm run migration:run   # aplicar migraciones pendientes
npm run start:dev
```

API disponible en `http://localhost:3000/api`

#### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App disponible en `http://localhost:5173`

> El frontend hace proxy de `/api` al backend en `localhost:3000` vía Vite.

---

## Variables de entorno

El backend requiere un archivo `.env` para su configuración. Puedes crear uno copiando el archivo de ejemplo:

```bash
cp backend/.env.example backend/.env
```

El contenido por defecto del archivo `.env` es el siguiente:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=decoproject
DB_PASS=decoproject
DB_NAME=decoproject

AUTH_USER=admin
AUTH_PASS=decoproject2024

JWT_ACCESS_SECRET=decoproject-access-secret-key
JWT_REFRESH_SECRET=decoproject-refresh-secret-key
JWT_ACCESS_EXPIRES=900
JWT_REFRESH_EXPIRES=604800
```

> [!IMPORTANT]
> En producción, reemplaza los valores de los secretos por cadenas largas y aleatorias.

> [!NOTE]
> Si utilizas Docker Compose (Opción A), el archivo `backend/.env` sigue siendo obligatorio ya que se carga en el contenedor del backend mediante `env_file: ./backend/.env`.

---

## Credenciales por defecto

| Campo | Valor |
|-------|-------|
| Usuario | `admin` |
| Contraseña | `decoproject2024` |

---

## Migraciones de base de datos

```bash
cd backend

# Aplicar migraciones pendientes
npm run migration:run

# Revertir la última migración
npm run migration:revert

# Ver estado de migraciones
npm run migration:show

# Generar nueva migración (tras cambios en entities)
npm run migration:generate -- src/infrastructure/database/migrations/NombreMigracion
```

---

## API Endpoints

Los endpoints marcados con `*` no requieren autenticación.

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST* | `/api/auth/login` | Login — retorna `{ accessToken }` + cookie HttpOnly |
| POST* | `/api/auth/refresh` | Rota el refresh token — retorna nuevo `{ accessToken }` |
| POST | `/api/auth/logout` | Revoca el refresh token y limpia la cookie |
| GET | `/api/budgets` | Listar presupuestos |
| GET | `/api/budgets/:id` | Obtener presupuesto |
| POST | `/api/budgets` | Crear presupuesto |
| PUT | `/api/budgets/:id` | Actualizar presupuesto |
| DELETE | `/api/budgets/:id` | Eliminar presupuesto |
| GET | `/api/products` | Listar productos |
| POST | `/api/products` | Crear producto |
| PUT | `/api/products/:id` | Actualizar producto |
| DELETE | `/api/products/:id` | Eliminar producto |
| GET | `/api/categories` | Listar categorías |
| POST | `/api/categories` | Crear categoría |
| PUT | `/api/categories/:id` | Actualizar categoría |
| DELETE | `/api/categories/:id` | Eliminar categoría |
| GET | `/api/clients` | Listar clientes |
| POST | `/api/clients` | Crear cliente |
| PUT | `/api/clients/:id` | Actualizar cliente |
| DELETE | `/api/clients/:id` | Eliminar cliente |

### Flujo de autenticación

```
POST /auth/login
  → body: { username, password }
  → response: { accessToken }   (15 min)
  → cookie: refresh_token       (7 días, HttpOnly, path=/api/auth)

POST /auth/refresh               (automático cuando el accessToken expira)
  → cookie: refresh_token        (enviada automáticamente por el browser)
  → response: { accessToken }   (nuevo, 15 min)
  → cookie: refresh_token        (rotado)

POST /auth/logout
  → Authorization: Bearer <accessToken>
  → revoca el JTI del refresh token
  → limpia la cookie
```

---

## Funcionalidades

- **Presupuestos multi-sección**: agrupa items por sección con título editable
- **Cálculo automático**: neto, IVA (19%) y total en tiempo real
- **Visita técnica**: registro de hallazgos con imágenes y resumen
- **Obras preliminares**: lista de trabajos previos
- **Imágenes**: adjuntar fotos al presupuesto
- **Logo**: logo de empresa personalizable por presupuesto
- **Clientes**: búsqueda y autocompletado desde el catálogo
- **Productos**: catálogo con categorías, precio y unidad de medida
- **Skeleton loaders**: estados de carga con animación
- **Code splitting**: chunks separados por dominio (budgets, catalog, clients)

---

## Deploy en producción

El deploy se ejecuta automáticamente al hacer push a `main` vía GitHub Actions:

1. CI valida lint + build de backend y frontend
2. SSH al servidor Lightsail
3. `git pull origin main`
4. Build del backend + `migration:run`
5. Build del frontend
6. Reinicio con PM2

### Setup inicial del servidor

```bash
bash aws/setup.sh
```

### Variables de entorno en producción

Crear `/home/admin/app/backend/.env` en el servidor con los valores de producción (secrets reales, `NODE_ENV=production`).

### Configuración de PM2 en producción

Dado que `backend/ecosystem.config.js` está ignorado en git por contener secretos/configuración específica del servidor, se debe crear en el servidor antes del inicio de PM2. Puedes crearlo copiando el archivo de plantilla:

```bash
cp /home/admin/app/backend/ecosystem.config.js.example /home/admin/app/backend/ecosystem.config.js
```

---

## Secrets requeridos en GitHub

| Secret | Descripción |
|--------|-------------|
| `SSH_HOST` | IP del servidor Lightsail |
| `SSH_USER` | Usuario SSH (ej: `admin`) |
| `SSH_KEY` | Clave privada PEM |
