<template>
  <div style="display: block; ">
      <div style="display: block;float: left;position: relative;">
        <img src="@/assets/logo.png"  alt=""/>
      </div>
      <div style="float: right;">
        <el-button type="primary" @click="dialogFormVisible = true">发帖</el-button>
      </div>
      <div style="display: flex;">
        <el-dialog title="发布帖子" :visible.sync="dialogFormVisible" width="60%">
        <el-form :model="form">
          <el-form-item label="标题" :label-width="formLabelWidth">
            <el-input v-model="form.title" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="form.type" placeholder="请选择" :label-width="formLabelWidth">
              <el-option label="学习" value="学习"></el-option>
              <el-option label="生活" value="生活"></el-option>
              <el-option label="欢乐" value="欢乐"></el-option>
            </el-select>
            </el-form-item>
          <el-form-item label="内容" :label-width="formLabelWidth">
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
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addPost()">确 定</el-button>
        </div>
      </el-dialog>
      </div>
      <el-table :data="topTableData"  stripe v-loading="loading" v-if="(topTableData.length>0)" 
              tooltip-effect="dark">
          <el-table-column prop="type"  width="65">
          <template slot-scope="scope">
          <el-tag effect="plain"
            :type="testTag(scope.row.type)"
            disable-transitions>{{scope.row.type}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="title"  >
          <template slot-scope="scope" >
            <el-link :href="`#/post/${scope.row.pid}`"  @click="test(scope.$index, scope.row)"  :underline="false">{{scope.row.title}}</el-link>
          </template>
      </el-table-column>
      <el-table-column prop="pid" v-if="false">
      </el-table-column>
      <el-table-column prop="nickname"  label="发帖人" width="150">
      </el-table-column>
      <el-table-column prop="commentNum"  label="评论数" width="150">
      </el-table-column>   
      <el-table-column prop="createTime"  label="发帖时间" width="150">
      </el-table-column>
      <el-table-column prop="updateTime"  label="最后回复" width="150">
      </el-table-column>
    </el-table>
    <el-table :data="tableData"  stripe v-loading="loading"
              tooltip-effect="dark"
              >
              <!-- //@selection-change="handleSelectionChange" -->
      <el-table-column prop="type"  width="65">
          <template slot-scope="scope">
          <el-tag effect="plain"
            :type="testTag(scope.row.type)"
            disable-transitions>{{scope.row.type}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="title"  >
          <template slot-scope="scope" >
            <el-link :href="`#/post/${scope.row.pid}`"  @click="test(scope.$index, scope.row)"  :underline="false">{{scope.row.title}}</el-link>
            <!-- target="_blank"  -->
          </template>
      </el-table-column>
      <el-table-column prop="pid" v-if="false">
      </el-table-column>
      <el-table-column prop="nickname"  width="150">
      </el-table-column>
      <el-table-column prop="commentNum" width="150">
      </el-table-column>      
      <el-table-column prop="createTime"  width="150">
      </el-table-column>
      <el-table-column prop="updateTime" width="150">
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
        return{
            loading:false,
            tableData: [],
            topTableData:[],
            pageNum:1,
            pageSize:10,
            total: 0,
            dialogFormVisible:false,
            formLabelWidth: '50px',
            form:{},
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
                        maxFileSize: 10 * 1024 * 1024
                    }   
                }
            },
            mode: 'default' // or 'simple'
        }
    },
    methods:{
        test(index, row) {
            console.log(row)
            // this.$router.push({path:`/post/${row.pid}`})
        },
        testTag(tag){
          switch(tag){
            case '欢乐': return ''
            case '生活': return 'info'
            case '学习': return 'success'
          }
        },
        addPost(){
          let title = this.form.title
          let type = this.form.type
          let content = this.html
          this.dialogFormVisible = false
          this.request.post('/post',{"title":title,"content":content,"type":type}).then((res) => {
            console.log(res.data)
          }).catch((err) => {
            
          });
        },
        handleSizeChange(pageSize){
        this.pageSize = pageSize
          this.load
        },
        handleCurrentChange(pageNum){
          this.pageNum = pageNum
          this.load()
        },
        load(){
          this.request.get(`/post?pageNum=${this.pageNum}&pageSize=${this.pageSize}`).then((res) => {
            this.tableData = res.data.post
            this.total = res.data.total
            this.topTableData = res.data.top
        }).catch((err) => {
            
        });
        },
        onCreated(editor) {
            this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
        },
    },
    mounted(){
      this.load()
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
    color: #000;
}
</style>