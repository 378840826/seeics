<template>
  <div class="forgetpsw-container">
  <el-form
    class="login-form"
    status-icon
    :rules="forgetpswRules"
    ref="forgetpswForm"
    :model="forgetpswForm"
    label-width="0"
  >
    <el-form-item prop="useremail">
      <el-input
        
        placeholder="请输入注册邮箱"
        v-model="forgetpswForm.useremail"
        @keyup.enter.native="testbtn"       
      ></el-input>
    </el-form-item>

    <el-form-item>
    <el-row :span="24">
        <el-col :span="16">
          <el-input           
            @keyup.enter.native="handleLogin"
            v-model="forgetpswForm.code"
            auto-complete="off"
            :placeholder="$t('login.code')">
          </el-input>
        </el-col>
        <el-col :span="8">
          <div class="login-code">
            <img :src="forgetpswForm.image" class="login-code-img" @click="refreshCode"/>
          </div>
        </el-col>
      </el-row>
    </el-form-item>

    <el-form-item>
      <el-button 
        type="primary"
        size="small"
        @click.native.prevent="testbtn"
        class="login-submit">发送链接
      </el-button>
    </el-form-item>
  </el-form>
  </div>
</template>
<script>
import {getCaptcha} from "@/api/user";


 export default {
   name: 'forgetpsw',
   data(){
     const validateUseremail=(rule, value, callback) => {
      if (!value) {
        callback(new Error("注册邮箱不能为空"));
      }
      const reg = /^\s*([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+\s*/;
      if(!reg.test(value)){
        callback(new Error("注册邮箱格式不正确"));
      }
      callback();
      
    };
     return {
       forgetpswForm: {
         useremail: "",
         type: "account",
          //验证码的值
          code: "",
          //验证码的索引
          key: "",
          //预加载白色背景
          image: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
       },
       forgetpswRules:{
         useremail: [
           {required: true, trigger: "blur", validator: validateUseremail},
           //发送请求验证邮箱是否存在提供对应提示语
           //{pattern:/^\s*([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+\s*/,message: '邮箱格式不正确',trigger: "blur"}
         ],
       }
     }
   },
   created() {
     this.refreshCode();   
   },
   methods: {
     //试一下自定义校验规则有没有用
     testbtn(){
       //先验证
       this.$refs.forgetpswForm.validate(valid => {
         if(valid){
           console.log(this.forgetpswForm,`forgetpswForm`);
         }
       });
       this.$message.error('请正确填写信息');
     },
     //刷新验证码
     refreshCode() {
        if (this.website.captchaMode) {
          getCaptcha().then(res => {
            const data = res.data;
            this.forgetpswForm.key = data.key;
            this.forgetpswForm.image = data.image;
          })
        }
      },
   },
 }
</script>