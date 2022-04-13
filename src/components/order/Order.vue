<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row> -->

      <!-- 订单列表数据 -->
      <el-button type="primary" @click="showAddDialog()">添加订单</el-button>
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_id"></el-table-column>
        <!-- <el-table-column label="订单价格" prop="order_price"></el-table-column> -->
        <el-table-column label="是否发货" prop="order_status">
          <template slot-scope="scope">
            <template>
              {{scope.row.order_status}}
            </template>
          </template>
        </el-table-column>
        <el-table-column label="供货商" prop="supplier">
          <template slot-scope="scope">
            <template>
              {{scope.row.supplier}}
            </template>
          </template>
        </el-table-column>
        <el-table-column label="货物分类" prop="order_title">
          <template slot-scope="scope">
            <template>
              {{scope.row.order_title}}
            </template>
          </template>
        </el-table-column>
        <!-- <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column> -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- slot-scope="scope" -->
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox(scope.row.id)">修改订单</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteBox(scope.row.id)">删除订单</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!--添加订单对话框-->
    <el-dialog
    title="添加订单"
    :visible.sync="addDialogVisible"
    width="50%" @close="addClosed">
      <el-form ref="addformRef" :model="addform" label-width="80px" :rules="addFormrules">
        <el-form-item label="订单编号" prop="order_id">
          <el-input v-model="addform.order_id"></el-input>
        </el-form-item>
          <el-form-item label="是否发货" prop="order_status">
          <el-input v-model="addform.order_status"></el-input>
        </el-form-item>
        <!-- <el-form-item label="供货商id" prop="supplier_id">
          <el-input v-model="addform.supplier_id"></el-input>
        </el-form-item> -->
        <el-form-item label="供货商" prop="supplier_id">
            <el-select v-model="addform.supplier_id" v-for="item in supplierData" :key="item.id" placeholder="供货商">
                <el-option :label="item.username" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="货物分类" prop="order_title">
          <el-input v-model="addform.order_title"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisibleoff">取 消</el-button>
        <el-button type="primary" @click="addOrder">确 定</el-button>
      </span>
  </el-dialog>
<!--修改订单对话框-->
    <el-dialog
    title="修改订单"
    :visible.sync="editDialogVisible"
    width="50%" @close="editClosed">
      <el-form ref="editformRef" :model="editform" label-width="80px" :rules="editFormrules">
        <el-form-item label="订单编号" prop="order_id">
          <el-input v-model="editform.order_id" disabled></el-input>
        </el-form-item>
          <el-form-item label="是否发货" prop="order_status">
          <el-input v-model="editform.order_status"></el-input>
        </el-form-item>
        <!-- <el-form-item label="供货商id" prop="supplier_id">
          <el-input v-model="editform.supplier_id"></el-input>
        </el-form-item> -->
         <el-form-item label="供货商">
            <el-select v-model="editform.supplier_id" prop="supplier_id" v-for="item in supplierData" :key="item.id" placeholder="供货商">
                <el-option :label="item.username" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="货物分类" prop="order_title">
          <el-input v-model="editform.order_title"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisibleoff">取 消</el-button>
        <el-button type="primary" @click="editOrder">确 定</el-button>
      </span>
    </el-dialog>
