<template>
    <div class="login_container" >
    <img src="../assets/aac.gif" class="login_container" >
    <div class="login_box">
    <!--头像区域123-->
    <!--456-->
    <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
    </div>
    <!--登录表单区域-->
    <el-form ref="loginFormRef" label-width="0px" class="login_form" :model="loginForm" :rules="LoginFormRules">
            <!---用户名-->
        <el-form-item prop="username">
            <el-input prefix-icon="fa fa-home fa-fw" v-model="loginForm.username"></el-input>
        </el-form-item>
            <!--密码-->
        <el-form-item prop="password">
            <el-input prefix-icon="fa fa-circle-o-notch fa-spin fa-2x fa-fw" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="code">
            <el-input style="width:250px; float:left" v-model="loginForm.code" type="code"></el-input>
            <el-image :src="captchaImg" style="margin-left: 15px;" @click="getcaptchaImg" class="captchaImg"></el-image>
        </el-form-item>
            <!--按钮-->
            <el-form-item class="btns">
            <el-button type="success" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
    </el-form>
    </div>
    </div>
</template>
<script>
import qs from 'qs'

export default {
    data(){
        return{
            //登录表单的数据对象
            loginForm:{
                username:'测试角色1',
                password:'123456',
                // 验证码
                code:'',
                // 验证码携带的key值
                key:''
            },
            queryInfo:{
             pagenum:1,
             pagesize:3
            },
            //表单的验证规则
            LoginFormRules:{
               username:[{required:true,message:"请输入用户名",trigger:"blur"},{min:3,max:10,message:"长度在3到10个字符之间",trigger:"blur"}],
               password:[{required:true,message:"请输入密码",trigger:"blur"},{min:6,max:10,message:"长度在6到10个字符之间",trigger:"blur"}],
               code:[{required:true,message:"请输入验证码",trigger:"blur"},{min:5,max:5,message:"请输入正确的验证码",trigger:"blur"}]
            },
            captchaImg:''
        }
    },
    created(){
        this.getcaptchaImg()
    },
    methods:{
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields()
        },
        login(){
            this.$refs.loginFormRef.validate(async valid=>{
                if(!valid) return
                const{data:res}=await this.$http.post('login?'+qs.stringify(this.loginForm))
                if(res.meta.status!=200){
                    console.log(res);
                    this.$message.error("登录失败")
                }else{
                      console.log(res);
                      this.$message.success("登录成功")
                      window.sessionStorage.setItem("token",res.data.token);
                      this.$router.push("/home")
                }
                
            })
        },
        async getcaptchaImg(){
            const{data:res}=await this.$http.get('captcha')
            if(res.meta.status !== 200){
               return this.$message.error('获取失败')
            }
            console.log(res);
            this.loginForm.key = res.data.key
            this.captchaImg = res.data.base64Img
            // this.captchaImg = window.URL.createObjectURL(res.data.base64Img)
            this.loginForm.code = ''
        }
    }
}
</script>
<style lang="less" scoped>
    .login_container{
    background-color: rgb(200, 200, 241);
        height: 100%;
        width: 100%;
    }
    .login_box{
        width: 450px;
        height: 350px;
        background-color: rgb(83, 83, 99);
        border-radius: 3px;
        position:absolute;
        left: 50%;
        top:50%;
        transform: translate(-50%,-50%);
        // opacity: 0.5;
        .avatar_box{
            height: 130px;
            width: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            background-color: rgb(139, 139, 226); 
            opacity: 0.5;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
    }
    .login_form{
        position: absolute;
        bottom: -15px;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .btns{
    display: flex;
    justify-content: flex-end; 
    }
    // .el-form{
    //     background-color: #fff;
    // }
</style>