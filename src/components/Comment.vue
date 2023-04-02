<template>
  <div >
    <a-comment>
        <template slot="actions">
            <span >第{{ item.floor}}楼</span>
            <a-icon type="like" :theme="action === 'liked' ? 'filled' : 'outlined'"  @click="like" />
            <span style="padding-left: '8px'; cursor: 'auto'">
                {{ likes }}
            </span>
            <span key="comment-basic-reply-to" v-if="have(component,'btnCommentAdd',item.replyId)&&!showReply"  @click="showReply=true">回复</span>
            <span key="comment-basic-reply-to" v-if="have(component,'btnCommentAdd',item.replyId)&&showReply" @click="showReply=false">收起回复</span>
            <span key="comment-basic-reply-to" @click="del(item.cid)" v-if="have(component,'btnCommentDelete',item.replyId)">删除</span>
            <span  @click="getSubComment(item.cid)" v-if="item.subCommentNum>0&&!showSub">查看{{item.subCommentNum}}条回复</span>
            <span @click="showSub=false" v-if="showSub">收起回复</span>
        </template>
        <a slot="author">{{ item.replyName}}</a>
        <a-avatar slot="avatar"   :src="item.avatar"   />
        <div slot="content" class="antContent" v-html="item.content" > </div>
        <a-tooltip slot="datetime" :title="item.createTime">
            <span>{{item.createTime}}</span>
        </a-tooltip>
        <el-form v-if="showReply" style="width: 100%;height: 100px;">
            <el-form-item >
                <el-input type="textarea"   :rows="2"  placeholder="请输入内容"   v-model="textarea" > </el-input>
            </el-form-item>
            <el-button type="primary" size="mini" style="float: right;" @click="reply(item.cid)" >发表</el-button>
        </el-form>
        <div v-if="showSub">
            <subComment v-for="sub in subComments" :key="sub.subId" :sub="sub" @getSubComment="getSubComment"/>
            <el-pagination small  
             layout="prev, pager, next" 
            :total="total" v-if="total>3"
            :current-page="pageNum"
            :page-size="pageSize"
            @current-change="handleCurrentChange"
            >
         </el-pagination>
        </div>
    </a-comment>
    <a-divider />
  </div>
  
</template>

<script>
import SubComment from './SubComment.vue'

export default {
  components: { SubComment },
    props:["item"],

    data(){
        return{
            likes: 0,
            textarea: '',
            showSub:false,
            showReply:false,
            title:'',
            component: this.$store.state.components,
            permission:this.$store.state.permission,
            uid:this.$store.state.user.uid,
            pageNum:1,
            pageSize:3,
            total: 0,
            pid:this.$route.params.pid,
            subComments:{},
            action: null,
        }
    },
    methods:{
        like() {
            if(this.action == 'liked'){
                this.request.put(`/comment/unDoLike/${this.item.cid}/${this.uid}`).then((res) => {
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
                this.request.put(`/comment/doLike/${this.item.cid}/${this.uid}`).then((res) => {
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
        getSubComment(cid){
            this.request.get(`/subComment/${cid}`,{params:{
                pageNum:this.pageNum,
                pageSize:this.pageSize
            }}).then((res) => {
                this.subComments = res.data.subComment
                this.total = res.data.total
            })
            this.showSub = true
        },
        reply(cid){
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
                "cid":cid,
                "content":this.textarea,
                "pid":this.pid
            }).then((res) => {
                if(res.code===2000){
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    });
                    this.getSubComment(cid)
                    this.textarea=''
                    this.showReply = false
                }
                if(res.code===5000){
                    this.$message({
                        message: res.msg,
                        type: 'error'
                    });
                }
               
            })
        },
        del(cid){
            this.$confirm('确认删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.request.delete(`/comment/${cid}`).then((res) => {
                    if(res.code===2000){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.$emit('load')
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
        handleCurrentChange(pageNum){
            this.pageNum = pageNum
            this.getSubComment(this.item.cid)
        },
        isLike(){
            let flag = this.item.isLike
            if(flag ==='1'){
                this.action = 'liked'
            }
            this.likes =  this.item.likes
        }
    },
    mounted(){
        this.isLike()
        
    },
}
</script>
<style scoped>
.antContent >>>img{
    width: 80%;
    height: 80%;
}
  
</style>
