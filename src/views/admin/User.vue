<template>
  <el-main>
    <div>
      <el-button type="primary" icon="el-icon-circle-plus-outline" style="margin-left: 5px" @click="dialogFormVisibleAdd = true">添加</el-button>
      <el-button type="danger" icon="el-icon-remove-outline"  :disabled="multipleSelection.length<=0" style="margin-left: 5px" @click="DeleteIds">批量删除</el-button>
      <el-input  placeholder="输入uid查找"   v-model="inputUid"    clearable style="width: 200px;"></el-input>
      <el-button type="primary" icon="el-icon-search"  @click="search">搜索</el-button>
      <el-date-picker
          v-model="value1"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button type="primary"   @click="searchByTime">筛选注册时间</el-button>
        <el-button type="primary"  @click="this.refresh">刷新</el-button>
    </div>
    <el-table :data="tableData" border stripe v-loading="loading"
              tooltip-effect="dark"
              @selection-change="handleSelectionChange"
              >
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column prop="uid" sortable label="uid" width="88" >
      </el-table-column>
      <el-table-column prop="username"  label="用户名" >
      </el-table-column>
      <el-table-column prop="nickname"  label="昵称" >
      </el-table-column>
      <el-table-column prop="phone" label="手机号" >
      </el-table-column>
      <el-table-column prop="email" label="邮箱" >
      </el-table-column>
      <el-table-column prop="avatar" label="头像" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" style="width: 100%;height: 100%;">
        </template>
      </el-table-column>
      <el-table-column prop="identity" label="学号/工号" width="88" >
      </el-table-column>
      <el-table-column prop="birthday" sortable label="生日" width="88" >
      </el-table-column>
      <el-table-column prop="createTime" sortable label="注册时间" width="90" >
      </el-table-column>
      <el-table-column  label="操作"  width="100" fixed="right" >
        <template slot-scope="scope">  
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" circle icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" :disabled="multipleSelection.length>0" circle icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></el-button>
          </el-tooltip>
          <!-- <el-button type="warning" @click="resetpwd(scope.$index, scope.row)">重置密码</el-button> -->
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
      <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="500px" :close-on-click-modal="false" :before-close="cancel">
        <el-form :model="form" :rules="rules" ref="form" :label-width="formLabelWidth">
          <el-form-item label="头像" >
            <el-upload style="width: 200px;"
                class="avatar-uploader"
                action="http://localhost:8080/img/upload"
                :show-file-list="false"
                :limit="1"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="imgUrl" :src="imgUrl" class="avatar" style="width:100% ;height: 100%;">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
          </el-form-item>
          <el-form-item label="uid" >
            <el-input v-model="form.uid" :disabled="true" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户名" >
            <el-input v-model="form.username" :disabled="true" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model.trim="form.nickname" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model.trim="form.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model.trim="form.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model.trim="form.sex" placeholder="请选择性别">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
              <el-option label="保密" value="保密"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学号/工号" prop="identity">
            <el-input v-model.trim="form.identity" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="生日" prop="birthday" value-format="yyyy-MM-dd">
            <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="form.birthday" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="edit">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div>
      <!-- 添加Form -->
      <el-dialog title="添加" :visible.sync="dialogFormVisibleAdd"  width="500px" :close-on-click-modal="false" :before-close="clearDialog">
        <el-form :model="formAdd" ref='formAdd' :rules="rules" :label-width="formLabelWidth">
          <el-form-item label="用户名" prop="username">
            <el-input v-model.trim="formAdd.username"  autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model.trim="formAdd.nickname" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model.trim="formAdd.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model.trim="formAdd.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="formAdd.sex" placeholder="请选择活动区域">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
              <el-option label="保密" value="保密"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学号/工号" prop="identity">
            <el-input v-model.trim="formAdd.identity" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="生日" prop="birthday" value-format="yyyy-MM-dd">
            <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="formAdd.birthday" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <span style="font-size: 8px;color: #909399;margin-left: 50px;" class="el-icon-info">默认密码为“000000”</span>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="clearDialog">取 消</el-button>
          <el-button type="primary" @click="insert">确 定</el-button>
          <!-- <el-tooltip  effect="light" content="默认密码为“000000”" placement="right">
          <i class="el-icon-info"></i>
        </el-tooltip> -->
        </div>
      </el-dialog>
    </div>
  </el-main>
</template>

