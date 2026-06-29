import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: () => import('./views/LoginView.vue'), meta: { public: true } },
    { path: '/', redirect: '/presupuestos/nuevo' },
    { path: '/categorias', component: () => import('./views/CategoriasView.vue') },
    { path: '/productos', component: () => import('./views/ProductosView.vue') },
    { path: '/clientes', component: () => import('./views/ClientesView.vue') },
    { path: '/presupuestos', component: () => import('./views/PresupuestosListView.vue') },
    { path: '/presupuestos/nuevo', component: () => import('./views/PresupuestoView.vue') },
    { path: '/presupuestos/:id', component: () => import('./views/PresupuestoView.vue'), props: true },
  ],
})

router.beforeEach((to) => {
  const token = localStorage.getItem('auth_token')
  if (!to.meta.public && !token) {
    return '/login'
  }
})

export default router
