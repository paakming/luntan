<template>
  <div style="font-size: 12px;display: flex;line-height: 60px">
    <div style="flex: 1;font-size: 20px;">
      <span :class="collapseBtnClass" style="cursor: pointer" @click="Collapse"></span>
    </div>
    <el-menu  class="el-menu-demo" mode="horizontal" >
        <div style="width:80px;height: 60px;float: right;">
            <el-dropdown style="width:70px; cursor: pointer;padding-top: 3px;">
            <a-avatar :size="50" :src="circleUrl"  ></a-avatar>
            <el-dropdown-menu slot="dropdown" style="width: 100px;margin-top: 10px"  >
                <el-dropdown-item style="text-align: center;" disabled>{{ user.nickname }}</el-dropdown-item>
                <el-dropdown-item style="text-align: center;"><span @click="info">个人信息</span></el-dropdown-item>
                <el-dropdown-item style="text-align: center;"><span @click="logout()">退出</span></el-dropdown-item>
            </el-dropdown-menu>
            </el-dropdown>
        </div>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "HeaderArea",
  props:{
    collapseBtnClass: String,
    Collapse: Function,
  },
  data(){
    return {
      user: this.$store.state.user,
      circleUrl: '',
    }
  },
  methods:{
    logout(){
      this.$confirm('确认退出？',{
        type:"warning"
      }).then(()=>{
        localStorage.clear()
        this.$router.push("/")
      })
    },
    info(){
      this.$router.push(`/management/space/${this.user.uid}/myinfo`)
    }
  },
  mounted(){
    this.circleUrl = this.user.avatar
  }
}
</script>

<style scoped>

</style>