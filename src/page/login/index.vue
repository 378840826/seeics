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
            <forgetPsw v-if="forgetpsw"></forgetPsw>
            <regSuccess v-else-if="registeredsuccess" :userEmail="userEmail"></regSuccess>
            <el-tabs  v-else v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="微信登录" name="wechat">
                <weChat></weChat>
              </el-tab-pane>
              <el-tab-pane label="账号密码登录" name="user">
                <userLogin @forgetpswFn="forgetpswFn" @regsuccessFn="regsuccessFn" @useremailchange="useremailchangeFn"></userLogin>             
              </el-tab-pane>       
            </el-tabs>           
          </div>
        </div>
      </div>
      <div class="advicetext">建议使用Chrome，Firefox，360等浏览器</div>
    </div>
    <footer class="footer">Copyright 2017 - 2021 All Rights Reserved | Powered by seecis.com</footer>

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
  },
  computed: {
    ...mapGetters(["registeredsuccess"])
  },
}
</script>
<style lang="scss">
@import "./login.scss";

</style>