<template>
  <el-main>
    <div>
      <el-button type="primary" icon="el-icon-circle-plus-outline" style="margin-left: 5px" @click="dialogFormVisible = true">发帖</el-button>
      <el-button type="danger" icon="el-icon-remove-outline"  :disabled="multipleSelection.length<=0" style="margin-left: 5px" @click="DeleteIds">批量删除</el-button>
      <el-input  placeholder="输入pid查找"   v-model="inputPid"    clearable style="width: 200px;"></el-input>
      <el-button type="primary" icon="el-icon-search"  @click="search">搜索</el-button>
        <el-date-picker
          v-model="value1"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button type="primary"   @click="searchByTime">筛选发布时间</el-button>
        <el-button type="primary"  @click="this.load">刷新</el-button>
    </div>
    <el-table :data="tableData" border  v-loading="loading"
              tooltip-effect="dark"
              @selection-change="handleSelectionChange"
              :row-class-name="tableRowClassName">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column prop="pid" label="pid" width="80" header-align="center" align="center" sortable>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="65" header-align="center" align="center" >
        <template slot-scope="scope">
          <el-tag effect="plain"
            :type="testTag(scope.row.type)"
            disable-transitions>{{scope.row.type}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" >
      </el-table-column>
      <el-table-column prop="content" label="帖子内容" width="300"  header-align="center" >
        <template slot-scope='scope'>
					<el-popover		placement="top-start"			width="500"		trigger="hover">
            <div v-html="scope.row.content" class="rich"></div>
						<div slot="reference" v-html="scope.row.content.substr(0,25)"></div>
					</el-popover>
				</template>
      </el-table-column>
      <el-table-column prop="nickname" label="发帖用户" width="100" header-align="center" >
      </el-table-column>
      <el-table-column prop="uid" label="uid" width="80" align="center" >
      </el-table-column>
      <el-table-column prop="commentNum" label="评论数" width="80" header-align="center" align="center">
      </el-table-column>
      <el-table-column prop="createTime" width="88" label="发布时间" header-align="center" sortable>
      </el-table-column>
      <el-table-column prop="updateTime" width="88" label="最新评论" header-align="center" sortable>
     </el-table-column>
      <el-table-column  label="操作"  width="150" fixed="right"  header-align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="已置顶，点击取消置顶" placement="top">
            <el-button type="danger"  size="mini"  icon="el-icon-top" circle v-if="scope.row.isTop=='1'" @click="changeTop(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="点击置顶" placement="top">
            <el-button type="primary"  size="mini"  icon="el-icon-top" circle v-if="scope.row.isTop=='0'" @click="changeTop(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="打开帖子" placement="top">
            <el-button type="primary"  size="mini" icon="el-icon-link" circle @click="openPost(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除帖子" placement="top">
            <el-button type="danger"  size="mini" :disabled="multipleSelection.length>0" circle icon="el-icon-delete"
               @click="handleDelete(scope.$index, scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0">
      <div class="block">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
    </div>

    <!--发帖-->
    <div style="display: flex;">
        <el-dialog title="发布帖子" :visible.sync="dialogFormVisible" width="60%" :close-on-click-modal="false">
        <el-form :model="form" :labelPosition="labelPosition"  :label-width="formLabelWidth" :rules="rules" ref="form">
          <el-form-item label="标题" prop="title">
            <el-input v-model.trim="form.title" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择" >
              <el-option label="学习" value="学习"></el-option>
              <el-option label="生活" value="生活"></el-option>
              <el-option label="欢乐" value="欢乐"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="内容" prop="content">
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
          <el-button type="primary" @click="addPost()">确 定</el-button>
        </div>
      </el-dialog>
      </div>
  </el-main>
</template>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
export default {
  components:{
        Editor,
        Toolbar
    },
  data() {
    var richContent = (rule, value, callback) => {
      if ( !value|| !value.replaceAll(/<[^>]+>/g,"")) {
        callback(new Error('请输入帖子内容'));
      }
      callback()
    };
    return {
      value1: '',
      inputPid:'',
      loading: true,
      labelPosition: 'right',
      tableData: [],
      pageNum:1,
      pageSize:10,
      total: 0,
      dialogFormVisible:false,
      dialogVisibleComment: false,
      commentDetail:'',
      formLabelWidth: '60px',
      multipleSelection: [],
      form:{},
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
    tableRowClassName({row, rowIndex}) {
        if (row.isTop=='1') {
          return 'danger-row';
        } 
      },
    onCreated(editor) {
            this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
      },
    testTag(tag){
          switch(tag){
            case '欢乐': return ''
            case '生活': return 'warning'
            case '学习': return 'success'
            case '其他': return 'info'
          }
        },
    //获取分页
    load(){
      this.request.get("/post",{params:{
          pageNum: this.pageNum,
          pageSize:this.pageSize
        }}).then((res)=>{
        this.tableData = res.data.post
        //[...res.data.top,...res.data.post]
        this.total = res.data.total
        this.loading = false;
        this.searchjobid = ''
      })
    },
    openPost(row){
      let pid = row.pid
      window.open(`http://localhost:8089/#/post/${pid}`)
    },

    handleSizeChange(pageSize){
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum){
      this.pageNum = pageNum
      this.load()
    },
    addPost(){
      this.$refs['form'].validate((valid)=>{
        if(valid){
          let title = this.form.title
          let type = this.form.type
          let content = this.form.content
          this.dialogFormVisible = false
          this.request.post('/post',{"title":title,"content":content,"type":type}).then((res) => {
            if(res.code===2000){
              this.$message({
                type:'success',
                message:'发帖成功'
              })
              this.load()
            }
          })
        }
      })
    },

    //删除
    handleDelete(index, row) {
      this.$confirm('确认删除？',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.request.delete('/post/'+row.pid).then((res)=>{
          if (res.code=='2000'){
            this.$message({
              message:'删除成功',
              type:"success"
            })
            this.load()
          }
        })
      })
    },
    //批量删除
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    DeleteIds(){
      let ids = this.multipleSelection.map(v => v.pid)
      this.$confirm('确认删除'+this.multipleSelection.length+'条帖子吗？',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.request.post(`/post/del/${ids}`).then((res)=>{
          if (res.code===2000){
            this.$message({
              message:'删除成功',
              type:"success"
            })
            this.load()
          }
        })
      })
    },
    
    //清空对话框表单
    clearDialog(){
      this.dialogFormVisibleAdd = false
      this.formAdd = {}
    },
    resetpwd(index, row){
      this.$confirm('确认重置密码？',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.request.put('/user/reset',row.uid).then((res)=>{
          if (res.code==='200'){
            this.$message({
              message:'重置密码成功',
              type:"success"
            })
            this.load()
          }
        })
      }).catch(()=>{

      })
    },
    changeTop(row){
      let pid = row.pid
      let isTop = row.isTop
      this.request.put('/post/top',{
        "pid":pid,
        "isTop":isTop
      }).then((res) => {
          if(res.code===2000){
            this.load()
          }
        
      })
    },
    search(){
      if(this.inputPid.length<=0){
            this.$message({
              type:'warning',
              message:'pid不能为空'
            })
            return false
          }
      this.request.post(`/post/searchByPid`,{"pid":this.inputPid}).then((res) => {
        this.tableData = res.data
      })
    },
    searchByTime(){
      if(this.value1<=0){
            this.$message({
              type:'warning',
              message:'筛选时间不能为空'
            })
            return false
          }
      this.request.post(`/post/searchByTime?pageNum=${this.pageNum}&pageSize=${this.pageSize}`,{
        "from":this.value1[0],
        "to":this.value1[1]
      }).then((res) => {
        this.tableData = res.data.post
        this.total = res.data.total
      })
    }
  },
  mounted() {
    this.load()
  }
}
</script>

<style scoped>

.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
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