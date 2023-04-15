<template>
        <div class="div">
        <div style="margin: 140px auto;background-color: #ffffff;width: 470px;height: 420px;padding: 20px;border-radius: 10px">
        <div style="font-size: 24px">
            <el-button type="text" style="color: #000;" @click="login">登 录</el-button>
        </div>
        <div style="margin: 20px 0;text-align: center;font-size: 24px"><b>忘 记 密 码</b></div>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="67px">
            <el-form-item label="用户名"  prop="username"  >
            <el-input type="text"  v-model.trim="ruleForm.username"  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="password" >
            <el-input type="password" v-model.trim="ruleForm.password" show-password  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email" >
            <el-input v-model.trim="ruleForm.email" autocomplete="off"  ></el-input>
            </el-form-item>
            <!-- <el-button type="" @click="getCode()" style="margin-left:70px;">点击发送验证码到邮箱</el-button> -->
            <el-form-item label="验证码" prop="code" >
                <el-col :span="13">
                    <el-input v-model="ruleForm.code" autocomplete="off" ></el-input>
                </el-col>
                <el-button type="" @click="getCode()" style="margin-left:70px;">获取验证码</el-button>
            </el-form-item>
            <el-form-item>
            <el-button size="medium" type="primary" class="btn" @click="submitForm('ruleForm')">修改密码</el-button>
            </el-form-item>
        </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            ruleForm: {
                email:'',
                code:'',
                username:'',
                password: '',
            },
            rules: {
                email: [
                    { message: '请输入邮箱', trigger: 'blur' ,required:true},
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ],
                code: [
                    { message: '请输入验证码', trigger: 'blur' ,len:6},
                ],
                username: [
                    {message: '请输入用户名',trigger: 'blur',required: true},
                ],
                password: [
                    {message: '请输入新密码', trigger: 'blur' ,required:true},
                    { min:6,max:10, message: '请正确输入密码，长度为6-10位', trigger: ['blur', 'change'] }
                ],
            }
        }
    },
    methods:{
        login(){
            this.$router.push('/')
        },
        getCode(){
            // let email = this.ruleForm.email
            // if(email == null ||email.length==0){
            //     this.$notify({
            //         title: '错误',
            //         message: '请正确输入邮箱地址',
            //         type: 'error'
            //     });
            //     return ;
            // }
            this.$refs['ruleForm'].validate(valid=>{
                if(valid){
                    this.request.get(`/email?emailReceiver=${this.ruleForm.email}`).then((res) => {
                        if(res.code==2000){
                            this.$notify({
                                title: '成功',
                                message: res.msg,
                                type: 'success'
                            });
                        }
                        if(res.code==5000){
                            this.$notify({
                                title: '失败',
                                message: res.msg,
                                type: 'error'
                            });
                        }
                    })
                }
            })

        },
        submitForm(formName){
            this.$refs[formName].validate((valid)=>{
                let username = this.ruleForm.username
                let password = this.ruleForm.password
                let email = this.ruleForm.email
                let code = this.ruleForm.code
                if(valid){
                    this.request.post('/user/forget',{
                        "username":username, 
                        "password":password,
                        "email":email,
                        "code":code
                    }).then((res) => {
                        if(res.code==2000){
                            this.$notify({
                                title: '成功',
                                message: '修改成功',
                                type: 'success'
                            });
                            this.$router.push('/')
                        }
                    })
                }
            })
        }
    }
}
</script>

<style scoped>
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