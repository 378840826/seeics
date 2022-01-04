<template>
  <div 
    class="login-container"
    ref="login"
    @keyup.enter.native="handleLogin"
  >
    <div class="center-container">
      <div class="logodiv">
        <img src="/img/bg/logoseeics.png">
      </div>
      <div class="main-container">
        <div class="login-border">
          <div class="main-left">
            <div class="title">助你大卖</div>
            <div class="subtitle">亚马逊创业者的数据神器</div>
            <img src="/img/bg/loginleftimg.png">
          </div>
          <div class="main-right">

            <div class="regsuccess-container">
              <img src="/img/activeEmail.png">
              <div>
                注册成功，请<a :href="emailsite" target="_blank"> 前往邮箱 </a>激活
              </div>
              <div class="bottomtext">
                没有收到验证邮件？
                <span @click="resetsendEmail" class="sendagin">重新发送</span>
              </div>  
            </div>
                       
          </div>
        </div>
      </div>
      <div class="advicetext">建议使用Chrome，Firefox，360等浏览器</div>
    </div>
    <footer class="footer">Copyright 2017 - 2021 All Rights Reserved | Powered by amzics.com</footer>

  </div>
</template>
<script>
import userLogin from "./user";
import weChat from "./wechat";
import forgetPsw from "./forgetpsw";
import regSuccess from "./regsuccess";
import {mapGetters} from "vuex";

export default {
  name: "login",
  components: {
    userLogin,
    weChat,
    forgetPsw,
    regSuccess
  },
  data(){
    return {
      activeName: 'user',
      userEmail:'',
      forgetpsw: false,//忘记密码
    }  
  },
  methods: {
    //忘记密码
    forgetpswFn(val){
      this.forgetpsw=val;
    },
    //将邮箱传回来
    useremailchangeFn(val){
      this.userEmail=val;
    }
  },
  computed: {
    ...mapGetters(["registeredsuccess"])
  },
}
</script>
<style lang="scss">
@import "./login.scss";

</style>