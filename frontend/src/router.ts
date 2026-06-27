import { createRouter, createWebHistory } from 'vue-router'

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

router.beforeEach((to) => {
  const token = localStorage.getItem('auth_token')
  if (!to.meta.public && !token) {
    return '/login'
  }
})

export default router
