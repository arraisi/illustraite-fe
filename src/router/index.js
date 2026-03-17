import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Workspace from '../views/Workspace.vue';
import Gallery from '../views/Gallery.vue';
import Billing from '../views/Billing.vue';

const routes = [
  { path: '/login', component: Login, meta: { requiresAuth: false } },
  { path: '/register', component: Register, meta: { requiresAuth: false } },
  { path: '/', component: Workspace, meta: { requiresAuth: true } },
  { path: '/gallery', component: Gallery, meta: { requiresAuth: true } },
  { path: '/billing', component: Billing, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    // TODO: wire to auth store in Phase 4
    return true;
  }
});

export default router;
