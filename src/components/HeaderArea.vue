<template>
   <div style="">
    <el-menu  class="el-menu-demo" mode="horizontal">
        <el-menu-item v-if="have(paths,'/home')"><router-link to="/home">首页</router-link></el-menu-item>
        <el-menu-item   ><a href="#/management/home" target="_blank"  v-if="have(paths,'/management/home')" >后台</a></el-menu-item>
        <div style="width:80px;height: 60px;float: right;">
            <el-dropdown style="width:70px; cursor: pointer;padding-top: 3px;">
            <a-avatar :size="50" :src="circleUrl"></a-avatar>     
            <el-dropdown-menu slot="dropdown" style="width: 100px;margin-top: 10px" v-if="isLogin" >
                <el-dropdown-item style="text-align: center;" disabled>{{ user.nickname }}</el-dropdown-item>
                <el-dropdown-item style="text-align: center;"><span ><el-link :href="`#/space/${user.uid }/myinfo`">我的空间</el-link></span></el-dropdown-item>
                <el-dropdown-item style="text-align: center;"><span @click="logout()">退出</span></el-dropdown-item>
            </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div style="float: right;line-height: 70px;margin-right: 40px;">
              <el-input  placeholder="输入帖子名字标题"   v-model="input"    clearable style="width: 400px;"></el-input>
              <el-button type="primary" icon="el-icon-search"  @click="search">搜索</el-button>
            <el-button el-button type="primary" @click="dialogFormVisible = true">发帖</el-button>
        </div>
    </el-menu>
    <div style="display: flex;">
        <el-dialog title="发布帖子" :visible.sync="dialogFormVisible" width="60%">
        <el-form :model="form" :rules="rules" ref="form" :label-width="formLabelWidth">
          <el-form-item label="标题" prop="title" >
            <el-input v-model.trim="form.title" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type" >
            <el-select v-model="form.type" placeholder="请选择" >
              <el-option label="学习" value="学习"></el-option>
              <el-option label="生活" value="生活"></el-option>
              <el-option label="欢乐" value="欢乐"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
            </el-form-item>
          <el-form-item label="内容"  prop="content" >
            <div style="border: 1px solid #ccc;">
                <Toolbar
                    style="border-bottom: 1px solid #ccc"
                    :editor="editor"
                    :defaultConfig="toolbarConfig"
                    :mode="mode"
                />
                <Editor
                    style="height: 300px; overflow-y: hidden;"
                    v-model.trim="form.content"
                    :defaultConfig="editorConfig"
                    :mode="mode"
                    @onCreated="onCreated"
                />
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addPost('form')">确 定</el-button>
        </div>
      </el-dialog>
      </div>
  </div> 
</template>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
export default {
  components:{
        Editor,
        Toolbar
    },
    data(){
      var richContent = (rule, value, callback) => {
      if ( !value|| !value.replaceAll(/<[^>]+>/g,"")) {
        callback(new Error('请输入帖子内容'));
      }
      callback()
    };
        return{
            user: '',
            paths:[],
            input: '',
            circleUrl: '',
            isLogin: false,
            dialogFormVisible:false,
            formLabelWidth: '50px',
            form:{
              title:'',
              type:'',
              content:''
            },
            editor: null,
            html: '',
            toolbarConfig: {
              excludeKeys:[
                'headerSelect',
                'group-more-style',
                'todo',
                'group-video',
                'fullScreen',
                'fontFamily',
                'lineHeight',
                'fontSize',
                'undo',
                'redo',
                'group-indent',
                "bulletedList", // 无序列表
                "numberedList", // 有序列表
                'group-justify',
                'insertTable'
              ]
             },
            editorConfig: {
                placeholder: '请输入内容...',
                MENU_CONF:{
                    uploadImage:{
                        fieldName:'file',
                        server:'http://localhost:8080/img/upload',
                        maxFileSize: 10 * 1024 * 1024,
                    }   
                }
            },
            mode: 'default', // or 'simple'
            rules:{
              title:[
                {message: '请输入帖子标题',trigger: 'blur',required: true},
              ],
              type:[
                {message: '请选择帖子类型',trigger: 'change',required: true},
              ],
              content:[
                {validator: richContent,trigger: 'blur'}
              ]
            }
        }
    },
    methods: {
      onCreated(editor) {
            this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
      },
      search(){
        let key = this.input
        if(key !='' &&key !=null){
          this.request.get(`/post/search/${key}`).then((res) => {
            if(this.$route.path!='/search'){
              this.$router.push('/search')
            }
            if(res.code===2000){
              this.$store.commit('changeSearchList',res.data)
              this.$store.commit('changeSearchKey',key)
            }
            else{
              this.$store.commit('changeSearchList','')
            }
          })
        }
        
      },
      addPost(formName){
        this.$refs[formName].validate((valid)=>{
          if(valid){
            let title = this.form.title
            let type = this.form.type
            let content = this.form.content
            this.dialogFormVisible = false
            this.request.post('/post',{"title":title,"content":content,"type":type}).then((res) => {
              if(res.code===2000){
                this.$message({
                  type:'success',
                  message:"发帖成功"
                })
                this.$router.go(0)
              }
              if(res.code===5000){
                  this.$message({
                  type:'error',
                  message:"发帖失败"
                })
              }
            })
            }
          })

        },
      toLogin(){
        this.$router.push({
          name:'login'
        })
      },

      logout(){
        this.$confirm('是否退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
            this.request.get('/logout').then((res) => {
              if(res.code=='2000'){
                this.$notify({
                message: '退出成功',
                type: 'success'
              });
              }
              localStorage.clear()
            this.$router.push('/')
        })
        })
      },
      issLogin(){
        if(this.circleUrl ===''){
        this.isLogin=false
      }
        this.circleUrl = this.user.avatar
        this.isLogin = true
      },
       have(arr,p){
         return  arr.includes(p)
      }
    },
    mounted(){ 
      this.paths = this.$store.state.paths
      this.user = this.$store.state.user
      this.issLogin()
    },
    beforeDestroy() {
        const editor = this.editor
        if (editor == null) return
        editor.destroy() // 组件销毁时，及时销毁编辑器
    }
}
</script>

<style scoped>
  a{
    text-decoration: none;
  }
</style>