<template>
      <el-menu :default-openeds="['1', '3']" style="min-height: 100%;overflow-x: hidden"
               background-color="rgb(48,65,86)" text-color="#fff" active-text-color="#74ea74"
               :collapse-transition="false"         :collapse="isCollapse"
               router
      >
        <div style="height: 60px;line-height: 60px;text-align: center">
          <img src="@/assets/logo.png" alt="" style="width: 20px;position: relative;top: 5px;margin-right: 5px">
          <b style="color: white" v-show="!isCollapse">后台管理系统</b>
        </div>
        <el-menu-item index="/management/home">
            <i class="el-icon-s-home"></i>
            <span slot="title">主页</span>
        </el-menu-item>
        <el-menu-item index="/management/post">
          <i class="el-icon-document"></i>
          <span slot="title">帖子管理</span>
        </el-menu-item>
        <el-menu-item index="/management/user">
          <i class="el-icon-user-solid"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>
        <el-submenu  v-if="have(paths,['/management/role','/management/menu'])" index="0">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>权限管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/management/role" >用户角色</el-menu-item>
            <el-menu-item index="/management/menu">角色权限</el-menu-item>
          </el-menu-item-group>
      </el-submenu>
        <el-menu-item index="/home">
          <i class="el-icon-news"></i>
          <span slot="title">返回前台</span>
        </el-menu-item>
      </el-menu>
<!--    </el-aside>-->
</template>

<script>
export default {
  name: "Aside",
  props:{
    isCollapse: Boolean
  },
  data(){
    return{
      paths:this.$store.state.paths,
    }
  },
  methods: {
    have(arr,p){
      var flag = false
      for(var i =0;i<p.length;i++){
        if(arr.includes(p[i])){
          flag = true
        }
      }
      return  flag
    }   
  },
  mounted(){
    //this.paths = this.$store.state.paths
  }
}
</script>

<style scoped>

</style>