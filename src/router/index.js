import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/Index.vue'
// import About from '../views/About.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: About
    // },
  ]
})

export default router
