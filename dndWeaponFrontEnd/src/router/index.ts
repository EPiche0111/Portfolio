import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import HomeView from '../views/HomeView.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/weapon-creation/:id?',
    name: 'Weapon Creation',
    component: () => import('../views/WeaponFormView.vue'),
  },
  {
    path: '/weapon-selection',
    name: 'WeaponSelection',
    component: () => import('../views/WeaponListView.vue'),
  },
  {
    path: '/weapon-view/:id',
    name: 'Weapon View',
    component: () => import('../views/WeaponViewView.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
