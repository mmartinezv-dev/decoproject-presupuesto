import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './core/auth/useAuthStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "auth" */ './views/LoginView.vue'),
      meta: { public: true },
    },
    { path: '/', redirect: '/presupuestos/nuevo' },
    {
      path: '/presupuestos',
      component: () => import(/* webpackChunkName: "budgets" */ './views/PresupuestosListView.vue'),
    },
    {
      path: '/presupuestos/nuevo',
      component: () => import(/* webpackChunkName: "budgets" */ './views/PresupuestoView.vue'),
    },
    {
      path: '/presupuestos/:id',
      component: () => import(/* webpackChunkName: "budgets" */ './views/PresupuestoView.vue'),
      props: true,
    },
    {
      path: '/categorias',
      component: () => import(/* webpackChunkName: "catalog" */ './views/CategoriasView.vue'),
    },
    {
      path: '/productos',
      component: () => import(/* webpackChunkName: "catalog" */ './views/ProductosView.vue'),
    },
    {
      path: '/clientes',
      component: () => import(/* webpackChunkName: "clients" */ './views/ClientesView.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  if (to.meta.public) return

  const auth = useAuthStore()

  // Always try silent refresh to validate the session is still alive
  try {
    const res = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
    if (res.ok) {
      const { accessToken } = await res.json()
      auth.setToken(accessToken)
      return
    }
  } catch {
    // Network error or parse failure — fallback a login
  }

  // Refresh failed — session expired
  auth.logout()
  return '/login'
})

export default router
