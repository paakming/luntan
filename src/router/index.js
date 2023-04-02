import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
    {
    path: "/",
    redirect:"/login"
  },
  {
    path:'/login',
    name:'login',
    component:()=>import('@/views/Login.vue'),
    beforeEnter:(to,from,next)=>{
      if(Boolean(localStorage.getItem("token"))){
        next({
          path:'/home'
        })
      }
      next()
    }
  },
  {
    path:'/register',
    name:'/register',
    component:()=>import('@/views/Register.vue')
  },
  {
    path:'/forgetPwd',
    name:'/forgetPwd',
    component:()=>import('@/views/ForgetPwd.vue')
  },
  {
    path: '/home',
    component:()=>import('@/views/Home.vue'),
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
      },
      {
        path:'/search',
        name:'search',
        component:()=>import('@/views/SearchResult.vue')
      },
      {
        path: '/space/:uid',
        name: '/space',
        component:()=>import('@/views/Space.vue'),
        children:[
          {
            path:'/space/:uid/myinfo',
            name:'/myinfo',
            component:()=>import('@/views/MyInfo.vue')
          },
          {
            path:'/space/:uid/mypost',
            name:'/mypost',
            component:()=>import('@/views/MyPost.vue')
          },
        ]
      },
    ]
  },

  {
    path: '/management',
    name: 'management',
    component: ()=>import('@/views/admin/Management.vue'),
    children:[
      {
        path:'/management/home',
        name:'home',
        component:()=>import('@/views/admin/Home.vue')
      },
      {
        path:'/management/post',
        name:'managementPost',
        component:()=>import('@/views/admin/Post.vue')
      },
      {
        path:'/management/user',
        name:'user',
        component:()=>import('@/views/admin/User.vue')
      },
      {
        path:'/management/role',
        name:'role',
        component:()=>import('@/views/admin/Role.vue')
      },
      {
        path:'/management/menu',
        name:'menu',
        component:()=>import('@/views/admin/Menu.vue')
      },
      {
        path:'/management/space',
        name:'adminSpace',
        component:()=>import('@/views/admin/Space.vue'),
        children:[
          {
            path:'/management/space/:uid/myinfo',
            name:'/adminMyinfo'
          }
        ]
      }
    ],
    beforeEnter:((to,from,next)=>{
        let paths = localStorage.getItem("path") ? JSON.parse(localStorage.getItem("path")) : {}
        if(paths.length<=0){
          alert('无权限')
          next({
            path:'/home'
          })
        }
        if(paths.includes('/management/home')){
          next()
        }else {
          alert('无权限')
          next({
            path:'/home'
          })
        }
        next()
    })
  },
  {
    path:'/:catchAll(.*)',
    component:()=>import('@/views/Error.vue')
  }
]
const router = new VueRouter({
  routes
})


export default router
