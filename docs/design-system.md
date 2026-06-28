# Design System — DecoProject

Stack: Vue 3 · Tailwind CSS 4 · TypeScript

---

## Tokens de color

Definidos en `frontend/src/style.css` bajo `@theme`. El color primario es **Midnight Blue** (`#1E40AF`).

| Token | Valor hex | Uso principal |
|-------|-----------|---------------|
| `brand-50` | `#eff6ff` | Fondos de estado activo suaves |
| `brand-100` | `#dbeafe` | Paso completado en stepper |
| `brand-300` | `#93c5fd` | Líneas conectoras de stepper completadas |
| `brand-400` | `#60a5fa` | Iconos de hover en inputs de imagen |
| `brand-500` | `#3b82f6` | Focus ring (`focus:ring-brand-500/20`), flecha activa |
| `brand-600` | `#2563eb` | Botones de acción secundaria, badges, links |
| `brand-700` | `#1d4ed8` | Hover de brand-600 |
| `brand-800` | `#1e40af` | **Botón primario**, sidebar activo, borde de header |
| `brand-900` | `#1e3a8a` | Hover de botón primario |
| `brand-950` | `#172554` | Énfasis máximo |

Neutrales: escala `zinc-*` (no usar `slate-*` ni `gray-*`).

---

## Tipografía

- **Familia:** Inter (Google Fonts, cargada en `index.html` con `preconnect`)
- **Variable CSS:** `--font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif`
- `html` tiene `-webkit-font-smoothing: antialiased`

| Uso | Clases |
|-----|--------|
| Título de página | `text-lg font-semibold text-zinc-900 dark:text-zinc-100` |
| Subtítulo / descripción | `text-sm text-zinc-500 dark:text-zinc-400` |
| Encabezado de sección | `text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500` |
| Cuerpo de tabla | `text-sm text-zinc-800 dark:text-zinc-200` |
| Badge / label de campo | `text-xs font-medium text-zinc-500 dark:text-zinc-400` |
| Monoespaciado (RUT, ID) | `font-mono text-xs` |

---

## Dark mode

- Activado por clase `.dark` en `<html>` (no `prefers-color-scheme`)
- Configurado con `@custom-variant dark (&:where(.dark, .dark *))` en `style.css`
- Gestionado con `useColorMode()` de `@vueuse/core` (persiste en `localStorage`)
- Anti-FOUC: script inline en `index.html` que lee `localStorage['vueuse-color-scheme']` y aplica `.dark` antes del primer render

---

## Patrones de componentes

### Input / Select / Textarea

```html
class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm
       text-zinc-900 placeholder-zinc-400 transition-colors
       focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20
       dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
```

Textarea agrega `resize-none`. Select omite `placeholder-*`.

### Botón primario

```html
class="px-5 py-2.5 bg-brand-800 text-white text-sm font-semibold rounded-lg
       hover:bg-brand-900 disabled:opacity-50 transition-colors shadow-sm"
```

### Botón secundario (outline)

```html
class="px-5 py-2.5 border border-zinc-300 text-zinc-600 text-sm font-semibold rounded-lg
       hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800
       transition-colors"
```

### Botón de acción inline (tabla)

```html
<!-- Editar -->
class="rounded-md p-1.5 text-zinc-400 transition-colors
       hover:bg-zinc-100 hover:text-zinc-700
       dark:hover:bg-zinc-800 dark:hover:text-zinc-200"

<!-- Eliminar -->
class="rounded-md p-1.5 text-zinc-400 transition-colors
       hover:bg-red-50 hover:text-red-600
       dark:hover:bg-red-500/10 dark:hover:text-red-400"
```

### Card / contenedor

```html
class="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
```

Con padding interno: agregar `p-5`.

---

## Tablas

```html
<!-- Wrapper -->
<div class="overflow-hidden rounded-xl border border-zinc-200 bg-white
            dark:border-zinc-800 dark:bg-zinc-900">
  <table class="w-full text-sm">

    <!-- Header -->
    <thead>
      <tr class="border-b border-zinc-200 bg-zinc-50
                 dark:border-zinc-800 dark:bg-zinc-800/50">
        <th class="px-4 py-3 text-left text-xs font-semibold uppercase
                   tracking-wide text-zinc-400 dark:text-zinc-500">
          Columna
        </th>
      </tr>
    </thead>

    <!-- Body con AutoAnimate -->
    <tbody v-auto-animate>
      <tr class="border-b border-zinc-100 transition-colors last:border-0
                 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/30">
        <td class="px-4 py-3.5 font-medium text-zinc-800 dark:text-zinc-200">
          ...
        </td>
      </tr>
    </tbody>

    <!-- Footer (subtotales) -->
    <tfoot>
      <tr class="bg-zinc-50 dark:bg-zinc-800/50
                 border-t-2 border-zinc-200 dark:border-zinc-700">
        <td class="py-3 px-4 text-xs font-semibold text-zinc-500
                   dark:text-zinc-400 text-right uppercase tracking-widest">
          Subtotal
        </td>
      </tr>
    </tfoot>

  </table>
</div>
```

