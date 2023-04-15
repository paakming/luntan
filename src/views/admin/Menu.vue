<template>
  <el-main>
    <el-select v-model="role" placeholder="请选择" @change="afterSelect">
        <el-option label="超级管理员" value="1"> </el-option>
        <el-option label="普通用户" value="2"> </el-option>
        <el-option label="管理员" value="3"> </el-option>
        <el-option label="测试用" value="4"> </el-option>
      </el-select>  
        <el-button type="primary" @click="openDrawer">查看权限列表</el-button>
        <el-button type="text" @click="open" v-if="role">添加</el-button>
      <el-table :data="gridData" v-if="gridData.length>0">
        <el-table-column property="menuId" label="menuId" width="150"></el-table-column>
        <el-table-column prop="menuName"  label="菜单名称" header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="path"  label="路劲" header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="component"  label="组件" header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="perm"  label="权限" header-align="center" align="center">
        </el-table-column>
              <el-table-column  label="操作" width="60"  fixed="right"  header-align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="移除权限" placement="top">
            <el-button type="danger"  size="mini"  circle icon="el-icon-delete"
               @click="handleDelete(scope.$index, scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      </el-table>
      <div style="padding: 10px 0" v-if="gridData.length>0">
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
  
    <el-drawer
      title="权限列表"
      :visible.sync="drawer2"
      size="100%"
      direction="rtl"
      >
      <!-- <el-button type="primary" @click="open" >添加</el-button> -->
      <el-table :data="gridData0" v-if="gridData0.length>0">
        <el-table-column property="menuId" label="menuId" width="150"></el-table-column>
        <el-table-column prop="menuName"  label="菜单名称" header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="path"  label="路劲" header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="component"  label="组件" header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="perm"  label="权限" header-align="center" align="center">
        </el-table-column>
      </el-table>
    </el-drawer>
  </el-main>

</template>
<script>

export default {
  data() {
    return {                         
      loading: true,
      //tableData: [],
       pageNum:1,
       pageSize:10,
       total: 0,
      formLabelWidth: '60px',
      form:{},
      spanArr: [],
      position: 0,
      //drawer: false,
      gridData:[],
      gridData0:[],
      drawer2: false,
      role:''
    }
  },
  methods: {

    //删除
    handleDelete(index, row) {
      this.$confirm('确认删除？',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.request.delete(`/role/${this.role}/${row.menuId}`).then((res)=>{
          if (res.code=='2000'){
            this.$message({
              message:'删除成功',
              type:"success"
            })
            this.selectByName()
          }
        })
      })
    },
      getMenu(){
        this.request.get('/menu').then((res) => {
          if(res.code===2000){
            this.gridData0 = res.data
          }
        })
      },
      openDrawer(){
        this.drawer2 = true
        this.getMenu()
      },
      afterSelect(){
        this.pageNum = 1
        this.selectByName()
      },
      selectByName(){
        this.request.get(`/menu/role/${this.role}/${this.pageNum}/${this.pageSize}`).then((res) => {
          if(res.code===2000){
            this.gridData = res.data.roleMenu
            this.total = res.data.total
          }
        })
      },
      open() {
        this.$prompt('请输入menuId', '添加权限', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          if(value===null){
            this.$message({
                type:'warning',
                message:"请输入menuId"
              })
              return;
          }
          this.request.post(`/menu/add`,{
            "menuId":value,
            "roleId":this.role
          }).then((res) => {
            if(res.code===2000){
              this.$message({
                type:'success',
                message:res.msg
              })
              //this.drawer = false
              this.selectByName()
            }else{
              this.$message({
                type:'error',
                message:res.msg
              })
            }
          })
        })
      },
      handleCurrentChange(pageNum){
      this.pageNum = pageNum
      this.selectByName()
    },
  },
}

</script>

<style scoped>

.table-container{
  padding: 10px;
}
</style>