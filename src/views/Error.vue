<template>
  <div>
    <el-empty :image="require('../assets/404.png')" description="页面不存在"  :image-size="200">
      <el-button type="text" @click="back">返回</el-button>
    </el-empty>
  </div>
</template>

<script>
export default {
  methods:{
    back(){
      this.$router.go(-1)
    }
  }
}
</script>

<style>

</style>