<template>
    <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>会员卡</el-breadcrumb-item>
  <el-breadcrumb-item>会员卡列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card>

  <el-row :gutter="20">
  <el-col :span="7"> 
   <el-input placeholder="请输入内容" v-model="input3" clearable @clear="getUserList">
      <el-select v-model="select" slot="prepend" placeholder="请选择">
        <!-- <el-option label="姓名" value="1"></el-option> -->
        <el-option label="id" value="2"></el-option>
      </el-select>
      <el-button slot="append" icon="el-icon-search" @click="finById"></el-button>
    </el-input>
  </el-col>
    <el-col :span="4">
    <el-button class="btn1" @click="addDialogVisible=true">添加会员卡</el-button>
    </el-col>
  </el-row>
  <el-table :data="userlist" border stripe>
   <el-table-column label="id" type="index"></el-table-column>
   <el-table-column label="会员卡id" prop="id"></el-table-column>
   <el-table-column label="用户id" prop="manager_id"></el-table-column>
   <el-table-column label="注册时间" prop="create_time"></el-table-column>
   <el-table-column label="会员积分" prop="point"></el-table-column>
   <el-table-column label="操作" width="300px">
   <template slot-scope="scope">
   <!--修改按钮-->
   <el-button class="fa fa-plus-square-o add" @click="showEditDialog(scope.row.id)">修改</el-button>
      <!--删除按钮-->
   <el-button class="fa fa-trash-o fa-fw delete" @click="deleteDialog(scope.row.id)">删除</el-button>
   </template>
   </el-table-column>
  </el-table>
</el-card>
<!--添加会员卡对话框-->
<el-dialog
  title="添加会员卡"
  :visible.sync="addDialogVisible"
  width="50%" @close="addDialogVisibleClosed">
<el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="90px">
  <el-form-item label="用户id" prop="manager_id">
    <el-input v-model="addForm.manager_id"></el-input>
  </el-form-item>
   <el-form-item label="会员积分" prop="point">
    <el-input v-model="addForm.point"></el-input>
  </el-form-item>
    <!-- <el-form-item label="注册时间" prop="create_time">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item> -->
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisibleoff">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>
<!--编辑会员卡对话框-->
<el-dialog
  title="修改会员卡"
  :visible.sync="editDialogVisible"
  width="50%" @close="editDialogVisibleClosed">
<el-form :model="editForm" :rules="editFormrules" ref="editFormRef" label-width="80px">
  <el-form-item label="会员卡id">
    <el-input v-model="editForm.manager_id" disabled></el-input>
  </el-form-item>
    <el-form-item label="会员积分" prop="point">
    <el-input v-model="editForm.point"></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisibleoff">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
