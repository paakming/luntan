import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home,
    children:[
      {
        path:'',
        name:'postList',
        component:()=>import('@/views/PostList.vue')
      },
      {
        path:'/post/:pid',
        name:'post',
        component:()=>import('@/views/PostDetail.vue')
      }
    ]
  },
  {
    path:'/login',
    name:'login',
    component:()=>import('@/views/Login.vue')
  },
]
const router = new VueRouter({
  routes
})

export default router
