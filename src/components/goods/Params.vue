<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 警告区域 -->
            <el-alert
                title="注意：只允许为第三级分类设置相关参数！"
                type="warning"
                :closable="false"
                show-icon>
            </el-alert>
            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span class="opt">选择商品分类:</span>
                    <!-- 选择商品分类的级联选择框 -->
                      <el-cascader
                        v-model="selectCateKeys"
                        :options="catelist"
                        expandTrigger= "hover"
                        :props="cateProps"
                        @change="handleChange">
                    </el-cascader>
                </el-col>
            </el-row>
            <!-- 标签页区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <!-- 添加参数按钮 -->
                    <el-button @click="addDialogVisible=true" type="primary" size="mini" :disabled="isBtnDisable">添加参数</el-button>
                    <el-table :data="manyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- <el-tag :key="i" v-for="(item, i)in scope.row.attr_vals" >{{item}}</el-tag> -->
                                <el-tag @close="handleClose(i,scope.row)" v-for="(item,i) in scope.row.attr_vals" :key="i" closable>{{item}}</el-tag>
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <!-- slot-scope="scope" -->
                                <el-button @click="showEditDialog(scope.row.attr_id)" size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                                <el-button @click="removeParams(scope.row.attr_id)" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 添加静态属性的面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <!-- 添加属性按钮 -->
                    <el-button @click="addDialogVisible=true" type="primary" size="mini" :disabled="isBtnDisable">添加属性</el-button>
                    <el-table :data="onlyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- <el-tag :key="i" v-for="(item, i)in scope.row.attr_vals" >{{item}}</el-tag> -->
                                <el-tag @close="handleClose(i,scope.row)" v-for="(item,i) in scope.row.attr_vals" :key="i" closable>{{item}}</el-tag>
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <!-- slot-scope="scope" -->
                                <el-button @click="showEditDialog(scope.row.attr_id)" size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                                <el-button @click="removeParams(scope.row.attr_id)" size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

            <!-- 添加参数对话框 -->
            <el-dialog
                :title="'添加' + titleText"
                :visible.sync="addDialogVisible"
                width="30%"
                @close="addDialogClosed">
                <el-form :model="addRuleForm" :rules="addRules" ref="addFormRef" label-width="100px">
                    <el-form-item :label="titleText" prop="attr_name">
                        <el-input v-model="addRuleForm.attr_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addParams">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 修改参数对话框 -->
            <el-dialog
                :title="'修改' + titleText"
                :visible.sync="editDialogVisible"
                width="30%"
                @close="editDialogClosed">
                <el-form :model="editRuleForm" :rules="editRules" ref="editFormRef" label-width="100px">
                    <el-form-item :label="titleText" prop="attr_name">
                        <el-input v-model="editRuleForm.attr_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editParams">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return{
            catelist:[],
            // 级联选择框的配置对象
            cateProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            // 级联选择框双向绑定到的数组
            selectCateKeys:[],
            // 被激活的标签页名称
            activeName:'many',
            // 动态参数数据
            manyTableData:[],
            // 静态属性数据
            onlyTableData:[],
            addDialogVisible:false,
            addRuleForm:{
                attr_name:''
            },
            addRules:{
                attr_name:[{
                    required: true, message: '请输入参数名称', trigger: 'blur'
                }]
            },
            editDialogVisible:false,
            editRuleForm:{},
            editRules:{
                attr_name:[{
                    required: true, message: '请输入参数名称', trigger: 'blur'
                }]
            },
        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        async getCateList(){
            const {data:res} = await this.$http.get('categories')
            if(res.meta.status === 403){
                this.$router.push("/welcome")
                return this.$message.error('权限不足，无法访问')
            }
            else if(res.meta.status !== 200){
                return this.$message.error('获取商品分类失败')
            }
            this.catelist = res.data
            console.log(this.catelist);
        },
        // 级联选择框选项变化处罚
        handleChange(){
            this.getParamsData();
        },
        // tab标签页点击事件
        handleTabClick(){
            console.log(this.activeName);
            this.getParamsData();
        },
        async getParamsData(){
            // 证明选中的不是三级分类
            if(this.selectCateKeys.length !== 3){
                this.selectCateKeys = [];
                this.manyTableData = [];
                this.onlyTableData = [];
                return
            }
            // 证明选中的是三级分类
            console.log(this.selectCateKeys);
            // 根据所选分类的id和当前所处的面板获取对应参数
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
            if(res.meta.status === 403){
                this.$router.push("/welcome")
                return this.$message.error('权限不足，无法访问')
            }
            else if(res.meta.status !== 200){
                return this.$message.error('获取参数失败')
            }
            // console.log(res.data);
            res.data.forEach(item=>{
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                item.inputVisible = false
                item.inputValue = ''
            })
            console.log(res.data);
            if(this.activeName === 'many'){
                this.manyTableData = res.data;
            }else{
                this.onlyTableData = res.data;
            }
        },
        addDialogClosed(){
            // debugger
            this.$refs.addFormRef.resetFields()
        },
        addParams(){
            console.log(this.addRuleForm);
            this.$refs.addFormRef.validate(async valid => {
                if(!valid)return
                const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{attr_name:this.addRuleForm.attr_name,attr_sel:this.activeName})
                if(res.meta.status === 403){
                    this.$router.push("/welcome")
                    return this.$message.error('权限不足，无法访问')
                }
                else if(res.meta.status !== 201){
                    return this.$message.error('添加参数失败')
                }
                this.$message.success('添加参数成功')
                this.addDialogVisible=false
                this.getParamsData()
            })
        },
        async showEditDialog(id){
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,{params:{attr_sel:this.activeName}})
            if(res.meta.status === 403){
                this.$router.push("/welcome")
                return this.$message.error('权限不足，无法访问')
            }
            else if(res.meta.status !== 200){
                return this.$message.error('获取参数信息失败')
            }
            this.editRuleForm = res.data
            this.editDialogVisible=true
        },
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        editParams(){
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid)return
                const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editRuleForm.attr_id}`,{attr_name:this.editRuleForm.attr_name,attr_sel:this.activeName})
                if(res.meta.status === 403){
                    this.$router.push("/welcome")
                    return this.$message.error('权限不足，无法访问')
                }
                else if(res.meta.status !== 200){
                    return this.$message.error('修改参数信息失败')
                }else{
                    this.$message.success('修改参数信息成功')
                    this.getParamsData()
                    this.editDialogVisible = false
                }
            })
        },
        async removeParams(attrid){
          const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err=>err)

            if(confirmResult !== 'confirm'){
                return this.$message.info('已取消')
            }

            const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attrid}`)
            if(res.meta.status === 403){
                this.$router.push("/welcome")
                return this.$message.error('权限不足，无法访问')
            }
            else if(res.meta.status !== 204){
                return this.$message.error('删除成功')
            }

            this.$message.success('删除成功')
            this.getParamsData()
        },
        handleInputConfirm(row){
            if(row.inputValue.trim().length === 0){
                row.inputValue = ''
                row.inputVisible = false
                return
            }
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            row.inputVisible = false
            this.saveAttrVals(row);
        },
        async saveAttrVals(row){
            // 发起请求
            const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(' ')})
            if(res.meta.status === 403){
                this.$router.push("/welcome")
                return this.$message.error('权限不足，无法访问')
            }
            else if(res.meta.status !== 200){
                return this.$message.error('更新失败')
            }
            this.$message.success('更新成功')
            console.log('ok');
        },
        showInput(row){
            row.inputVisible = true
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleClose(i,row){
            row.attr_vals.splice(i,1)
            this.saveAttrVals(row);
        }
    },
    computed:{
        // 如果按钮被禁用则返回true 反之返回false
        isBtnDisable(){
            if(this.selectCateKeys.length == 3){
                return false
            }else{
                return true
            }
        },
        // 当前选中的id
        cateId(){
            if(this.selectCateKeys.length === 3){
                return this.selectCateKeys[2];
            }
            return null
        },
        titleText(){
            if(this.activeName === 'many'){
                return '动态参数'
            }
            return '静态属性'
        }

    }
}
</script>

<style lang="less" scoped>
    .el-card{
        margin-top: 15px;
    }
    .cat_opt{
        margin-top: 15px;
        margin-bottom: 15px;
    }
    .opt{
        margin-right: 15px;
    }
    .el-table{
        margin-top: 15px;
    }
    .el-tag{
        margin: 8px;
    }
    .input-new-tag{
        width: 120px;
    }
</style>