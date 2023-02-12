<template >
  <div >
        <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>{{post.title}}</span>
            <span style="float: right; padding: 3px 0" >{{post.createTime}}</span>

        </div>
            <div>
            <div >
                <div style="float: left;">
                    <p>{{post.nickname}}</p>
                    <el-avatar shape="square" :size="180" :src="post.avatar"></el-avatar>
                </div>
               </div >
               <div class="right">
                <div  class="content">
                     <div class="rich"   v-html="post.content"></div>
                 </div>
                 <div  class="reply">
                    <a href="javascript:0" @click="mouseToEditor()">回复</a> <a href="javascript:0" v-if="isManager" >删除</a>
                 </div>
               </div> 
            </div>
        </el-card>
        <div>
            <Comment v-for="item in comments" :key="item.cid" :item="item" />
        </div>
        <div>
            <div>

            </div>
            <div >
                <el-card>
            <div style="border: 1px solid #ccc;">
            <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editor"
                :defaultConfig="toolbarConfig"
                :mode="mode"
            />
            <Editor
                style="height: 250px; overflow-y: hidden;"
                v-model="html"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="onCreated"
            />
            </div>
            <el-button type="primary" @click="reply()">发表回复</el-button> 
        </el-card>
            </div>
            
        </div>
        
  </div>
</template>

<script>
import Comment from '@/components/Comment.vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

export default {
    components:{
        Comment,
        Editor,
        Toolbar
    },
    data(){
        return{
            permission: localStorage.getItem("permission") ? JSON.parse(localStorage.getItem("permission")) : {},
            user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
            comments:'',
            pid:'',
            post:'',
            editor: null,
            html: '',
            isManager:false,
            toolbarConfig: {
                excludeKeys:[
                    'todo',
                    'group-video',
                    'fullScreen',
                    'undo',
                    'redo',
                    'group-indent',
                    "bulletedList", // 无序列表
                    "numberedList", // 有序列表
                    'group-justify'
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
        }
    },
    methods: {
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
            this.request.post('/comment',{"pid":this.pid,"content":this.html}).then(res =>{
                console.log(res)
                this.$notify({
                message: '回复成功',
                type: 'success'
                });
                this.load()
                this.html=''
            })
        },
        mouseToEditor(){
            
        },
        load(){
            this.pid = this.$route.params.pid
            this.request.get("/post/"+this.pid).then((res) => {
            this.post = res.data
            this.request.get(`/comment/${this.pid}`).then((res) => {
                this.comments = res.data
            }).catch((err) => {
                
            });
        }).catch((err) => {
            
        });
        }
    },
    mounted(){
        this.load()
        for(var key in this.permission) {
             if(this.permission[key] ==='system:post:manage')
             this.isManager = true;
        }
    },
    beforeDestroy() {
        const editor = this.editor
        if (editor == null) return
        editor.destroy() // 组件销毁时，及时销毁编辑器
    }
}
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style scoped>
    .flex{
        display: flex;
        flex-direction: column;
    }
    .right{
        width: 800px;
        height: 400px;
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