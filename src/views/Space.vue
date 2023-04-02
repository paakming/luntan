<template>
    <div style="height: 100%">
        <el-container style="min-height:100vh ; border: 1px solid #eee" >
        <el-aside width="200px" style="background-color: rgb(238, 241, 246) min-height: 100%;overflow-x: hidden" >
            <el-menu :default-openeds="['1', '3']" style="min-height: 100%;overflow-x: hidden" router>
                <el-menu-item :index="`/space/${uid}/myinfo`">
                <i class="el-icon-s-home" ></i>
                <span slot="title">个人信息</span>
                </el-menu-item>
                <el-menu-item :index="`/space/${uid}/mypost`">
                <i class="el-icon-tickets"></i>
                <span slot="title">我的帖子</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        
        <el-container>          
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    data(){
        return{
            uid:this.$route.params.uid
        }
    }
}
</script>

<style scoped>

</style>