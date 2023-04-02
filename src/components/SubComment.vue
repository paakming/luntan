<template>
<div style="background-color:rgb(245, 245, 245) ;width: 100%;">
    <a-comment >
    <template slot="actions">
        <a-icon type="like" :theme="action === 'liked' ? 'filled' : 'outlined'"  @click="like" />
        <span style="padding-left: '8px'; cursor: 'auto'">
            {{ likes }}
        </span>
        <span key="comment-basic-reply-to" v-if="have(component,'btnCommentAdd',sub.replyId)&&!showReply2" @click="showReply2=true">回复</span>
        <span  v-if="have(component,'btnCommentAdd',sub.replyId)&&showReply2" @click="showReply2=false">收起回复</span>
        <span key="comment-basic-reply-to" @click="del(sub.subId,sub.rootId)" v-if="have(component,'btnCommentDelete',sub.replyId)">删除</span>
        <span>{{ sub.createTime }}</span>
    </template>
    <span slot="content"><a-avatar :src="sub.avatar"></a-avatar> {{sub.replyName}} ：</span>
    <span slot="content" v-if="sub.targetName!=null">回复 {{sub.targetName }} ：</span>
    <span slot="content">  {{ sub.content }}  </span>
    <el-form v-if="showReply2" style="width: 100%;height: 100px;">
            <el-input type="textarea"   :rows="2"  placeholder="请输入内容"   v-model="textarea"> </el-input>
            <el-button type="primary" size="mini" style="float: right;" @click="SubReply(sub.replyId,sub.rootId)" >发表</el-button>
        </el-form>
    </a-comment>    
</div>
</template>
<script>
export default {
    props:["sub"],
    data(){
        return{
            component: this.$store.state.components,
            permission:this.$store.state.permission,
            uid:this.$store.state.user.uid,
            showReply2:false,
            textarea: '',
            pid:this.$route.params.pid,    
            likes:0,
            action :  null
        }
    },
    methods:{
        like() {
            if(this.action == 'liked'){
                this.request.put(`/subComment/unDoLike/${this.sub.subId}/${this.uid}`).then((res) => {
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
                this.request.put(`/subComment/doLike/${this.sub.subId}/${this.uid}`).then((res) => {
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
        del(subId,rootId){
            this.$confirm('确认删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.request.delete(`/subComment/${subId}`).then((res) => {
                    if(res.code===2000){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.reload(rootId)
                    }else {
                        this.$message({
                            type: 'error',
                            message: '删除失败'
                        });
                    }
               
                })
            })
        },
        have(arr,c,replyId){
            for(var key in this.permission) {
             if(this.permission[key] ==='system:post:manage')
             return true
            }
            if(c=='btnCommentDelete')
            return  replyId==this.uid && arr.includes(c)
            else return arr.includes(c)
        },
        SubReply(replyId,rootId){
            let vaild = this.textarea.trim()
            if(vaild==null ||vaild==undefined|| vaild==''){
                this.$message({
                    message: '请输入内容',
                    type: 'warning'
                 });
                 return;
            }
            this.request.post('/subComment',{
                "uid":this.uid,
                "cid":rootId,
                "targetId":replyId,
                "content":this.textarea,
                "pid":this.pid
            }).then((res) => {
                if(res.code===2000){
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    });
                    //this.$router.go(0)
                    this.reload(rootId)
                    this.textarea=''
                    this.showReply2 = false
                }
                if(res.code===5000){
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                }
                
            })
        },
    isLike(){
            let flag = this.sub.isLike
            if(flag ==='1'){
                this.action = 'liked'
            }
            this.likes =  this.sub.likes
        },
    reload(cid){
        this.$emit('getSubComment',cid)
    }
    },
    mounted(){
        this.isLike()
    }
}
</script>

<style>

</style>