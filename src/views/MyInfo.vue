<template>
  <div>
    <el-card >
        <div slot="header" class="clearfix">
            <span>个人信息</span>
        </div>
        <div class="block"><a-avatar :size="100" :src="circleUrl"></a-avatar></div>
        <p>昵称：<span>{{ user.nickname }} </span></p>
        <p>用户名：<span>{{ user.username }} </span></p>
        <p>uid：<span>{{ user.uid }} </span></p>
        <p>学号/工号：<span>{{ user.identity }} </span></p>
        <p>性别：<span>{{ user.sex }} </span></p>
        <p>生日：<span>{{ user.birthday }} </span></p>
        <p>手机：<span>{{ user.phone }} </span></p>
        <p>邮箱：<span>{{ user.email}}  </span></p>
        <p>注册时间：<span> {{ user.createTime }} </span></p>
    </el-card>
    <el-card>
        <div slot="header" class="clearfix">
            <span>修改</span>
        </div>
        <div>
           <el-button type="text" size="large" @click="edit()">编辑</el-button><br>
           <el-button type="text" size="large" @click="changePwd()">修改密码</el-button><br>
            <el-button type="text" size="large" @click="binding" v-if="user.identity==null">绑定学号/工号</el-button>
        </div>
    </el-card>
    <div>
      <el-dialog title="编辑"  :visible.sync="dialogVisible"  width="50%" :close-on-click-modal="false" :before-close="cancel">
        <el-form :model="form" ref='form' :rules="rules" :label-width="formLabelWidth">
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
          <el-form-item label="昵称"  prop="nickname">
            <el-input v-model.trim="form.nickname"  autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model.trim="form.username"  autocomplete="off" :disabled="true" ></el-input>
          </el-form-item>
          <el-form-item label="uid" >
            <el-input v-model.trim="form.uid" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="性别">
          <el-radio-group v-model="form.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
            <el-radio label="保密"></el-radio>
          </el-radio-group>
        </el-form-item>
          <el-form-item label="生日"   value-format="yyyy-MM-dd" prop="birthday">
            <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="form.birthday" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="手机"  prop="phone">
            <el-input v-model.trim="form.phone" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model.trim="form.email" autocomplete="off" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="clearDialog">取 消</el-button>
          <el-button type="primary" @click="editInfo()" >确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog title="修改密码"  :visible.sync="dialogVisiblePwd"  width="50%" :close-on-click-modal="false" :before-close="cancelPwd">
        <el-form :model="formPwd" ref='formPwd' :rules="rules" :label-width="formLabelWidthPwd" >
          <el-form-item label="旧密码"  prop="oldPwd">
            <el-input v-model.trim="formPwd.oldPwd" type="password"  show-password autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="新密码"  prop="newPwd">
            <el-input v-model.trim="formPwd.newPwd" type="password" show-password autocomplete="off"  ></el-input>
          </el-form-item>
          <el-form-item label="重复密码" prop="repeatPwd">
            <el-input v-model.trim="formPwd.repeatPwd" type="password" show-password autocomplete="off"  ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="clearDialogPwd">取 消</el-button>
          <el-button type="primary" @click="submitPwd('formPwd')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
    data(){
      // var validateOldPwd = (rule, value, callback) => {
      //   if (value === '') {
      //     callback(new Error('请输入旧密码'));
      //   }
      //   callback()
      // };
      // var validateNewPwd = (rule, value, callback) => {
      //   if (value === '') {
      //     callback(new Error('请输入新密码'));
      //   }
      //   callback()
      // };
      // var validateRePwd = (rule, value, callback) => {
      //   if (value === '') {
      //     callback(new Error('请重复输入新密码'));
      //   }
      //   callback()
      // };
        return{
            user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
            imgUrl: '',
            circleUrl:'',
            orginName:'',
            dialogVisible: false,
            dialogVisiblePwd: false,
            formLabelWidth: '60px',
            formLabelWidthPwd:'80px',
            form:'',
            formPwd: {
              oldPwd: '',
              newPwd:'',
              repeatPwd:''
          },
          rules: {
            oldPwd: [
             // { validator: validateOldPwd, trigger: 'blur' }
             {message: '请输入旧密码',trigger: 'blur',required: true},
             { min:6,max:10, message: '请正确输入密码，长度为6-10位', trigger: ['blur', 'change'] }
            ],
            newPwd: [
              //{validator: validateNewPwd, trigger: 'blur'}
              {message: '请输入新密码',trigger: 'blur',required: true},
              { min:6,max:10, message: '请正确输入密码，长度为6-10位', trigger: ['blur', 'change'] }
            ],
            repeatPwd:[
              //{validator: validateRePwd, trigger: 'blur'}
              {message: '请重复输入新密码',trigger: 'blur',required: true},
              { min:6,max:10, message: '请正确输入密码，长度为6-10位', trigger: ['blur', 'change'] }
            ],
            nickname:[
                {message: '请输入昵称',trigger: 'blur',required: true},
            ],
            email: [
                { message: '请输入邮箱', trigger: 'blur' ,required:true},
                { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
            ],
            birthday:[
                {message: '请选择生日',trigger: 'blur',required: true},
            ],
            phone:[
                {message: '请输入手机号',trigger: 'blur',required: true},
                {pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
            ],
          }
        }
    },
    methods:{
        edit(){
            this.form = this.user
            this.dialogVisible = true
            this.imgUrl = this.form.avatar
            this.orginName = this.form.nickname
        },
        editInfo(){
          // if(this.orginName===this.form.nickname){
          //     this.form.nickname = null
          // }
          this.$refs['form'].validate((vaild)=>{
            if(vaild){
              let nickname = this.form.nickname
              let sex = this.form.sex
              let phone = this.form.phone
              let birthday = new Date(this.form.birthday)
              let email = this.form.email
              let avatar = this.form.avatar
                this.request.put('/user',{
                  "uid":this.form.uid,
                  "nickname": nickname,
                  "sex": sex,
                  "phone":phone,
                  "birthday":birthday,
                  "email":email,
                  "avatar":avatar
                }).then((res)=>{
                    this.dialogVisible = false
                    if (res.code==2000){
                    this.$message({
                        message:res.msg,
                        type:"success"
                    })
                    localStorage.setItem("user",JSON.stringify(res.data)) 
                    this.$router.go(0) 
                    }if(res.code===5000) {
                    this.$message({
                        message:res.msg,
                        type:"error"
                    })
                    }
                })
                }
            })
        },
        changePwd(){
          this.dialogVisiblePwd = true
        },
        submitPwd(formName){
          this.$refs[formName].validate((vaild)=>{
            let oldPwd = this.formPwd.oldPwd
            let newPWd = this.formPwd.newPwd
            let RePwd = this.formPwd.repeatPwd
            let flag = false
            if(newPWd === RePwd){
              flag = true
            }
            else{
              this.$message({
              message: '两次输入的密码不一致',
              type: 'warning'
            });
            }
            if(newPWd === oldPwd){
              flag = false
              this.$message({
                message: '新旧密码不能一样',
                type: 'warning'
              });
            }
            if(vaild && flag){
              this.request.post('/user/changPwd',{
                "oldPassword":oldPwd,
                "newPassword":newPWd,
                "repeatPassword":RePwd
              }).then((res) => {
                if(res.code ===2000){
                  this.$message({
                    message: res.msg,
                    type: 'success'
                  });     
                  localStorage.clear()
                  this.$router.push('/')

                }
                if(res.code===5000){
                  this.$message({
                    message: res.msg,
                    type: 'error'
                  }); 
                }
              })
            }
          })
        },
            //取消编辑时，重新加载数据
        cancel(){
            this.dialogVisible = false
            this.form = {}
            this.user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
        },
        //清空对话框表单
        clearDialog(){
          this.dialogVisible = false
          this.form = {}
          this.user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
        },
        cancelPwd(){
          this.dialogVisiblePwd = false
        },
        clearDialogPwd(){
        this.dialogVisiblePwd = false
        this.formPwd = {}
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
        binding(){
          this.$prompt('请输学号/工号', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(({ value }) => {
              this.request.post('/role/user',{"uid":this.user.uid,"identity":value}).then((res) => {
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
            })
        }
    },
    mounted(){
        this.circleUrl = this.user.avatar

    }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>