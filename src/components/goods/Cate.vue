<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 为表格占位 -->
            <!-- show-row-hover 鼠标移动到行上时，是否展示高亮 -->
            <tree-table
            class="treeTable"
            :data="catelist"
            :columns="columns"
            :selection-type="false"
            :expand-type="false"
            :show-index="true"
            index-text="#"
            :border="true"
            >
            <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen;"></i>
                    <i class="el-icon-error" v-else style="color:red;"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
                    <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag size="mini" type="warning" v-else>三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showUpdateDialog(scope.row)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>

            <!-- 为分页区域占位 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[3, 5, 10, 15]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加分类的对话框 -->
        <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="30%" 
        @close="addDialogClosed">
            <el-form :model="addCateRuleForm" :rules="addCateRuleFormRules" ref="addCateRuleFormRef" label-width="100px">
                <el-form-item label="分类名称:" prop="cat_name">
                    <el-input v-model="addCateRuleForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类:">
                    <el-cascader
                        clearable
                        :change-on-select="true"
                        separator="/"
                        v-model="selectKeys"
                        expandTrigger = "hover"
                        :options="parentCateList"
                        :props="cascaderProps"
                        @change="ParentCateChange">
                    </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogClose">取消</el-button>
                <el-button @click="addCate" type="primary">确定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑分类的对话框 -->
        <el-dialog
        title="编辑分类"
        :visible.sync="updateDialogVisible"
        width="30%"
        @close="updateDialogClosed">
        <el-form :model="UpdateRuleForm" :rules="UpdateRules" ref="UpdateRuleFormRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="分类ID" prop="cat_id" >
                <el-input v-model="UpdateRuleForm.cat_id" disabled></el-input>
            </el-form-item>
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="UpdateRuleForm.cat_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="updateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateCate">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
         return{
            //  分页数据
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            //  商品分类的数据列表，默认为空
             catelist:[],
            //  总数据条数
             total:0,
            //  为table指定列定义
             columns:[{
                 label:'分类名称',
                 prop:'cat_name'
             },{
                 label:'是否有效',
                //  prop:'cat_deleted',
                //  表示当前列定义为模板
                 type:'template',
                //  表示当前一列使用的模板名称
                 template:'isok'
             },{
                 label:'排序',
                 type:'template',
                 template:'order'
             },{
                 label:'操作',
                 type:'template',
                 template:'opt'
             }],
             addCateDialogVisible:false,
             addCateRuleForm:{
                 cat_name:'',
                 cat_pid:0,
                 cat_level:0
             },
             addCateRuleFormRules:{
                 cat_name:[
                     {required:true,message:'请输入分类名称',trigger:'blur'}
                 ]
             },
             parentCateList:[],
             cascaderProps:{
                 value:'cat_id',
                 label:'cat_name',
                 children:'children'
             },
             selectKeys:[],
             updateDialogVisible:false,
             UpdateRuleForm:{
                 cat_id:'',
                 cat_name:''
             },
             UpdateRules:{
                 cat_name:[
                     {required:true,message:'请输入分类名称',trigger:'blur'}
                 ]
             }
         }
    },
    created(){
        this.getCateList()
    },
    methods:{
        // 获取商品分类数据
        async getCateList(){
           const {data :res} =await this.$http.get('categories',{params:this.queryInfo})
            if(res.meta.status === 403){
                this.$router.push("/welcome")
                return this.$message.error('权限不足，无法访问')
            }
            else if(res.meta.status != 200){
               return this.$message.error('获取商品分类失败！')
           }
           console.log(res.data);
           this.catelist = res.data.records;
           this.total = res.data.total;
        },
        // 监听pagesize改变的事件
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getCateList();
        },
        // 监听pagenum改变的事件
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getCateList();
        },
        // 展示添加分类的对话框
        showAddCateDialog(){
            // 先获取父级分类列表，在打开表格
            this.getParentCateList();
            this.addCateDialogVisible=true;
        },
        // 获取父级分类的数据列表
        async getParentCateList(){
            const {data:res} = await this.$http.get('categories',{params:{type:2}});
            console.log(res);
            if(res.meta.status === 403){
                this.$router.push("/welcome")
                return this.$message.error('权限不足，无法访问')
            }
            else if(res.meta.status !== 200){
                return this.$message.error('获取数据失败');
            }
            console.log(res.data);
            this.parentCateList = res.data;
        },
        ParentCateChange(){
            console.log(this.selectKeys);
            if(this.selectKeys.length > 0){
                this.addCateRuleForm.cat_pid=this.selectKeys[this.selectKeys.length-1];
                this.addCateRuleForm.cat_level = this.selectKeys.length;
            }else{
                this.addCateRuleForm.cat_pid=0;
                this.addCateRuleForm.cat_level=0;
            }
        },
        addCate(){
            console.log(this.addCateRuleForm);
            this.$refs.addCateRuleFormRef.validate(async valid => {
                if(!valid)return
                const {data:res} = await this.$http.post('categories',this.addCateRuleForm)
                if(res.meta.status === 403){
                    this.$router.push("/welcome")
                    return this.$message.error('权限不足，无法访问')
                }
                else if(res.meta.status !== 201){
                    return this.$message.error("添加分类失败")
                }else{
                    this.$message.success("添加分类成功")
                    this.getCateList();
                    this.addCateDialogVisible=false;
                }
            })
        },
        addCateDialogClose(){
            this.$refs.addCateRuleFormRef.resetFieds();
            this.selectKeys = [];
            this.addCateRuleForm.cat_pid=0;
            this.addCateRuleForm.cat_level=0;
        },
        async showUpdateDialog(row){
            const {data:res} = await this.$http.get(`categories/${row.cat_id}`)
            if(res.meta.status === 403){
                this.$router.push("/welcome")
                return this.$message.error('权限不足，无法访问')
            }
            else if(res.meta.status !== 200){
                return this.$message.error('获取分类信息失败')
            }
            this.updateDialogVisible = true
            this.UpdateRuleForm = res.data
        },
        async updateCate(){
            const {data:res} = await this.$http.put(`categories/${this.UpdateRuleForm.cat_id}`,{cat_name:this.UpdateRuleForm.cat_name})
            if(res.meta.status === 403){
                this.$router.push("/welcome")
                return this.$message.error('权限不足，无法访问')
            }
            else if(res.meta.status === 400){
                this.$message.error('该用户名已存在，请重新输入')
            }
            else if(res.meta.status === 200){
                this.$message.success('修改分类名称成功')
                this.getCateList();
                this.updateDialogVisible = false
            }else{
                this.$message.error('修改分类名称失败')
            }
        },
        async removeCate(id){
            const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch(err=>err)

                if(confirmResult !== 'confirm'){
                    return this.$message.info('已取消')
                }
                const {data:res} = await this.$http.delete(`categories/${id}`)
                if(res.meta.status === 403){
                    return this.$message.error('权限不足，无法访问')
                }
                else if(res.meta.status !== 204){
                    return this.$message.error('删除成功')
                }

                this.$message.success('删除成功')
                this.getCateList()
        },
        // 清除表单信息
        addDialogClosed(){
            this.$refs.addCateRuleFormRef.resetFields()
        },
        updateDialogClosed(){
            this.$refs.UpdateRuleFormRef.resetFields()
        }
    }
}
</script>

<style lang="less" scoped>
    .el-card{
        margin-top: 15px;
    }
    .treeTable{
        margin-top: 15px;
    }
    .el-cascader{
        width: 100%;
    }
</style>