<!--删除对话框-->
<el-dialog
  title="删除订单"
  :visible.sync="deleteDialogVisible"
  width="30%">
  <span>您确定要删除吗？</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisibleoff">取 消</el-button>
    <el-button type="primary" @click="deleteOrder">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        // query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderlist: [],
      addDialogVisible:false,
      addform:{
        order_id:'',
        order_status:'',
        supplier_id:'',
        order_title:''
      },
      addFormrules:{
        order_id:[{required:true,message:'请输入订单编号',trigger:'blur'}],
        order_status:[{required:true,message:'请输入发货状态',trigger:'blur'}],
        supplier_id:[{required:true,message:'请输入供货商id',trigger:'blur'}],
        order_title:[{required:true,message:'请输入货物分类',trigger:'blur'}]
      },
      editDialogVisible:false,
      editform:{},
      editFormrules:{
        order_id:[{required:true,message:'请输入订单编号',trigger:'blur'}],
        order_status:[{required:true,message:'请输入发货状态',trigger:'blur'}],
        supplier_id:[{required:true,message:'请输入供货商id',trigger:'blur'}],
        order_title:[{required:true,message:'请输入货物分类',trigger:'blur'}]
      },
      deleteId:'',
      deleteDialogVisible:false,
      supplierData:[]
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders',{params:this.queryInfo})

      if(res.meta.status === 403){
          this.$router.push("/welcome")
          return this.$message.error('权限不足，无法访问')
      }
      else if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败！')
      }

      console.log(res)
      this.total = res.data.total
      this.orderlist = res.data.records
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    async showBox (id) {
      console.log(id);
      this.editDialogVisible=true
      const{data:res}=await this.$http.get('order/findbyid?id='+id)
      // console.log(res)
      if(res.meta.status===200){
        this.$message.success('获取成功')
        this.editform=res.data
        this.getSupplierData()
      }else if(res.meta.status===403){
        return this.$message.error('权限不足！')
      }else{
        return this.$message.error('查询失败！')
      }
    },
    //获取要删除的订单的id
    deleteBox(id){
       this.deleteId=id
       this.deleteDialogVisible=true
    },
    addressDialogClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    //添加操作取消
    addDialogVisibleoff(){
        this.$message.info('操作取消')
        this.addDialogVisible=false
    },
    //修改订单操作取消
    editDialogVisibleoff(){
        this.editDialogVisible=false
        this.$message.info('操作取消')
    },
    //删除订单取消
    dialogVisibleoff(){
        this.deleteDialogVisible=false
        this.$message.info('操作取消')
    },
    //添加订单
     addOrder(){
        this.$refs.addformRef.validate(async valid=>{
          if(!valid) return
          console.log(this.addform);
          const{data:res}=await this.$http.post('order/add',this.addform)
          console.log(res)
          if(res.meta.status === 403){
            this.$router.push("/welcome")
            return this.$message.error('权限不足，无法访问')
          }else if(res.meta.status!=200){
            this.$message.error("创建订单失败")
          }else{
            this.getOrderList()
            this.addDialogVisible=false
              this.$message.success("创建订单成功")
          }
        })
    },
    //修改订单
    editOrder(){
      this.$refs.editformRef.validate(async valid=>{
        if(!valid) return
        const{data:res}=await this.$http.put('orders/updatestatus',this.editform)
        console.log(res)
        if(res.meta.status === 403){
          this.$router.push("/welcome")
          return this.$message.error('权限不足，无法访问')
        }else if(res.meta.status!=200){
          this.$message.error("修改订单失败")
        }else{
          this.getOrderList()
          this.editDialogVisible=false
            this.$message.success("修改订单成功")
        }
      })
    },
    //删除订单
    async deleteOrder(){
      const{data:res}=await this.$http.delete('orders/delete/'+this.deleteId)
      if(res.meta.status===200){
        this.$message.success('删除订单成功！')
        this.getOrderList()
        this.deleteDialogVisible=false
      }else if(res.meta.status===403){
        return this.$message.error('权限不足！')
      }else{
        return this.$message.error('删除失败！')
      } 
    },
    //清空添加对话框数据
    addClosed(){
      this.$refs.addformRef.resetFields()
    },
    //清空修改对话框数据
    editClosed(){
            this.$refs.editformRef.resetFields()
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
    },
    showAddDialog(){
      this.addDialogVisible = true
      this.getSupplierData();
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';

  .el-cascader {
    width: 100%;
  }
  .el-card{
    margin-top: 15px;
  }
  .el-table{
    margin-top: 15px;
  }
</style>
