<template>
  <div >
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span> </span>
            <span style="float: right; padding: 3px 0" >{{item.createTime}}</span>
        </div>
        
        <div class="flex">
            <p>{{item.replyName}}</p>
            <el-avatar shape="square" :size="180" :src="item.avatar" ></el-avatar> 
        </div>
        <div class="right">
            <div class="item">
                <div class="rich" v-html="item.content"></div>
                <el-drawer
                    title="查看回复"
                    :visible.sync="drawer"
                    :direction="direction"
                    size="30%"
                    >
                     <el-card v-for="(sub,index) in item.subComment" :key="sub.cid" shadow="never"  >
                        <span>{{sub.replyName}}</span>&nbsp;&nbsp;<span>回复@{{sub.targetName}}&nbsp;</span><div class="rich" v-html="sub.content"></div>
                        <p>{{sub.createTime}}</p>
                        <a href="javascript:0" @click="drawerReply(sub,index)">回复</a><a href="javascript:0">删除</a>
                    </el-card> 
                    <el-drawer
                        :append-to-body="true"
                        :visible.sync="innerDrawer"
                        :direction="innerDrawerDirection"
                        size="50%">
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
                    </el-drawer>
                </el-drawer>

            </div>    
            <div class="reply">
                <div class="content" v-if="item.subComment.length>0">
                    <a href="javascript:0"  @click="drawer = true">查看{{item.subComment.length}}条回复</a>
                </div>
                <a href="javascript:0" @click="reply(item.cid,item.replyName)">回复</a><a href="javascript:0" @click="del(item.cid)">删除</a>
                <el-drawer
                    :title="title"
                    :visible.sync="comdrawer"
                    :direction="comdirection"
                    size="40%">
                    <div style="border: 1px solid #ccc;">
                        <Toolbar
                            style="border-bottom: 1px solid #ccc"
                            :editor="editor"
                            :defaultConfig="toolbarConfig"
                            :mode="mode"
                        />
                        <Editor
                            style="height: 200px; overflow-y: hidden;"
                            v-model="html"
                            :defaultConfig="editorConfig"
                            :mode="mode"
                            @onCreated="onCreated"
                        />
                    </div>
                    <el-button type="primary" @click="doReply(item.cid,item.pid)" >发表回复</el-button> 
                </el-drawer>
            </div>
        </div>
    </el-card>
  </div>
</template>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
export default {
    props:["item"],
    components:{
        Editor,
        Toolbar
    },

    data(){
        return{
            title:'',
            drawer: false,
            direction: 'rtl',
            comdrawer:false,
            comdirection: 'btt',
            innerDrawer: false,
            innerDrawerDirection: 'btt',
            editor: null,
            html: '',
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
    methods:{
        drawerReply(sub,index){
            this.innerDrawer = true
            console.log(sub)
            this.html = sub.content
        },
        onCreated(editor) {
            this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        },
        beforeDestroy() {
        const editor = this.editor
        if (editor == null) return
        editor.destroy() // 组件销毁时，及时销毁编辑器
        },
        reply(cid,replyName){
            this.title = '回复  '+replyName
            this.comdrawer = true
        },
        doReply(cid,pid){
            if(this.html===''||this.html===null||this.html==='<p><br></p>'){
                this.$message({
                showClose: true,
                message: '回复不能为空',
                type: 'warning'
            });
            return false
            }
            this.request.post('/comment',{"pid":pid,"content":this.html,"cid":cid}).then(res =>{
                console.log(res)
                this.$notify({
                message: '回复成功',
                type: 'success'
                });
                this.html=''
                this.$router.go(0)
            })
        },
        del(cid){
            this.$confirm('确认删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.request.delete(`/comment/${cid}`).then((res) => {
                    this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.$router.go(0)
                })
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
        }
    }
}
</script>
<style scoped>
    a{
        text-decoration: none;
        color: #000;
    }
    .flex{
        float: left; 
        
    }
    .right{
        width: 800px;
        height: 300px;
        margin-left: 200px;
        border-left: rgb(221, 219, 219) solid 1px;
    }
    .item{
        float: left;
        width: 100%;
        height: 80%;
        display:table;
    }
    .reply{
        float: left;
        height: 20%;
        width: 100%;
        padding-top: 10px;
    }

    .content{
        line-height: 20px;
    }
    
    .rich >>> img{
        width:50%;
        height:50%;
    }
</style>
