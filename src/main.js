import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueRouter from "vue-router";
import store from './store'
import ElementUI from 'element-ui';
import './plugins/antd';
import 'element-ui/lib/theme-chalk/index.css';
import 'ant-design-vue/dist/antd.css';
import './assets/global.css'
import request from "@/utils/request";

Vue.config.productionTip = false
Vue.prototype.request=request

Vue.use(ElementUI,{size:"small"})
Vue.use(VueRouter)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')



router.beforeEach((to,from,next)=>{
  if(to.path=='/login'||to.path=='/register'||to.path=='/forgetPwd') return next()
  else if(!Boolean(localStorage.getItem("token"))){
    ElementUI.Message({
      message: '请重新登录',
      type:"error"
    })
    return next({
      path:'/'
    })
  }
  next()
})

router.afterEach(() => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
})