<template>
<div style="height: 100%">
  <el-container style="min-height:100vh;">
   <el-aside :width="sideWidth+'px'" style="background-color: rgb(238, 241, 246);">
     <Aside :isCollapse="isCollapse" />
   </el-aside>
    <el-container>
    <el-header style="border-bottom: 1px solid #bfbfbf">
      <HeaderArea :collapse-btn-class="collapseBtnClass" :Collapse="Collapse"/>
    </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</div>
</template>


<script>
import Aside from "@/components/admin/Aside";
import HeaderArea from "@/components/admin/HeaderArea";
import User from "@/views/admin/User";
import Home from "@/views/admin/Home";
import Post from "@/views/admin/Post";

export default {
  name: "Manage",
  components:{
    HeaderArea,
    Aside,
    User,
    Home,
    Post
  },
 data() {
    return {
      collapseBtnClass:'el-icon-s-fold',
      isCollapse: false,
      sideWidth:200
    }
  },
  methods: {
    Collapse(){
      this.isCollapse = !this.isCollapse
      if(this.isCollapse){
        this.sideWidth = 64
      }else{
        this.sideWidth = 200
      }
      this.collapseBtnClass = this.isCollapse === false? 'el-icon-s-fold' : 'el-icon-s-unfold'
    }
  },
}

</script>
<style >

</style>