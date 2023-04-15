<template>
    <div class="div">
        <div style="margin: 100px auto;background-color: #ffffff;width: 520px;height: 500px;padding: 20px;border-radius: 10px">
        <div style="font-size: 24px">
            <el-button type="text" style="color: #000;" @click="login">登 录</el-button>
        </div>
        <div style="margin: 20px 0;text-align: center;font-size: 24px"><b>注 册</b></div>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="84px" class="demo-ruleForm">
            <el-form-item label="用户名"  prop="username"  >
            <el-input type="text"  v-model.trim="ruleForm.username"  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" >
            <el-input type="password" v-model.trim="ruleForm.password" show-password  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="昵称"  prop="nickname" >
            <el-input type="text"  v-model.trim="ruleForm.nickname" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email" >
            <el-input v-model.trim="ruleForm.email" autocomplete="off" ></el-input>
            </el-form-item>
            <el-form-item label="学号/工号" prop="identity" >
            <el-input v-model.trim="ruleForm.identity" autocomplete="off" ></el-input>
            </el-form-item>
            <el-form-item>
            <el-button size="medium" type="primary" class="btn" @click="submitForm('ruleForm')">注册</el-button>
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
                username:'',
                password: '',
                nickname:'',
                email:'',
                identity:'',
            },
            rules: {
                username: [
                    {message: '请输入用户名',trigger: 'blur',required: true},
                ],
                password: [
                    {message: '请输入密码', trigger: 'blur' ,required:true},
                    { min:6,max:10, message: '密码长度为6-10位', trigger: ['blur', 'change'] }
                ],
                nickname: [
                    {message: '请输入昵称', trigger: 'blur' ,required:true}
                ],
                identity: [
                    {message: '请输入您的学号或者工号', trigger: 'blur' ,required:true}
                ],
                email: [
                    { message: '请输入邮箱', trigger: 'blur' ,required:true},
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ],
            }
        }
    },
    methods:{
        login(){
            this.$router.push('/')
        },
        submitForm(formName){
            this.$refs[formName].validate((valid)=>{
                if(valid){
                    this.request.post('/user/register',this.ruleForm         
                    ).then((res) => {
                        if(res.code===2000){
                            this.$notify({
                                title: '成功',
                                message: res.msg,
                                type: 'success'
                            });
                            this.$router.push('/')
                        }
                        if(res.code===5000) {
                            this.$message({
                                type:'error',
                                message:res.msg
                            })
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