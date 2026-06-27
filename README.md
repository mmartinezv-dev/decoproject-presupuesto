# Presupuestos Constru — DecoProject

Aplicación web para generar y gestionar presupuestos de construcción y decoración. Permite crear presupuestos multi-sección con items de productos, registro de visita técnica, imágenes, y exportación a PDF.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Backend | NestJS 11 + TypeScript |
| Base de datos | MySQL / MariaDB (TypeORM) |
| Frontend | Vue 3 + Vite + Tailwind CSS 4 |
| Auth | JWT (Bearer token) |
| Servidor | AWS Lightsail + Nginx + PM2 |
| CI/CD | GitHub Actions |

---

## Estructura del proyecto

```
presupuestos-constru/
├── backend/          # API NestJS
│   ├── src/
│   │   ├── auth/         # JWT guard, login
│   │   ├── budgets/      # Presupuestos y sus items
│   │   ├── categories/   # Categorías de productos
│   │   ├── clients/      # Clientes
│   │   ├── products/     # Catálogo de productos
│   │   └── shared/       # Filtros e interceptores globales
│   └── .env              # Variables de entorno (no commitear)
├── frontend/         # App Vue 3
│   └── src/
│       ├── components/budget/  # Componentes del formulario de presupuesto
│       ├── composables/        # useApi, useAuth, useBudget, useCrud
│       ├── views/              # Vistas por ruta
│       └── types/              # Interfaces TypeScript
├── aws/              # Scripts de setup y deploy en Lightsail
└── .github/workflows/deploy.yml
```

---

## Levantar en desarrollo

### Requisitos

- Node.js 22+
- MySQL o MariaDB corriendo en `localhost:3306`
- Docker Desktop (opcional, para levantar la DB)

### 1. Levantar la base de datos con Docker

```bash
docker start nicomix_db
```

> Si es la primera vez, crear la base de datos:
> ```bash
> docker exec nicomix_db mariadb -uroot -proot_password -e "
>   CREATE DATABASE IF NOT EXISTS decoproject CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
>   CREATE USER IF NOT EXISTS 'decoproject'@'%' IDENTIFIED BY 'decoproject';
>   GRANT ALL PRIVILEGES ON decoproject.* TO 'decoproject'@'%';
>   FLUSH PRIVILEGES;"
> ```

### 2. Backend

```bash
cd backend
npm install
npm run start:dev
```

API disponible en `http://localhost:3000/api`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App disponible en `http://localhost:5173`

> El frontend hace proxy de `/api` al backend en `localhost:3000` vía Vite.

---

## Variables de entorno

Crear `backend/.env` con:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=decoproject
DB_PASS=decoproject
DB_NAME=decoproject

AUTH_USER=admin
AUTH_PASS=decoproject2024
JWT_SECRET=decoproject-secret-key
```

---

## Credenciales por defecto

| Campo | Valor |
|-------|-------|
| Usuario | `admin` |
| Contraseña | `decoproject2024` |

---

## API Endpoints

Todos los endpoints requieren `Authorization: Bearer <token>` excepto login.

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Login, retorna JWT |
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

---

## Funcionalidades

- **Presupuestos multi-sección**: agrupa items por sección con título editable
- **Cálculo automático**: neto, IVA (19%) y total en tiempo real
- **Visita técnica**: registro de hallazgos con imágenes y resumen
- **Obras preliminares**: lista de trabajos previos
- **Imágenes**: adjuntar fotos al presupuesto (almacenadas en base de datos)
- **Logo**: logo de empresa personalizable por presupuesto
- **Clientes**: búsqueda y autocompletado desde el catálogo
- **Productos**: catálogo con categorías, precio y unidad de medida

---

## Deploy en producción

El deploy se ejecuta automáticamente al hacer push a `main` vía GitHub Actions:

1. SSH al servidor Lightsail
2. `git pull origin main`
3. Build del backend (`npm run build`)
4. Build del frontend (`npm run build`)
5. Reinicio con PM2 (`pm2 restart decoproject`)

### Setup inicial del servidor

```bash
bash aws/setup.sh
```

### Variables de entorno en producción

Crear `/home/admin/app/backend/.env` en el servidor con los valores de producción.

---

## Secrets requeridos en GitHub

| Secret | Descripción |
|--------|-------------|
| `SSH_HOST` | IP del servidor Lightsail |
| `SSH_USER` | Usuario SSH (ej: `admin`) |
| `SSH_KEY` | Clave privada PEM |
