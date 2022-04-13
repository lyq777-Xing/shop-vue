<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
</el-breadcrumb>
<!--卡片试图-->
<el-card>
<el-row>
<el-col>
<el-button type="warning" round icon="el-icon-user-solid" @click="addDialogVisible=true">添加角色</el-button>
</el-col>
</el-row>
<!--角色列表-->
<el-table :data="rolelist" border stripe>
<el-table-column type="expand">
  <template slot-scope="scope">
  <el-row :class="['bdbottom',i1===0 ?'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
  <!--一级-->
  <el-col :span="5">
  <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
  <i class="el-icon-caret-right"></i>
  </el-col>
  <!--二级三级-->
  <el-col :span="19">
  <el-row :class="[i2===0 ? '':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
  <el-col :span="6">
  <el-tag closable @close="removeRightById(scope.row,item2.id)" type="success">{{item2.authName}}</el-tag>
  <i class="el-icon-caret-right"></i>
  </el-col>
  <el-col :span="18">
  <el-tag closable @close="removeRightById(scope.row,item3.id)" type="warning" v-for="(item3,i3) in item2.children" :key="item3.id">
  {{item3.authName}}
  </el-tag>
  </el-col>
  </el-row>
  </el-col>
  </el-row>
  </template>
</el-table-column>
<el-table-column type="index" label="id"></el-table-column>
<el-table-column label="角色名称" prop="roleName"></el-table-column>
<el-table-column label="角色描述" prop="roleDesc"></el-table-column>
<el-table-column label="操作" width="300px">
  <template slot-scope="scope">
  <el-button type="primary" icon="el-icon-edit" size="mini" @click="editByid(scope.row.id)">编辑</el-button>
  <el-button type="danger" icon="el-icon-delete" size="mini" @click="deletebyid(scope.row.id)">删除</el-button>
  <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDilog(scope.row)">分配权限</el-button>
  </template>
</el-table-column>
</el-table>
</el-card>
<!--添加角色对话框-->
<el-dialog
  title="添加角色"
  :visible.sync="addDialogVisible"
  width="50%" @close="addDialogVisibleClosed">
  <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="80px" class="demo-ruleForm">
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="addForm.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述" prop="roleDesc">
    <el-input v-model="addForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisibleoff">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
</el-dialog>
<!--修改角色对话框-->
<el-dialog
  title="修改角色"
  :visible.sync="editDialogVisible"
  width="50%" @close="editDialogVisibleClosed">
 <el-form :model="editForm" :rules="editFormrules" ref="editFormRef" label-width="80px" class="demo-ruleForm">
  <el-form-item label="角色id">
    <el-input v-model="editForm.id" disabled></el-input>
  </el-form-item>
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="editForm.roleName"></el-input>
  </el-form-item>
  <el-form-item label="角色描述">
    <el-input v-model="editForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisibleoff">取 消</el-button>
    <el-button type="primary" @click="editRole">确 定</el-button>
  </span>
</el-dialog>
<!--删除角色对话框-->
<el-dialog
  title="删除角色"
  :visible.sync="deleteDialogVisible"
  width="50%">
  <span>确定哟删除吗？</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="deleteDialogVisibleoff">取 消</el-button>
    <el-button type="primary" @click="deleteRole">确 定</el-button>
  </span>
