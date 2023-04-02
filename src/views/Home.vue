<template>
  <div style="height: 100%;">
    <el-container style="min-height:100vh;">
      <el-container>
      <el-header >
        <!-- style="border-bottom: 1px solid #bfbfbf" -->
        <HeaderAreaVue />
      </el-header>
        <el-main >
          <router-view/>
        </el-main>
        <el-footer style="text-align: center">
          <FooterArea/>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import FooterArea from '@/components/FooterArea.vue';
import HeaderAreaVue from '@/components/HeaderArea.vue'
export default {
    components:{
    HeaderAreaVue,
    FooterArea
},
    data(){
        return{

        }
     
    },
    methods:{

    }
}
</script>

<style>

</style>