Tabla de presupuesto usa header oscuro: `bg-zinc-900 dark:bg-zinc-950 text-zinc-100`.

---

## Confirmación de eliminación inline

No usar `window.confirm()`. Patrón estándar con `confirmingId`:

```vue
<script setup>
const confirmingId = ref<number | null>(null)

async function handleRemove(id: number) {
  confirmingId.value = null
  await remove(id)
}
</script>

<template>
  <template v-if="confirmingId === item.id">
    <span class="mr-1 text-xs text-zinc-500">¿Eliminar?</span>
    <button class="rounded px-2 py-1 text-xs font-medium text-red-600
                   hover:bg-red-50 dark:hover:bg-red-500/10"
            @click="handleRemove(item.id)">Sí</button>
    <button class="rounded px-2 py-1 text-xs font-medium text-zinc-500
                   hover:bg-zinc-100 dark:hover:bg-zinc-800"
            @click="confirmingId = null">No</button>
  </template>
  <template v-else>
    <button @click="confirmingId = item.id"><!-- Trash2 icon --></button>
  </template>
</template>
```

---

## Notificaciones (Toasts)

Usar `toast` de `vue-sonner`. El componente `<Toaster>` está montado en `AppLayout.vue`.

```typescript
import { toast } from 'vue-sonner'

toast.success('Registro guardado')
toast.error('Error al guardar. Intentá de nuevo.')
```

No usar `alert()`, `confirm()` ni `console.error()` en código de producción.

---

## Estado de carga (Skeleton)

Componente: `frontend/src/shared/ui/SkeletonLoader.vue`

Props: `height` (string, ej. `"h-4"`), `width` (string, ej. `"w-40"`), `rounded` (boolean).

```vue
<SkeletonLoader height="h-4" width="w-40" />
<SkeletonLoader height="h-24" :rounded="true" />
```

Animación de listas: directiva `v-auto-animate` de `@formkit/auto-animate/vue` en `<tbody>`.

---

## Layout

```
AppLayout.vue
├── AppSidebar.vue     — colapsable: 240px / 64px, transition-all duration-300
├── AppHeader.vue      — título dinámico, botón de búsqueda, toggle dark mode
├── CommandPalette.vue — Ctrl+K / ⌘K, Teleport to body
└── <RouterView />
```

- `useColorMode()` vive en `AppLayout.vue`
- `<Toaster>` (vue-sonner) vive en `AppLayout.vue` con `rich-colors`, `position="bottom-right"`
- Sidebar tiene tooltips (`title`) cuando está colapsado

---

## Iconos

Librería: `@lucide/vue` (no usar `lucide-vue-next`, está deprecated).

```typescript
import { Pencil, Trash2, Plus, Search, FileText } from '@lucide/vue'
```

Tamaños estándar: `h-4 w-4` (inline), `h-5 w-5` (header), `h-8 w-8` (empty state).

---

## Clases de impresión / PDF

Definidas en `style.css` bajo `@media print`.

| Clase | Comportamiento |
|-------|----------------|
| `.no-print` | `display: none` en impresión y PDF |
| `.print-only` | `display: flex` solo en impresión |
| `.print-section` | `break-inside: avoid` (no cortar el bloque entre páginas) |
| `.print-breakable` | Permite corte entre páginas (para tablas largas) |
| `.print-section-start` | Permite salto de página antes del bloque |

Exportación PDF: `html2pdf.js` (importación dinámica). Durante la exportación se activa la clase `.pdf-exporting` en el wrapper, que oculta `.no-print` vía CSS scoped:

```css
.pdf-exporting :deep(.no-print) { display: none !important; }
.pdf-exporting .print-section    { display: block !important; }
```

El paso activo del stepper se ignora durante PDF: todos los pasos tienen `v-show="currentStep === N || exportingPdf"`.

---

## FormField

Componente wrapper para labels de formulario: `frontend/src/shared/ui/FormField.vue`

```vue
<FormField label="Nombre" required>
  <input v-model="form.name" ... />
</FormField>
```

Renderiza label con asterisco rojo (`text-brand-500`) si `required` es `true`.

---

## Convenciones generales

- No hardcodear `blue-*` o `slate-*` — usar siempre `brand-*` y `zinc-*`
- No usar `window.confirm()`, `alert()`, ni `console.error()` en producción
- El color `bg-brand-600` es para botones de acción en formularios; `bg-brand-800` para el botón primario principal de página
- Los estados de error deben incluir un botón **Reintentar** que llame a `refetch()`
- Vistas con carga async deben mostrar skeleton mientras llegan los datos (`loading` ref + try/finally en `onMounted`)
