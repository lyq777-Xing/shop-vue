<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList()">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList()"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button class="addgoods" type="primary" @click="addPageDialog">添加商品</el-button>
                </el-col>
            </el-row>
            <el-table :data="goodslist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格（元）" prop="goods_price" width="95px"></el-table-column>
                <el-table-column label="进货日期" prop="good_in_date" width="140px">
                    <template slot-scope="scope">
                        {{scope.row.goods_in_date}}
                    </template>
                </el-table-column>
                <el-table-column label="商品数量" prop="goods_number" width="95px"></el-table-column>
                <el-table-column label="进货价格" prop="goods_in_price" width="95px"></el-table-column>
                <el-table-column label="生产日期" prop="manufacture_date" width="95px"></el-table-column>
                <el-table-column label="保质期" prop="quality_date" width="95px"></el-table-column>
                <el-table-column label="供货商" prop="supplier" width="95px"></el-table-column>
                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showupdateDialog(scope.row.goods_id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            background>
            </el-pagination>
        </el-card>
        <!--添加对话框-->
        <el-dialog
        title="添加商品"
        :visible.sync="addDialogVisible"
        width="50%" @close="addformclose">
        <el-form ref="addformRef" :model="addform" label-width="110px" :rules="addFormRules">
        <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addform.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格(元)" prop="goods_price">
            <el-input v-model="addform.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="进货日期" prop="goods_in_date">
        <el-date-picker
            v-model="addform.goods_in_date"
            type="date"
            placeholder="选择进货日期"
            value-format="yyyy-MM-dd"
            >
            </el-date-picker>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addform.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="进货价格" prop="goods_in_price">
            <el-input v-model="addform.goods_in_price"></el-input>
        </el-form-item>
        <el-form-item label="生产日期" prop="manufacture_date">
            <el-date-picker
            v-model="addform.manufacture_date"
            type="date"
            placeholder="选择生产日期"
            value-format="yyyy-MM-dd"
            >
            </el-date-picker>
        </el-form-item>
        <el-form-item label="保质期" prop="quality_date">
            <el-input v-model="addform.quality_date"></el-input>
        </el-form-item>
        <!-- <el-form-item label="供货商id" prop="supplierService_id">
            <el-input v-model="addform.supplierService_id"></el-input>
        </el-form-item> -->
        <el-form-item label="供货商" prop="supplierService_id">
            <el-select v-model="addform.supplierService_id" placeholder="供货商">
                <el-option :label="item.username" v-for="item in supplierData" :key="item.id" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisibleoff">取 消</el-button>
            <el-button type="primary" @click="addGoods">确 定</el-button>
        </span>
        </el-dialog>
        <!--修改对话框-->
        <el-dialog
        title="修改商品"
        :visible.sync="editDialogVisible"
        width="50%" @close="editformclose">
            <el-form ref="editformRef" :model="editform" label-width="110px" :rules="editFormRules">
                <el-form-item label="商品名称">
                    <el-input v-model="editform.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格(元)" >
                    <el-input v-model="editform.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="进货日期">
                <el-date-picker
                    v-model="editform.goods_in_date"
                    type="date"
                    placeholder="选择进货日期"
                    value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="商品数量" >
                    <el-input v-model="editform.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="进货价格">
                    <el-input v-model="editform.goods_in_price"></el-input>
                </el-form-item>
                <el-form-item label="生产日期">
                    <el-date-picker
                    v-model="editform.manufacture_date"
                    type="date"
                    placeholder="选择生产日期"
                    value-format="yyyy-MM-dd"
                    disabled
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="保质期" >
                    <el-input v-model="editform.quality_date"></el-input>
                </el-form-item>
                <!-- <el-form-item label="供货商id">
                    <el-input v-model="editform.supplierService_id"></el-input>
                </el-form-item> -->
                <el-form-item label="供货商">
                    <el-select v-model="editform.supplierService_id"  placeholder="供货商">
                        <el-option v-for="item in supplierData" :key="item.id" :label="item.username" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisibleoff">取 消</el-button>
                <el-button type="primary" @click="editGoods">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 删除对话框 -->
        <el-dialog
        title="删除商品提示"
        :visible.sync="deleteDialogVisible"
        width="50%">
        <span>您确定要删除该商品吗？</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="deleteDialogVisibleoff">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            goodslist:[],
            total:0,
            //修改对象id
            editId:'',
            //添加商品addDialogVisible
            addDialogVisible:false,
            //修改商品editDialogVisible
            editDialogVisible:false,
            //删除商品deleteDialogVisible
            deleteDialogVisible:false,
            addform:{
                goods_name:'',
                goods_price:'',
                goods_in_date:'',
                goods_number:'',
                goods_in_price:'',
                manufacture_date:'',
                quality_date:'',
                supplierService_id:''
            },
            addFormRules:{
                goods_name:[{required:true,message:'请输入商品名称',trigger:'blur'}],
                goods_price      :[{required:true,message:'请输入商品价格',trigger:'blur'}],
                goods_in_date   :[{required:true,message:'请输入商品进货日期',trigger:'blur'}],
                goods_number  :[{required:true,message:'请输入商品数量',trigger:'blur'}],
                goods_in_price:[{required:true,message:'请输入商品进货价格',trigger:'blur'}],
                manufacture_date :[{required:true,message:'请输入生产日期',trigger:'blur'}],
                quality_date  :[{required:true,message:'请输入商品保质期',trigger:'blur'}],
                supplierService_id  :[{required:true,message:'请输入商品供货商id',trigger:'blur'}]
            },
            editFormRules:{
                goods_name:[{required:true,message:'请输入商品名称',trigger:'blur'}],
                goods_price      :[{required:true,message:'请输入商品价格',trigger:'blur'}],
                goods_in_date   :[{required:true,message:'请输入商品进货日期',trigger:'blur'}],
                goods_number  :[{required:true,message:'请输入商品数量',trigger:'blur'}],
                goods_in_price:[{required:true,message:'请输入商品进货价格',trigger:'blur'}],
                manufacture_date :[{required:true,message:'请输入生产日期',trigger:'blur'}],
                quality_date  :[{required:true,message:'请输入商品保质期',trigger:'blur'}],
                supplierService_id  :[{required:true,message:'请输入商品供货商id',trigger:'blur'}]
            },
            editform:{

            },
            supplierData:[],
            card:{
                manager_id:0,
            }
        }
    },
    created(){
        this.getGoodsList()
    },
    methods:{
        // 根据分页获取商品列表
        async getGoodsList(){
            const {data:res} = await this.$http.get('goods',{params:this.queryInfo});
            if(res.meta.status === 403){
                this.$router.push("/welcome")
                return this.$message.error('权限不足，无法访问')
            }
            else if(res.meta.status !== 200){
                return this.$message.error('获取失败');
            }
            this.$message.success('获取成功');
            console.log(res.data);
            this.goodslist = res.data.records;
            this.total = res.data.total;
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        async removeById(id){
            const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err=>err)
            if(confirmResult !== 'confirm'){
                return this.$message.info('已取消删除')
            }
            const {data:res} = await this.$http.delete(`goods/${id}`)
            if(res.meta.status === 403){
                return this.$message.error('权限不足，无法访问')
            }
            else if(res.meta.status !== 204){
                return this.$message.error('删除失败')
            }
            this.$message.success('删除成功')
            this.getGoodsList()
        },
        //添加商品对话框
        addPageDialog(){
            this.addDialogVisible=true
            this.getSupplierData()
        },
        //取消添加
        addDialogVisibleoff(){
            this.addDialogVisible=false
            this.$message.info('操作取消！')
        },
        //取消修改
        editDialogVisibleoff(){
           this.editDialogVisible=false
           this.$message.info('操作取消！')
        },
        //取消删除
        deleteDialogVisibleoff(){
            this.deleteDialogVisible=false
            this.$message.info('操作取消！')
        },
        //查找要修改的对象
        async showupdateDialog(id){
            this.editId=id
             const{data:res}=await this.$http.get('goods/'+id)
             if(res.meta.status===200){
                 this.editform=res.data
                 this.editDialogVisible=true
                 this.getSupplierData();
                 return this.$message.success('查找成功！')
             }else if(res.meta.status===403){
                 return this.$message.error('权限不足！')
             }
             else{
                 return this.$message.error('查找失败！')
             }
        },
        //清除添加对话框数据
        addformclose(){
              this.$refs.addformRef.resetFields()
        },
        //清除修改对话框数据
        editformclose(){
              this.$refs.editformRef.resetFields()
        },
        //发起添加数据请求
        async addGoods(){
            this.$refs.addformRef.validate(async valid=>{
                if(!valid) return
                const{data:res}=await this.$http.post('goods',this.addform)
                console.log(res)
                if(res.meta.status===201){
                    this.$message.success('添加商品成功！')
                     this.addDialogVisible=false
                this.getGoodsList()
                }else if(res.meta.status===403){
                    return this.$message.error('没有权限访问！')
                }else{
                    return this.$message.error('添加失败！')
                }
            })
        },
        //发起修改商品请求
        async editGoods(){
            this.$refs.editformRef.validate(async valid=>{
                if(!valid) return
                const{data:res}=await this.$http.put('goods/'+this.editId,this.editform)
                if(res.meta.status===200){
                    this.editDialogVisible=false
                    this.getGoodsList()
                    return this.$message.success('更新成功！')
                }else if(res.meta.status===403){
                    return this.$message.error('权限不足！')
                }else{
                    return this.$message.error('更新失败!')
                }
            })
        },
        async getSupplierData(){
            const {data:res} = await this.$http.get('users/supplier')
            console.log(res);
            if(res.meta.status == 200){
                this.supplierData = res.data
                return 
            }else{
                return this.$message.error('查询失败')
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .el-card{
        margin-top: 15px;
    }
    .el-table{
        margin-top: 15px;
    }
    .addgoods{
        margin-left: 15px;
    }
</style>