<template>
 <el-container class="home-container">
  <el-header>
  <div>
  <img src="../assets/as.gif" alt="" height="60px">
  <div class="title">超市后台管理系统</div>
  </div>
  <el-button type="info" class="btns1" icon="fa fa-refresh fa-spin" @click="logout">退出</el-button></el-header>
  <!----页面主体-->
  <el-container>
  <!--侧边栏-->
    <el-aside :width="isCollapse ? '64px':'200px'">
    <div class="toggle-button" @click="toggleCollapse">|+|</div>
    <!--侧边栏菜单区-->
    <el-menu
      background-color="rgb(76, 175, 150)"
      text-color="#fff"
      active-text-color="rgb(23, 219, 98)" unique-opened :collapse="isCollapse"
      :collapse-transition="false" router :default-active="activepath">
      <!--一级菜单-->
      <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
        <template slot="title">
          <i :class="iconsObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
       <!--二级菜单-->
        <el-menu-item :index="'/'+sub.path" v-for="sub in item.children" :key="sub.id" @click="save('/'+sub.path)">
          <template slot="title">
          <i class="fa fa-child"></i>
          <span>{{sub.authName}}</span>
        </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <!--右侧主体-->
    <el-main>
    <router-view></router-view>
    
    </el-main>
  </el-container>
</el-container>
</template>
<script>
export default {
  data(){
return{
  menulist:[],
  iconsObj:{
    // 101:'fa fa-cog fa-spin fa-3x fa-fw',
    // 102:'fa fa-spinner fa-pulse fa-3x fa-fw',
    // 103:'fa fa-refresh fa-spin fa-3x fa-fw',
    // 125:'fa fa-circle-o-notch fa-spin fa-3x fa-fw',
    // 145:'fa fa-spinner fa-spin fa-3x fa-fw'
  },
  isCollapse:false,
  activepath:''
}

  },
  created(){
    this.getMenuList()
    this.activepath=window.sessionStorage.getItem('activepath')
  },
    methods:{
        logout(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
       async getMenuList(){
         const{data:res}=await this.$http.get('menus')
         if(res.meta.status!=200) return this.$message.error(res.meta.msg)
         this.menulist=res.data
        //  console.log(res)
        },
        toggleCollapse(){
this.isCollapse=!this.isCollapse
        },
        save(activepath){
window.sessionStorage.setItem('activepath',activepath)
this.activepath=activepath
        }
    }
}
</script>
<style lang="less" scoped>
.btns1{
    background-color: rgb(45, 209, 182);
}
.el-header{
    // background-color: rgb(202, 202, 86);
background: linear-gradient(to right, #0abdfe, #67f0e0);
display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: whitesmoke;
    font-size: 20px;
    > div{
display: flex;
align-items: center;
span{
    margin-left: 15px;
}
    }
}
.el-aside{
    background-color: rgb(76, 175, 150);
}
.el-main{
    background-color: rgb(243, 240, 240);
}
.home-container{
    height: 100%;
}
.fa{
  margin-right: 10px;
}
.el-menu{
  border-right: none;
      // background-color: rgb(76, 175, 150);

}
.toggle-button{
    background-color: rgb(76, 175, 150);
  font-size: 10px;
  line-height: 24px;
  color:rgb(25, 255, 224) ;
  text-align: center;
  letter-spacing: o.3em;
  cursor: pointer;
}
.title{
  margin-left: 700px;
  color: rgb(55, 187, 154);
}
</style>