<template >
  <div>
    <a-row>
        <a-col :span="16" :offset="4">
            <a-card :title="post.title"  >
                <a slot="extra"  v-if="isManager" style="font-size: 10px;color: #f00;" @click="del">删除</a>
                <a-comment v-if="pageNum==1">
                    <template slot="actions">
                        <span>第1楼</span>
                        <span key="comment-basic-reply-to" @click="mouseToEditor()">回复</span>
                        <a-icon type="like" :theme="action === 'liked' ? 'filled' : 'outlined'"  @click="like" />
                        <span style="padding-left:'8px'; cursor: 'auto'">
                        {{ likes }}
                        </span>
                        <!-- <span key="comment-basic-reply-to" >举报</span> -->
                    </template>
                    <a slot="author">{{ post.nickname }}</a>
                    <a-avatar slot="avatar"   :src="post.avatar"   />
                    <div slot="content" class="antContent" v-html="post.content" > </div>
                    <a-tooltip slot="datetime" :title="post.createTime">
                        <span>{{post.createTime}}</span>
                    </a-tooltip>
                    <a-icon slot="datetime" type="eye" />
                    <span slot="datetime" style="padding-left: '8px';cursor: 'auto'">
                            {{ views }}
                   </span>
                </a-comment>
                <a-divider />
                <Comment v-for="item in comments" :key="item.cid" :item="item" @load="load"/>
                <div class="block" >
                        <el-pagination background
                        @current-change="handleCurrentChange"
                        :current-page="pageNum"
                        :page-size="pageSize"
                        layout=" prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                    </div>
                <a-card title="发表回复" :bordered="false">
                    <div style="border: 1px solid #ccc;">
                        <Toolbar
                            style="border-bottom: 1px solid #ccc"
                            :editor="editor"
                            :defaultConfig="toolbarConfig"
                            :mode="mode"
                        />
                        <Editor
                            style="height: 300px; overflow-y: hidden;"
                            v-model="html"
                            :defaultConfig="editorConfig"
                            :mode="mode"
                            @onCreated="onCreated"
                        />
                    </div>
                    <el-button type="primary" @click="reply()">发表</el-button> 
                </a-card> 
            </a-card>  
        </a-col>
    </a-row>  
        <div>
            <a-back-top />
            <strong style="color: rgba(64, 64, 64, 0.6)"> </strong>
        </div>
  </div>
</template>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<script>
import Comment from '@/components/Comment.vue'
import {Editor , Toolbar } from '@wangeditor/editor-for-vue'
export default {
    components:{
        Comment,
        Editor,
        Toolbar
    },
    data(){
        return{
            pageNum:1,
            pageSize:9,
            total: 0,
            permission:  this.$store.state.permission,
            user: this.$store.state.user,
            comments:{},
            pid:'',
            uid:this.$store.state.user.uid,
            post:'',
            editor: null,
            html: '',
            isManager:false,
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
                    }   
                }
            },
            mode: 'default', // or 'simple'
            likes: 0,
            views:0,
            action :  null
        }
    },
    methods: {
        like() {
            if(this.action == 'liked'){
                this.request.put(`/post/unDoLike/${this.pid}/${this.uid}`).then((res) => {
                    if(res.code===5000){
                        this.$message({
                            type:'info',
                            message:res.msg
                        })
                        this.action = 'liked'
                    }
                    this.likes =this.likes - 1
                    this.action = null
                })
            }else{
                this.request.put(`/post/doLike/${this.pid}/${this.uid}`).then((res) => {
                    if(res.code!=2000){
                        this.$message({
                            type:'error',
                            message:res.msg
                        })
      
                        this.action = 'liked'
                    }else{
                        this.likes =this.likes+1
                        this.action = 'liked'
                    }
                })
            }

        },
        onCreated(editor) {
            this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
            
        },
        reply(){
            if(this.html===''||this.html===null||this.html==='<p><br></p>'){
                this.$message({
                showClose: true,
                message: '回复不能为空',
                type: 'warning'
            });
            return false
            }
            this.request.post('/comment',{"pid":this.pid,"content":this.html,"uid":this.uid}).then(res =>{
                this.$notify({
                    message: '回复成功',
                    type: 'success'
                });
                this.load()
                this.html=''
            })
        },
        mouseToEditor(){
            window.scrollTo(0, document.documentElement.scrollHeight-document.documentElement.clientHeight);
        },
        load(){
            this.pid = this.$route.params.pid
            this.request.get("/post/pid/"+this.pid).then((res) => {
                this.post = res.data
                this.likes =  this.post.likes
                if(this.post.isLike==='1'){
                    this.action = 'liked'
                }
                if(this.post.uid === this.uid){
                    this.isManager = true
                }
                this.request.get(`/comment/${this.pid}`,{params:{
                    pageNum:this.pageNum,
                    pageSize:this.pageSize
                }}).then((res) => {
                    this.comments = res.data.comment
                    this.total = res.data.total
                })
            })
            this.request.put(`/post/views/${this.pid}`).then((res) => {
                this.views = res.data
            })
        },

        handleCurrentChange(pageNum){
            this.pageNum = pageNum
            this.load()
        },
        del(){
            this.$confirm('确认删除？',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(()=>{
            this.request.delete('/post/'+this.pid).then((res)=>{
            if (res.code=='2000'){
                this.$message({
                message:'删除成功',
                type:"success"
                })
                this.$router.push('/home')
            }
            })
        })
        }
        // toBottom(){
        //     window.scrollTo(0, document.documentElement.scrollHeight-document.documentElement.clientHeight);
        // },
    },
    mounted(){
        this.load()
        for(var key in this.permission) {
             if(this.permission[key] ==='system:post:manage')
             this.isManager = true;
        }
        // document.documentElement.scrollTop = document.body.scrollTop = 0;
    },
    beforeDestroy() {
        const editor = this.editor
        if (editor == null) return
        editor.destroy() // 组件销毁时，及时销毁编辑器
    }
}
</script>


<style scoped>
.antContent >>>img{
        width:80%;
        height:80%;
    }

    .flex{
  
        flex-direction: column;
    }
    .right{
        width: 800px;
        margin-left: 200px;
        border-left: rgb(221, 219, 219) solid 1px;
    }
    .content{
        width: 100%;
        height: 90%;
        float: left;
    }
    .reply{
        width: 100%;
        height: 10%;
        float: left;
    }
    a{
        text-decoration: none;
        color: #000;
    } 

    .rich >>> img{
        width:50%;
        height:50%;
    }
 
</style>