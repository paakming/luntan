<template>
  <div class="div">
    <div style="margin: 180px auto;background-color: #ffffff;width: 350px;height: 350px;padding: 20px;border-radius: 10px">
      <div style="margin: 20px 0;text-align: center;font-size: 24px"><b>登 录</b></div>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="54px" class="demo-ruleForm">
        <el-form-item label="账号"  prop="account">
          <el-input type="text"  v-model="ruleForm.account" prefix-icon="el-icon-user" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" prefix-icon="el-icon-lock" autocomplete="off"></el-input>
        </el-form-item>
        <div >
          <div >
            <el-form-item label="验证码" prop="code" style="float: left;z-index: 11;position: relative;">
              <el-input  type="text" v-model="ruleForm.code" style="width:100px;float: left;"></el-input>
            </el-form-item>
          </div>
          <div style="float: right;z-index: 11;position: relative;" @click="get()">
            <img  :src="showCode()" width="120px" height="30px" @dragstart.prevent />
          </div>
        </div>
        <el-form-item>
          <el-button size="medium" type="primary" class="btn" @click="submitForm('ruleForm')">登录</el-button>
          <!-- <a href="javascript:;" style="font-size: 12px;" @click="register">注册账号</a> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
    data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      }
      callback()
    };
    var validateCount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号'));
      }
      callback()
    };
    var validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('验证码不能为空'));
      }
      callback()
    };
    return {
      time:1,
      verifyCode:"",
      uuid:"",
      user: "",
      ruleForm: {
        pass: '',
        account:'',
        code:''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        account: [
          {validator: validateCount, trigger: 'blur'}
        ],
        code:[
          {validator: validateCode, trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        var jobid = this.ruleForm.account
        var password = this.ruleForm.pass
        let verifyCode = this.ruleForm.code
        let uuid = this.uuid
        if (valid) {
          this.request.post("/checkVerify/"+verifyCode+"/"+uuid).then((res) => {
            console.log(res)
            if(res.code != '200'){
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
            if(res.code =='200'){
              this.request.post("/login",{
                username: jobid,
                password: password
            }).then((res) => {
              localStorage.setItem("token",JSON.stringify(res.data.token))
              localStorage.setItem("user",(res.data.user))
              localStorage.setItem("permission",(res.data.permission))
              if(res.code=='200'){
                this.$router.go(-1)
              }
          }).catch((res)=>{
            console.log(res)
          })

            }
          }).catch((err) => {
            console.log('error')
          });

        }
      });
    },
    register(){
      this.$router.push({path:"/register"})
    },
    get(){
      if(this.time==5){
        this.$message('请勿频繁获取验证码')
        return this.time -= 1;
      }
      this.request.get("/verifyCode").then(res=>{
        this.verifyCode = res.data.verifyCode
        this.uuid = res.data.uuid
        this.time += 1
      })
    },
    showCode(){
      return "data:image/png;base64,"+this.verifyCode
    }
  },
  mounted(){
    console.log(this.verifyCode)
    this.request.get("/verifyCode").then(res=>{
    this.verifyCode = res.data.verifyCode
    this.uuid = res.data.uuid
    })
  }
}
</script>

<style>
a{
    text-decoration: none;
    color: #C0C4CC;
  }
  .div{
    height: 100vh;
    background-image: linear-gradient(to bottom right, #F2F6FC, #409EFF);
    overflow: hidden;
  }
  .btn{
    width: 100%;
  }
</style>