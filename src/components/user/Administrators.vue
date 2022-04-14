<template>
    <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
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
    <el-button class="btn1" @click="addDialogVisible=true">添加管理员</el-button>
    </el-col>
  </el-row>
  <el-table :data="userlist" border stripe>
   <el-table-column label="id" type="index"></el-table-column>
   <el-table-column label="姓名" prop="username"></el-table-column>
   <el-table-column label="注册时间" prop="create_time"></el-table-column>
   <el-table-column label="电话" prop="mobile"></el-table-column>
   <el-table-column label="角色id" prop="rid"></el-table-column>
   <el-table-column label="邮箱" prop="email"></el-table-column>
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
<!--添加用户对话框-->
<el-dialog
  title="添加管理员"
  :visible.sync="addDialogVisible"
  width="50%" @close="addDialogVisibleClosed">
<el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="70px">
  <el-form-item label="姓名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
   <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
   <el-form-item label="电话" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
     <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
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
<!--编辑用户对话框-->
<el-dialog
  title="修改管理员"
  :visible.sync="editDialogVisible"
  width="50%" @close="editDialogVisibleClosed">
<el-form :model="editForm" :rules="editFormrules" ref="editFormRef" label-width="70px">
  <el-form-item label="姓名">
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
    <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email"></el-input>
  </el-form-item>
    <el-form-item label="电话" prop="mobile">
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
</el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisibleoff">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
</el-dialog>
<!--删除用户对话框-->
<el-dialog
  title="删除管理员"
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
      var checkEmail=(rule,value,cb)=>{
        const regEmail=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if(regEmail.test(value)){
          return cb()
        }
        cb(new Error('请输入合法的邮箱'))
      }
      var checkMobile=(rule,value,cb)=>{
        const regMobile=/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if(regMobile.test(value)){
          return cb()
        }
        cb(new Error('请输入合法的手机号'))
      }
      return{
        deleteDialogVisible:false,
        userinfo:{},
        rolelist:[],
        selectedRoleId:'',
        setRightDialogVisible:false,
        editDialogVisible:false,
        addDialogVisible:false,
        input3:'',
        select: '',
        userlist:[],
        addForm:{
          username:'',
          email:'',
          mobile:'',
          rid:50,
          password:''
        },
        addFormrules:{
          username:[{required:true,message:'请输入姓名',trigger:'blur'},{min:3,max:10,message:'用户名的长度在3到10之间',trigger:'blur'}],
          email:[{required:true,message:'请输入邮箱',trigger:'blur'},{validator:checkEmail,trigger:'blur'}],
          mobile:[{required:true,message:'请输入电话号码',trigger:'blur'},{validator:checkMobile,trigger:'blur'}],
          password:[{required:true,message:'请输入密码',trigger:'blur'}],
          rid:[{required:true,message:'请选择用户角色',trigger:'blur'}]
        },
        editForm:{},
        editFormrules:{
          email:[{required:true,message:'请输入邮箱',trigger:'blur'},{validator:checkEmail,trigger:'blur'}],
          mobile:[{required:true,message:'请输入电话号码',trigger:'blur'},{validator:checkMobile,trigger:'blur'}]
        },
        deleteid:''
      }
    },
    created(){
      this.getUserList()
    },
    methods:{
     async getUserList(){
          const{data:res}=await this.$http.get('users/administrators')
                    // console.log(res)
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
      //监听添加用户对话框的关闭事件
      addDialogVisibleClosed(){
        this.$refs.addFormRef.resetFields()
      },
      //取消删除
      deleteDialogVisibleoff(){
         this.deleteDialogVisible=false
         this.$message.info('操作取消')
      },
      //添加用户
      addUser(){
        this.$refs.addFormRef.validate(async valid=>{
          if(!valid) return
          // this.addForm.rid=43
          console.log(this.addForm);
          const{data:res}=await this.$http.post('users',this.addForm)
          console.log(res)
          if(res.meta.status === 403){
            this.$router.push("/welcome")
            return this.$message.error('权限不足，无法访问')
          }else if(res.meta.status!=201){
            this.$message.error("创建用户失败")
          }else{
            this.getUserList()
            this.addDialogVisible=false
              this.$message.success("创建用户成功")
          }
        })
      },
      //展示编辑用户的对话框
      async showEditDialog(id){
        const{data:res}=await this.$http.get("users/findadminbyid?id="+id)
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
      //监听修改用户对话框的关闭事件
      editDialogVisibleClosed(){
        this.$refs.editFormRef.resetFields()
      },
      editUser(){
        this.$refs.editFormRef.validate(async valid=>{
        if(!valid) return
        const{data:res}=await this.$http.put('users/update',this.editForm)
        console.log(res);
        if(res.meta.status === 403){
            this.$router.push("/welcome")
            return this.$message.error('权限不足，无法访问')
        }else if(res.meta.status!=200){
          this.$message.error("修改用户失败")
        }else{
        this.$message.success("修改用户成功")
        this.editDialogVisible=false
        this.getUserList()
        }
        })
      },
      //删除管理员对话框
      deleteDialog(id){
        this.deleteDialogVisible=true
        this.deleteid=id
      },
        //删除用户
      async deleteUser(){
        console.log(this.deleteid)
        const{data:res}=await this.$http.delete("admin/"+this.deleteid)
        console.log(res)
        if(res.meta.status === 403){
            this.$router.push("/welcome")
            return this.$message.error('权限不足，无法访问')
        }else if(res.meta.status!=200){
          this.$message.error("删除用户失败")
        }else{
          this.$message.success("删除用户成功")
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
          const{data:res} =await this.$http.get('users/findCashierById?id='+this.input3)
          console.log(res);
          if(res.meta.status===200){
            this.$message.success('成功')
            //  this.userlist=res.data
            this.userlist=res.data
            console.log(this.userlist)
          }else if(res.meta.status===403){
              return this.$message.error('权限不足')
          }else{
            return this.$message.error('不存在用户')
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