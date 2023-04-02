<template>
  <div>
    <el-empty description="没有查询到帖子" v-if="searchList.length==0">
      <el-button type="text" @click="back">去浏览其他帖子</el-button>
    </el-empty>
    <ul class="infinite-list" v-infinite-scroll="load" style="overflow:auto">
    <li v-for="s in $store.state.searchList" :key="s.pid" class="infinite-list-item" style="width: 800px;margin-left: 350px;list-style:none ;">
        <el-card class="box-card rich" >
            <div >
                <router-link :to="`/post/${s.pid}`"><h1 v-html="hightLight(s.title)"></h1></router-link> 
            </div>
            <div v-html="s.content "></div>
            <span>{{ s.nickname}}</span>
        </el-card>
    </li>
  </ul>
  </div>
</template>

<script>
export default {
    data(){
        return{
            searchList:''
        }
    },
    methods: {
      load () {
        this.searchList = this.$store.state.searchList
      },
      back(){
        this.$router.push('/home')
      },
      hightLight(text){
        const hightligthStr = `<span style="color: red">${this.$store.state.searchKey}</span>`
      //正则表达式//中间的内容都会当作匹配字符来使用，而不是数据变量
      //如果需要根据数据变量动态的创建正则表达式，则手动new RegExp
      // RegExp正则表达式构造函数
      //参数1:匹配模式字符串，它会根据这个字符串创建正则对象
      //参数2:匹配模式，要写到字符串中
      //gi表示正则字符串全部匹配和不区分大小写
        const reg = new RegExp(this.$store.state.searchKey, 'g')
        return text.replace(reg, hightligthStr)

      }
    },
    mounted(){
        this.load()
    }
}
</script>

<style scoped>
    .reply{
        width: 100%;
        height: 10%;
    }
    a{
        text-decoration: none;
        color: #000;
    } 
    .rich{
      width: 100%;
      height: 200px;
    }
    .rich >>> img{
        display: none;
    }
</style>