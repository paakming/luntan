<template>
   <div style="">
    <!-- font-size: 12px;display: flex;line-height: 60px -->
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">首页</el-menu-item>
        <div style="width:80px;height: 60px;float: right;">
            <el-dropdown style="width:70px; cursor: pointer;padding-top: 3px;">
            <el-avatar :size="50" :src="circleUrl" v-if="isLogin" ></el-avatar>
            <el-button round v-if="!isLogin" circle style="margin-top: 10px;" @click="toLogin">登录</el-button>
            <!-- <i class="el-icon-arrow-down" style="" v-if="isLogin"></i> -->
            <el-dropdown-menu slot="dropdown" style="width: 100px;margin-top: 10px" v-if="isLogin" >
                <el-dropdown-item style="text-align: center;" disabled>{{ user.nickname }}</el-dropdown-item>
                <el-dropdown-item style="text-align: center;"><span >个人信息</span></el-dropdown-item>
                <el-dropdown-item style="text-align: center;"><span @click="logout()">退出</span></el-dropdown-item>
            </el-dropdown-menu>
            </el-dropdown>
        </div>
    </el-menu>
  </div> 
</template>

<script>
export default {
    data(){
        return{
            activeIndex: '1',
            user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
            circleUrl: "",
            isLogin: false
        }
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      toLogin(){
        this.$router.push('/login')
      },
      logout(){
        this.$confirm('是否退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
            this.request.get('/login/logout').then((res) => {
            this.$notify({
            message: '退出成功',
            type: 'success'
          });
        })
        this.$router.go(0)
        localStorage.clear()
        })
      }
    },
    mounted(){
      var arr = Object.keys(this.user);
      if(this.circleUrl ===''){
        this.isLogin=false
      }
      if(arr.length != 0){
        this.circleUrl = this.user.avatar
        this.isLogin = true
      }
      
    }
}
</script>

<style>

</style>