<template>
  <el-main>
    <el-table :data="tableData" border  v-loading="loading"
              tooltip-effect="dark"
              :row-style="{height:'20px'}"

              style="font-size: 10px"
              >
      <el-table-column prop="uid" label="uid" sortable align="center" >
      </el-table-column>
      <el-table-column prop="username" label="用户名"  header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="roleName"  label="角色名称" sortable header-align="center" align="center">
      </el-table-column>
      <el-table-column  label="操作"  width="120"  fixed="right"  header-align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="更改用户角色" placement="top">
            <el-button type="primary"  size="mini" icon="el-icon-edit" circle  @click="changeRole(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除用户角色" placement="top" style="margin-left: 20px;">
            <el-button type="danger"  size="mini"  circle icon="el-icon-delete"
               @click="handleDelete(scope.$index, scope.row)"></el-button>
          </el-tooltip>
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
    <div>
      <!-- 编辑Form -->
      <el-dialog title="编辑" :visible.sync="dialogVisibleEdit" width="500px" >
        <el-form :model="form">
          <el-form-item label="uid" :label-width="formLabelWidth">
            <el-input v-model="form.uid" :disabled="true" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色" :label-width="formLabelWidth">
            <el-select v-model="form.role" :placeholder="form.roleName">
              <el-option label="超级管理员" value="1"> </el-option>
              <el-option label="普通用户" value="2"> </el-option>
              <el-option label="管理员" value="3"> </el-option>
              <!-- <el-option label="测试用" value="4"> </el-option> -->
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="edit">确 定</el-button>
        </div>
      </el-dialog>
    </div>

  </el-main>
</template>
<script>
export default {
  data() {
    return {                         
      loading: true,
      tableData: [],
      pageNum:1,
      pageSize:10,
      total: 0,
      formLabelWidth: '60px',
      form:{},
      dialogVisibleEdit:false
    }
  },
  methods: {
    //获取分页
    load(){
      this.request.get("/role/userRole",{params:{
          pageNum: this.pageNum,
          pageSize:this.pageSize
        }}).then((res)=>{
        this.tableData = res.data.userRole
        this.total = res.data.total
        this.loading = false;
      })
    },

    handleCurrentChange(pageNum){
      this.pageNum = pageNum
      this.load()
    },
    changeRole(row){
      this.dialogVisibleEdit = true
      this.form = row
    },
    edit(){
      let uid = this.form.uid
      let roleId = this.form.role
      if(roleId===undefined){
        this.dialogVisibleEdit = false
        return;
      }
      this.request.put(`/role/${uid}/${roleId}`).then((res) => {
        this.dialogVisibleEdit = false
        if (res.code===2000){
          this.$message({
            message:'编辑成功',
            type:"success"
          })
          this.load()
        }else {
          this.$message({
            message:res.msg,
            type:"error"
          })
        }
      })
    },
    cancel(){
      this.dialogFormVisible = false
      this.load()
    },
    //删除
    handleDelete(index, row) {
      this.$confirm('确认删除？',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.request.delete('/role/'+row.uid).then((res)=>{
          if (res.code===2000){
            this.$message({
              message:'删除成功',
              type:"success"
            })
            this.load()
          }else{
            this.$message({
              message:res.msg,
              type:'error'
            })
          }
        })
      })
    },
  },
  mounted() {
    this.load()
  }
}
</script>



<style scoped>


</style>