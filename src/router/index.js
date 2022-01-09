import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/qq' },
  { path: '/:type', component: () => import('@/view/index.vue') }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
