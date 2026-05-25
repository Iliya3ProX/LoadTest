import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import BalanceDetailView from '@/views/BalanceDetailView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/balance/:id',
      name: 'balance-detail',
      component: BalanceDetailView
    }
  ]
});

export default router;
