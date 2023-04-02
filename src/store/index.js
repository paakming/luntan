import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state(){
    return{
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      permission: localStorage.getItem("permission") ? JSON.parse(localStorage.getItem("permission")) : {},
      paths: localStorage.getItem("path") ? JSON.parse(localStorage.getItem("path")) : {},
      components: localStorage.getItem("component") ? JSON.parse(localStorage.getItem("component")) : {},
      // user:'',
      // permission:'',
      // paths:'',
      // components:'',
      searchList:'',
      searchKey:''
    }
  },
  getters: {
    // getUser(state){
    //   return state.user
    // },
    // getPath(state){
    //   return state.paths
    // },
    // getComponent(state){
    //   return state.components
    // }
  },
  mutations: {
    changeSearchList(state,newVal){
      state.searchList = newVal
    },
    changeSearchKey(state,newVal){
      state.searchKey = newVal
    },
    updateUser(state,newVal){
      state.user = newVal
    },
    updatePaths(state,newVal){
      state.paths = newVal
    },
    updateComponent(state,newVal){
      state.components = newVal
    },
    updatePermission(state,newVal){
      state.permission = newVal
    }
  },
  actions: {
  },
  modules: {
  }
})
