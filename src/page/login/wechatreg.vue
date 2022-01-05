<template>
  <div class="setupnewpsw-container">
    <div class="setupnewpsw-center">
      <div class="logo">
        <img src="/img/bg/bluelogo.png">
      </div>
      <div class="centerdiv">
        <div class="setupnewpsw-form">
          <div v-if="registeredsuccess" class="wechatres-boder">
            <div class="flexdiv">
              <img src="/img/activeEmail.png">
              <div>
                注册成功，请<a :href="emailsite" target="_blank"> 前往邮箱 </a>激活
              </div>
            </div>
            <div class="tipstext">没有收到验证码，<span class="bluetext" @click="handlesendemailagain">重新发送</span></div>

          </div> 
          <div v-else> 
          <div class="setupnewpsw-header" >填 写 账 号 信 息</div>
          <div class="form-main">
            <el-form
            :rules="wechatregRules"
            ref="wechatregForm"
            :model="wechatregForm"
            label-width="0"
            >
            <el-form-item prop="useremail">
              <el-input 
                v-model="wechatregForm.useremail"
                placeholder="请输入账号"
                :type="passwordType">
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input 
                show-password
                v-model="wechatregForm.password"
                placeholder="请输入密码"
                :type="passwordType">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button 
                type="primary"
                @click.native.prevent="handlewechatres"
                class="login-submit">登录注册
              </el-button>
            </el-form-item>
            </el-form>
          </div>
          </div>               
        </div>

      </div>
      <div class="setupnewpsw-tips">
        建议使用Chrome，Firefox，360等浏览器    
      </div>
    </div>
    <footer class="footer">Copyright 2017 - 2021 All Rights Reserved | Powered by seecis.com</footer>
  </div>
</template>
<script>
import { isEmail, sendEmailAgain} from "@/api/user";
import {mapGetters} from "vuex";

export default {
  name: 'wechatreg',
  data(){
    const validateUseremail=async(rule, value, callback) => {
      if (!value) {
        callback(new Error("注册邮箱不能为空"));
        return;
      }
      const reg = /^\s*([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+\s*/;
      if(!reg.test(value)){
        callback(new Error("注册邮箱格式不正确"));
        return;
      }
      
      await isEmail(this.wechatregForm.useremail).then((res)=>{
        if(res.code===200){
          if(!res.data){
            callback(new Error("该用户已存在"));
            return;
          }
        }
      })
      callback();    
    };
    return {
      emailsite: 'http://www.mail.qq.com',
      wechatregForm: {
        useremail: '',
        password: ''
      },
      wechatregRules: {
        useremail: [
          {required: true, trigger: "blur", validator: validateUseremail},
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},// eslint-disable-next-line
          {pattern: /(?!^[0-9]+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)^[`~!@#$%\^&*\(\)\-=_+\[\]\\\{\}:";'',./<>?|A-z0-9]{6,16}$/,message: '长度6~16，至少包含字母、数字和英文符号中的两种', trigger: "blur"},
        ],
      }
    }
  },
  methods: {
    handlewechat(){
      //console.log(this.wechatregForm)
    },
    //重新发送邮件
    handlesendemailagain(){
      sendEmailAgain(this.wechatregForm.useremail).then((res) => {
        if(res.code === 200){
          this.$message.success('激活邮件已发送至您的邮箱，请查收')
        }
      })

    }
  },
  computed: {
    //判断是否是注册
    ...mapGetters(["registeredsuccess"])
  },
  watch: {
    'wechatregForm.useremail'(){
      const regEmail = /@(\w)+((\.\w+)+)$/;
      const m = this.wechatregForm.useremail.match(regEmail);
      if (m.length){
        this.emailsite = `http://www.mail.${ m[0].substr(1)}`;
      }
    }
  }
}

</script>