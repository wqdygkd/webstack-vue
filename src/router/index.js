import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Index', component: () => import('@/view/index') },
  { path: '/admin', name: 'Admin', component: () => import('@/view/admin') },
  { path: '/oauth/callback', name: 'Oauth', component: () => import('@/view/admin/oauth') }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
