<template>
  <div style="display: block; ">
      <div style="">
        <img   src="@/assets/f83da47f13d148aab0af0af36b9e9ce7.png" style="width:100% ;height: 100%" />
      </div>
      <div style="padding-left: 75px;border-bottom: 1px #C0C4CC solid;">
        <el-link :underline="false" @click="load">全部帖子</el-link>&nbsp;
        <el-link :underline="false" type="success" @click=selectByType(types[0])>学习</el-link>&nbsp;
        <el-link :underline="false" type="primary" @click=selectByType(types[1])>欢乐</el-link>&nbsp;
        <el-link :underline="false" type="warning" @click=selectByType(types[2])>生活</el-link>&nbsp;
        <el-link :underline="false"  type="info" @click=selectByType(types[3])>其他</el-link>&nbsp;
      </div>
    <el-table :data="tableData"   v-loading="loading"
              tooltip-effect="dark" :row-class-name="tableRowClassName">
      <el-table-column prop="type"  width="65">
          <template slot-scope="scope">
          <el-tag effect="plain"
            :type="testTag(scope.row.type)"
            disable-transitions>{{scope.row.type}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" >
          <template slot-scope="scope" >
            <el-link :href="`#/post/${scope.row.pid}`"  @click="test(scope.$index, scope.row)"  :underline="false">{{scope.row.title}}</el-link>
          </template>
      </el-table-column>
      <el-table-column prop="pid" v-if="false">
      </el-table-column>
      <el-table-column prop="nickname" label="发帖人" width="150">
      </el-table-column>
      <el-table-column prop="commentNum" label="评论数" width="150">
      </el-table-column>      
      <el-table-column prop="createTime"  label="发帖时间" width="150">
      </el-table-column>
      <el-table-column prop="updateTime" label="最后回复" width="150">
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0">
      <div class="block">
        <el-pagination
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>

export default {
    data(){
        return{
          types : ['学习','欢乐','生活','其他'],
          loading:true,
          tableData: [],
          topTableData:[],
          pageNum:1,
          pageSize:10,
          total: 0,
          dialogFormVisible:false,
          formLabelWidth: '50px',
          form:{},
          user:this.$store.state.user
        }
    },
    methods:{
        testTag(tag){
          switch(tag){
            case '欢乐': return ''
            case '生活': return 'warning'
            case '学习': return 'success'
            case '其他': return 'info'
          }
        },
        handleCurrentChange(pageNum){
          this.pageNum = pageNum
          this.load()
        },
        load(){
            this.request.get(`/post?pageNum=${this.pageNum}&pageSize=${this.pageSize}`).then((res) => {
            this.tableData = res.data.post
            this.total = res.data.total
            this.loading = false
          })

        },
        selectByType(types){
          this.request.post(`/post/selectByType?pageNum=${this.pageNum}&pageSize=${this.pageSize}`,{"type":types}).then((res) => {
            this.tableData = res.data.post
            this.total = res.data.total
          })
        },
        tableRowClassName({row, rowIndex}) {
        if (row.isTop=='1') {
          return 'danger-row';
        }
      },
    },
    mounted(){
      this.load()
      let paths = this.$store.state.paths
      let com = this.$store.state.components
      let permission = this.$store.state.permission
      let uid = this.$store.state.user.uid
      if(paths==undefined||paths.length==0||com==undefined||com.length==0||permission==undefined||permission.length==0){
        this.$notify({
          title: '系统提示',
          message: '请绑定学号或工号进行验证，否则您只能浏览帖子而不能回复和进行其他操作。',
          duration:0,
          onClick(){
            this.$prompt('请输学号/工号', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(({ value }) => {
              this.request.post('/role/user',{"uid":uid,"identity":value}).then((res) => {
                if(res.code===2000){
                  this.$message({
                    type:'success',
                    message:'绑定成功'
                  })
                  localStorage.setItem("user",JSON.stringify(res.data.user))
                  localStorage.setItem("permission",JSON.stringify(res.data.permission))
                  localStorage.setItem("path",JSON.stringify(res.data.path))
                  localStorage.setItem("component",JSON.stringify(res.data.component))
                  location.reload()
                }else{
                  this.$message({
                    type:'danger',
                    message:'绑定失败'
                  })
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '你还可以前往个人空间进行绑定'
              });       
            });
          },
          onClose(){
            alert('你还可以前往个人空间进行绑定')
          }
        });
      }
    },

}
</script>

<style scoped>

a{
    text-decoration: none;
    color: #000;
}
</style>