</el-dialog>
<!--分配权限对话框-->
<el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisible"
  width="50%" @close="setRightClosed">
  <el-tree :data="rightlist" :props="treeProps" show-checkbox
  node-key="id" default-expand-all :default-checked-keys="defkeys" ref="treeRef"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisibleoff">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
    data(){
return{
    rolelist:[],
    roleid:'',
    rightlist:[],
    defkeys:[],
    treeProps:{
label:'authName',
children:'children'
    },
    editForm:{},
    setRightDialogVisible:false,
    deleteid:'',
    deleteDialogVisible:false,
    editFormrules:{ roleName:[{required:true,message:'请输入角色名称',trigger:'blur'},{min:3,max:6,message:'请输入3到6位的角色名',trigger:'blur'}]},
    addDialogVisible:false,
    editDialogVisible:false,
    addForm:{
roleName:'',
roleDesc:''

    },
    addFormrules:{
        roleName:[{required:true,message:'请输入角色名称',trigger:'blur'},{min:3,max:6,message:'请输入3到6位的角色名',trigger:'blur'}],
        roleDesc:[{required:true,message:'请输入角色描述',trigger:'blur'},{min:3,max:6,message:'请输入3到6位的角色描述',trigger:'blur'}]
    },
    idStr:''
}

    },
    created(){
        this.getRolesList()
    },
    methods:{
       async getRolesList(){
            const{data:res}=await this.$http.get('roles')
            if(res.meta.status === 403){
                this.$router.push("/welcome")
                return this.$message.error('权限不足，无法访问')
            }
            else if(res.meta.status!=200){
                return this.$message.error('获取角色列表失败！')
            }
            this.rolelist=res.data
          console.log(this.rolelist);
        },
        //根据id删除对应权限
        async removeRightById(role,rightid){
     const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
if(confirmResult!=='confirm'){
return this.$message.info('取消了删除！')

}
const{data:res}= await this.$http.delete('roles/'+role.id+'/rights/'+rightid)
if(res.meta.status === 403){
    return this.$message.error('权限不足，无法访问')
}
else if(res.meta.status!==200){
    return this.$message.error('删除权限失败')
}
console.log(res)
role.children=res.data
        },
        //关闭添加角色对话框
    addDialogVisibleClosed(){
      this.$refs.addFormRef.resetFields()
    },
    //取消添加操作
    addDialogVisibleoff(){
      this.$message.info('操作取消')
      this.addDialogVisible=false
    },
    //添加角色
    async addRole(){
this.$refs.addFormRef.validate(async valid=>{
if(!valid) return
const{data:res}= await this.$http.post('roles',this.addForm)
if(res.meta.status === 403){
    this.$router.push("/welcome")
    return this.$message.error('权限不足，无法访问')
}
else if(res.meta.status!=201){
  this.$message.error("创建用户失败")
}else{
  this.getRolesList()
  this.addDialogVisible=false
    this.$message.success("创建用户成功")
}
})

    },
    //编辑id查询
   async editByid(id){
const{data:res}= await this.$http.get('roles/'+id)
this.editForm=res.data
this.editDialogVisible=true
    },
       //关闭编辑角色对话框
    editDialogVisibleClosed(){
 this.$refs.editFormRef.resetFields()
    },
    //取消编辑操作
    editDialogVisibleoff(){
             this.$message.info('操作取消')
             this.editDialogVisible=false
    },
    //编辑角色
    editRole(){
this.$refs.editFormRef.validate(async valid=>{
if(!valid) return
const{data:res}= await this.$http.put('roles/'+this.editForm.id,this.editForm)
if(res.meta.status === 403){
    this.$router.push("/welcome")
    return this.$message.error('权限不足，无法访问')
}
else if(res.meta.status!=200){
  this.$message.error("修改用户失败")
}else{
  this.getRolesList()
  this.editDialogVisible=false
    this.$message.success("修改用户成功")
}
})

    },
    //取消删除操作
    deleteDialogVisibleoff(){
        this.deleteDialogVisible=false
        this.$message.info('操作取消')
    },
//删除角色通过id查询
    async deletebyid(id){
this.deleteDialogVisible=true
this.deleteid=id
    },
    //删除角色
   async deleteRole(){
const{data:res}= await this.$http.delete('roles/'+this.deleteid)
if(res.meta.status === 403){
  this.$router.push("/welcome")
    return this.$message.error('权限不足，无法访问')
}
else if(res.meta.status!=200){
    this.$message.error("删除用户失败")
}else{
  this.getRolesList()
  this.deleteDialogVisible=false
    this.$message.success("删除用户成功")
}
    },
    //取消分配权限操作
    setRightDialogVisibleoff(){
       this.setRightDialogVisible=false
       this.$message.info('操作取消')
    },
//展示分配权限对话框
   async showSetRightDilog(role){
     this.roleid=role.id
      const{data:res}= await this.$http.get('rights/tree') 
if(res.meta.status === 403){
  this.$router.push("/welcome")
    return this.$message.error('权限不足，无法访问')
}
else if(res.meta.status!=200){
    return this.$message.error('获取权限数据失败！')
}
console.log(res);
this.rightlist=res.data
this.getLefKeys(role,this.defkeys)
this.setRightDialogVisible=true
    },
    getLefKeys(node,arr){
if(!node.children){
return arr.push(node.id)
}
node.children.forEach(item=>this.getLefKeys(item,arr))
    },
//监听关闭分配权限对话框
    setRightClosed(){

this.defkeys=[]
    },
    //点击为角色分配权限
   async allotRights(){

    const keys=[
      this.$refs.treeRef.getCheckedKeys(),
      this.$refs.treeRef.getHalfCheckedKeys()
    ]
    this.idStr = keys.join(',')
    console.log(this.idStr);
    const{data:res}=await this.$http.post('roles/'+this.roleid+'/rights',{rids:this.idStr})
    if(res.meta.status === 403){
      this.$router.push("/welcome")
        return this.$message.error('权限不足，无法访问')
    }
    else if(res.meta.status!=200){
    this.$message.error("更新权限失败")
    }else{
    this.$message.success("更新权限成功")
    this.getRolesList()
    this.setRightDialogVisible=false

    }
    }
}
    }
</script>
<style lang="less" scoped>
.el-breadcrumb{
    margin-bottom: 15px;
    color: palevioletred;
    font-size: 12px;
}
.el-table{
    margin-top: 15px;
}
.el-tag{

    margin: 7px;
}
.bdtop{
    border-top: 1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
.vcenter{

display: flex;
align-items: center;
}
</style>