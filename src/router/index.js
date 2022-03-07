import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Index', component: () => import('@/view/index') }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
