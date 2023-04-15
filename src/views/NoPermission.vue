<template>
    <div>
      <el-empty :image="require('../assets/404.png')" description="您的账号没有权限，请联系管理员"  :image-size="200">
      </el-empty>
    </div>
  </template>
  
  <script>
  export default {
    methods:{
        test() {
            localStorage.clear()
        // ...
        }
    },
    created() {
        window.addEventListener('beforeunload', () => this.test())
     },
     destroyed() {
        window.removeEventListener('beforeunload', () => this.test())
    }
  }
  </script>
  
  <style>
  
  </style>