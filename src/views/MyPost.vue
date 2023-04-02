<template>
  <div>
    <el-table :data="tableData"  stripe v-loading="loading"   tooltip-effect="dark">
              <!-- //@selection-change="handleSelectionChange" -->

        <el-table-column prop="type"  width="65" label="类型">
            <template slot-scope="scope">
            <el-tag effect="plain"
                :type="testTag(scope.row.type)"
                disable-transitions>{{scope.row.type}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="title"  label="帖子标题">
            <template slot-scope="scope" >
                <el-link :href="`#/post/${scope.row.pid}`"  @click="test(scope.$index, scope.row)"  :underline="false">{{scope.row.title}}</el-link>
                <!-- target="_blank"  -->
            </template>
        </el-table-column>
        <el-table-column prop="pid" v-if="false">
        </el-table-column>
        <el-table-column prop="commentNum" width="150" label="评论数">
        </el-table-column>      
        <el-table-column prop="createTime"  width="150" label="发布时间">
        </el-table-column>
        <el-table-column  label="操作"  width="80" fixed="right" >
        <template slot-scope="scope">
          <el-button type="text" style="color: #ff0000;" :disabled="multipleSelection.length>1" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
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
            loading:false,
            tableData: [],
            pageNum:1,
            pageSize:10,
            total: 0,
            uid: this.$route.params.uid,
            multipleSelection: [],
        }
    },
    methods:{
        load(){
          this.request.get(`/post/uid/${this.uid}?pageNum=${this.pageNum}&pageSize=${this.pageSize}`).then((res) => {
            this.tableData = res.data.post
            this.total = res.data.total
        }).catch((err) => {
            
        });
        },
        testTag(tag){
          switch(tag){
            case '欢乐': return ''
            case '生活': return 'info'
            case '学习': return 'success'
          }
        },
        handleCurrentChange(pageNum){
          this.pageNum = pageNum
          this.load()
        },
        //删除
        handleDelete(index, row) {
          this.$confirm('确认删除？',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            this.request.delete('/post/'+row.pid).then((res)=>{
              if (res.code=='2000'){
                this.$message({
                  message:'删除成功',
                  type:"success"
                })
                this.load()
              }
            })
          })
        },
    },
    mounted(){
        this.load()
    }
}
</script>

<style>

</style>