</el-dialog>
<!--删除会员卡对话框-->
<el-dialog
  title="删除会员卡"
  :visible.sync="deleteDialogVisible"
  width="50%">
  <span>您确定要删除吗？</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="deleteDialogVisibleoff">取 消</el-button>
    <el-button type="primary" @click="deleteUser">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
    data(){
      return{
        deleteDialogVisible:false,
        userinfo:{},
        rolelist:[],
        selectedRoleId:'',
        editDialogVisible:false,
        addDialogVisible:false,
        input3:'',
        select: '',
        userlist:[],
        addForm:{
        manager_id:'',
        point:''
        },
        addFormrules:{
          manager_id:[{required:true,message:'请输入会员卡id',trigger:'blur'},{min:3,max:10,message:'用户名的长度在3到10之间',trigger:'blur'}],
          point:[{required:true,message:'请输入会员积分',trigger:'blur'}]
        },
        editForm:{},
        editFormrules:{
          manager_id:[{required:true,message:'请输入会员卡id',trigger:'blur'},{min:3,max:10,message:'用户名的长度在3到10之间',trigger:'blur'}],
          point:[{required:true,message:'请输入会员积分',trigger:'blur'}]
        },
        deleteid:''
      }
    },
    created(){
      this.getUserList()
    },
    methods:{
     async getUserList(){
          const{data:res}=await this.$http.get('membershipcard/list')
                    console.log(res)
          if(res.meta.status === 403){
              this.$router.push("/welcome")
              return this.$message.error('权限不足，无法访问')
          }
          else if(res.meta.status !== 200){
            return this.$message.error('获取失败')
          }
          this.userlist=res.data
      },
      //取消添加
      addDialogVisibleoff(){
        this.addDialogVisible=false
        this.$message.info('操作取消')
      },
      async userState(userinfo){
        //console.log(userinfo.mg_state)
        const{data:res}=await this.$http.put('users/'+userinfo.id,userinfo)
        // console.log(res)
      },
      //监听添加会员卡对话框的关闭事件
      addDialogVisibleClosed(){
        this.$refs.addFormRef.resetFields()
      },
      //取消删除
      deleteDialogVisibleoff(){
         this.deleteDialogVisible=false
         this.$message.info('操作取消')
      },
      //添加会员卡
      addUser(){
        this.$refs.addFormRef.validate(async valid=>{
          if(!valid) return
          // this.addForm.rid=43
          console.log(this.addForm);
          const{data:res}=await this.$http.post('membershipcard/add',this.addForm)
          console.log(res)
          if(res.meta.status === 403){
            this.$router.push("/welcome")
            return this.$message.error('权限不足，无法访问')
          }else if(res.meta.status!=200){
            this.$message.error("创建会员卡失败")
          }else{
            this.getUserList()
            this.addDialogVisible=false
              this.$message.success("创建会员卡成功")
          }
        })
      },
      //展示编辑会员卡的对话框
      async showEditDialog(id){
        const{data:res}=await this.$http.get("membershipcard/findbyid?id="+id)
        console.log(res);
        if(res.meta.status === 403){
            this.$router.push("/welcome")
            return this.$message.error('权限不足，无法访问')
        }else if(res.meta.status!=200){
          this.editDialogVisible=true
          this.$message.error("查询失败")
        }else{
          this.editDialogVisible=true
          this.editForm=res.data[0]
          this.$message.success("查询成功")
          // console.log(this.editForm.id)
        }
      },
      //取消修改操作
      editDialogVisibleoff(){
        this.editDialogVisible=false
        this.$message.info('操作取消')
      },
      //监听修改会员卡对话框的关闭事件
      editDialogVisibleClosed(){
        this.$refs.editFormRef.resetFields()
      },
      async editUser(){
        this.$refs.editFormRef.validate(async valid=>{
          if(!valid) return
          const{data:res}=await this.$http.post('membershipcard/update',this.editForm)
          console.log(res);
          if(res.meta.status === 403){
              this.$router.push("/welcome")
              return this.$message.error('权限不足，无法访问')
          }else if(res.meta.status!=200){
            this.$message.error("修改会员卡失败")
          }else{
          this.$message.success("修改会员卡成功")
          this.editDialogVisible=false
          this.getUserList()
          }
        })
      },
      //删除会员卡对话框
      deleteDialog(id){
        this.deleteDialogVisible=true
        this.deleteid=id
      },
      //删除会员卡
      async deleteUser(){
        console.log(this.deleteid)
        const{data:res}=await this.$http.delete("membershipcard/delete/"+this.deleteid)
        console.log(res)
        if(res.meta.status === 403){
            this.$router.push("/welcome")
            return this.$message.error('权限不足，无法访问')
        }else if(res.meta.status!=200){
          this.$message.error("删除会员卡失败")
        }else{
          this.$message.success("删除会员卡成功")
          this.deleteDialogVisible=false
          this.getUserList()
        }
      },
      //根据id查询
      async finById(){
        if(this.input3==""||this.select==""){
          this.getUserList()
        }
        if(this.input3!=""&&this.select=='2'){
          const{data:res} =await this.$http.get('membershipcard/findbyid?id='+this.input3)
          console.log(res);
          if(res.meta.status===200){
            this.$message.success('成功')
            //  this.userlist=res.data
            this.userlist=res.data
            console.log(this.userlist)

          }else if(res.meta.status===403){
              return this.$message.error('权限不足')
          }else{
            return this.$message.error('不存在会员卡')
          }
        }
      }
    }
}
</script>
<style lang="less" scoped>
.el-breadcrumb{
    margin-bottom: 15px;
    font-size: 12px;
}
.el-card{
    box-shadow: 0 1px 1px rgba(0, 0,0, 0.15) !important;
}
.btn1{
    background-color: rgb(240, 240, 68);
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.add{
  background-color: pink;
}
.delete{
  background-color: rgb(247, 105, 105);
  width: 100px;
}
.edit{
  background-color: rgb(245, 245, 180);
}
.el-select{
  width: 110px;
}
</style>