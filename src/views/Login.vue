<template>
  <div class="div">
    <div style="margin: 180px auto;background-color: #ffffff;width: 350px;height: 350px;padding: 20px;border-radius: 10px">
      <div style="margin: 20px 0;text-align: center;font-size: 24px"><b>登 录</b></div>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="54px" class="demo-ruleForm">
        <el-form-item label="用户名"  prop="account">
          <el-input type="text"  v-model="ruleForm.account" prefix-icon="el-icon-user" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" show-password prefix-icon="el-icon-lock" autocomplete="off"></el-input>
        </el-form-item>
        <div >
          <div >
            <el-form-item label="验证码" prop="code" style="float: left;z-index: 11;position: relative;">
              <el-input  type="text" v-model="ruleForm.code" style="width:100px;float: left;"></el-input>
            </el-form-item>
            
          </div>
          <div style="float: right;z-index: 11;position: relative;" @click="get()">
            <img  :src="showCode()" width="120px" height="30px" @dragstart.prevent /><br/>
            <span class="tips">点击图片更换验证码</span>
          </div>
        </div>
        <el-form-item>
          <el-button size="medium" type="primary" class="btn" @click="submitForm('ruleForm')">登录</el-button>
        </el-form-item>
      </el-form>
      <div style="float: right">
        <el-button type="text" @click="register">注册</el-button> 
        <el-button type="text" @click="forget">忘记密码</el-button>
      </div>
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
        var username = this.ruleForm.account
        var password = this.ruleForm.pass
        let verifyCode = this.ruleForm.code
        let uuid = this.uuid
        if (valid) {
          this.request.post("/checkVerify/"+verifyCode+"/"+uuid).then((res) => {
            if(res.code =='2000'){
                this.request.post("/login",{
                  username: username,
                  password: password
              }).then((res) => {
                if(res.code=='2000'){
                  localStorage.setItem("token",JSON.stringify(res.data.token))
                  localStorage.setItem("user",JSON.stringify(res.data.user))
                  localStorage.setItem("permission",JSON.stringify(res.data.permission))
                  localStorage.setItem("path",JSON.stringify(res.data.path))
                  localStorage.setItem("component",JSON.stringify(res.data.component))
                  this.$store.commit('updateUser',res.data.user)
                  this.$store.commit('updatePermission',res.data.permission)
                  this.$store.commit('updatePaths',res.data.path)
                  this.$store.commit('updateComponent',res.data.component)
                  this.$router.push('/home')
                }else{
                  this.$message({
                    type:'error',
                    message:res.msg
                  })
                  this.get()
                }
            })
            }else{
              this.$message({
                    type:'error',
                    message:res.msg
              })
              this.get()
            }
          })
        }
      });
    },
    get(){
      // if(this.time==5){
      //   this.$message('请勿频繁获取验证码')
      //   return this.time -= 1;
      // }
      this.request.get("/verifyCode").then(res=>{
        this.verifyCode = res.data.verifyCode
        this.uuid = res.data.uuid
        this.time += 1
      })
    },
    showCode(){
      return "data:image/png;base64,"+this.verifyCode
    },
    register(){
      this.$router.push('/register')
    },
    forget(){
      this.$router.push('/forgetPwd')
    }
  },
  mounted(){
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
  .tips{
    float: right;
    font-size: 1px;
    color: #409EFF;
  }
</style>