<script>
export default {
  name: "User",
  data() {
    return {
      value1: '',
      inputUid:'',
      loading: true,
      tableData: [],
      pageNum:1,
      pageSize:10,
      timePage:false,
      total: 0,
      dialogFormVisible: false,
      dialogFormVisibleAdd: false,
      form: {},
      formAdd:{},
      orginName:'',
      formLabelWidth: '90px',
      multipleSelection: [],
      imgUrl: '',
      rules:{
        username: [
            {message: '请输入用户名',trigger: 'blur',required: true},
        ],
        password: [
            {message: '请输入密码', trigger: 'blur' ,required:true}
        ],
        email: [
            { message: '请输入邮箱', trigger: 'blur' ,required:true},
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        nickname:[
            {message: '请输入昵称',trigger: 'blur',required: true},
        ],
        birthday:[
            {message: '请选择生日',trigger: 'blur',required: true},
        ],
        phone:[
            {message: '请输入手机号',trigger: 'blur',required: true},
            {pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ],
        sex:[
            {message: '请选择性别',trigger: 'blur',required: true},
        ],
        identity:[
            {message: '请输入学号或者工号',trigger: 'blur',required: true},
        ],
      }
    }
  },
  methods: {
    //获取user，分页
    refresh(){
      this.pageNum = 1
      this.inputUid = ''
      this.value1=[]
      this.timePage = false
      this.load()
    },
    load(){
      this.request.get("/user/all",{params:{
          pageNum: this.pageNum,
          pageSize:this.pageSize
        }}).then((res)=>{
        this.tableData = res.data.userList
        this.total = res.data.total
        this.loading = false;
      })
    },
    handleCurrentChange(pageNum){
      this.pageNum = pageNum
      if(this.timePage===true){
        this.searchByTime()
      }else {
        this.load()
      }
    },

    //删除
    handleDelete(index, row) {
      this.$confirm('确认删除？',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.request.delete('/user/'+row.uid).then((res)=>{
          if (res.code===2000){
            this.$message({
              message:'删除成功',
              type:"success"
            })
            this.load()
          }
        })
      }).catch((err)=>{
        console.log(err)
      })
    },
    //批量删除
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    DeleteIds(){
      let ids = this.multipleSelection.map(v => v.uid)
      this.$confirm('确认删除'+this.multipleSelection.length+'条用户信息吗？',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.request.post(`/user/del/${ids}`).then((res)=>{
          if (res.code===2000){
            this.$message({
              message:'删除成功',
              type:"success"
            })
            this.load()
          }
        })
      })
    },
    //添加
    insert(){
      this.$refs['formAdd'].validate((vaild)=>{
        if(vaild){
          this.dialogFormVisible = false
          let formData = this.formAdd
          if (formData !=null){
            this.request.post('/user',formData).then((res)=>{
              if (res.code===2000){
                this.$message({
                  message:'添加成功',
                  type:"success"
                })
                this.load()
                this.clearDialog()
              }else {
                this.$message({
                  message:res.msg,
                  type:"error"
                })
              }
            })
          }
        }
      })
    },
    //编辑
    handleEdit(index, row) {
      this.dialogFormVisible = true
      this.form = row
      this.orginName = this.form.nickname
      this.imgUrl = this.form.avatar
    },
    edit(){
      this.$refs['form'].validate((vaild)=>{
        if(vaild){
          if(this.orginName===this.form.nickname){
            this.form.nickname = null
          }
          //this.form.birthday = new Date(this.form.birthday)
          this.request.put('/user',this.form).then((res)=>{
            this.dialogFormVisible = false
            if (res.code===2000){
              this.$message({
                message:'编辑成功',
                type:"success"
              })
            }else {
              this.$message({
                message:res.msg,
                type:"error"
              })
            }
          })
          this.form.nickname = this.orginName
          this.orginName=''
        }
      })
      
    },
    //取消编辑时，重新加载数据
    cancel(){
      this.dialogFormVisible = false
      this.load()
    },
    //清空对话框表单
    clearDialog(){
      this.dialogFormVisibleAdd = false
      this.formAdd = {}
    },
    resetpwd(index, row){
      this.$confirm('确认重置密码？',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.request.put('/user/reset',row.uid).then((res)=>{
          if (res.code==='200'){
            this.$message({
              message:'重置密码成功',
              type:"success"
            })
            this.load()
          }
        })
      }).catch(()=>{

      })
    },
      handleAvatarSuccess(res, file) {
          this.form.avatar = file.response.data.url
          this.imgUrl = file.response.data.url
        // this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === "image/jpg";
            const isPng = file.type==="image/png";
            const isJpeg = file.type==="image/jpeg";
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG && !isPng && !isJpeg) {
            this.$message.error('上传头像图片只能是png,jpg,jpeg格式!');
            return false
            }
            
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            return false
            }
            return  true;
        },
        search(){
          this.value1 = []
          if(this.inputUid.length<=0){
            this.$message({
              type:'warning',
              message:'uid不能为空'
            })
            return false
          }
          this.request.post('/user/searchByUid',{"uid":this.inputUid}).then((res) => {
            this.tableData = res.data
          })
        },
        searchByTime(){
          this.inputUid = ''
          if(this.value1<=0){
            this.$message({
              type:'warning',
              message:'筛选时间不能为空'
            })
            return false
          }
          this.request.post(`/user/searchByTime?pageNum=${this.pageNum}&pageSize=${this.pageSize}`,{
            "from":this.value1[0],
            "to":this.value1[1]
          }).then((res) => {
            this.tableData = res.data.user
            this.total = res.data.total
            this.timePage =true
          })
        }
  },
  created() {
    this.load()
  }
}
</script>

<style scoped>

</style>