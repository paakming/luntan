<template>
  <div style="height: 100%">
  <el-container style="min-height:100vh;">
    <el-container>
    <el-header style="border-bottom: 1px solid #bfbfbf">
      <HeaderAreaVue />
    </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</div>
</template>

<script>
import HeaderAreaVue from '@/components/HeaderArea.vue'
export default {
    components:{
        HeaderAreaVue
    },
    data(){
        return{
            pid:"",
            post:""
        }
     
    },
    methods:{

    }
}
</script>

<style>

</style>