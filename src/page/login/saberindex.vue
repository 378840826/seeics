<template>
  <div class="login-container"
       ref="login"
       @keyup.enter.native="handleLogin">
    <top-color v-show="false"></top-color>
    <div class="main-container">
      <div class="logodiv">这里放logo</div>
      <div class="centercontainer">
        <div>
          <div class="login-weaper animated bounceInDown">
            <div class="login-left">
              <!-- 可放时间
              <div class="login-time">
                {{time}}
              </div>
              <img class="img" src="/img/logo.png" alt="">
              <p class="title">{{ $t('login.info') }}</p>
              -->
              <div class="toptext">
                祝你大卖
              </div>
              <img class="img" src="/img/bg/LRBanner.png" alt="图片">
              <div class="bottomtext">
                亚马逊创业者的数据神器
              </div>    
            </div>
            <div class="login-border">
              <div class="login-main">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="账号密码登录" name="user">
                  <userLogin></userLogin>
                </el-tab-pane>
                <el-tab-pane label="微信登录" name="wechat">
                  <weChat></weChat>               
                </el-tab-pane>              
              </el-tabs>
              <!--
                  思意第一期用安知登录逻辑 ？？？？
                <userLogin v-if="activeName==='user'"></userLogin>
                <codeLogin v-else-if="activeName==='code'"></codeLogin>
                <thirdLogin v-else-if="activeName==='third'"></thirdLogin>
                <weChat v-else-if="activeName==='wechat'"></weChat>
                <div class="login-menu">
                  <a href="#" @click.stop="activeName='user'">{{ $t('login.userLogin') }}</a>
                  //<a href="#" @click.stop="activeName='code'">{{ $t('login.phoneLogin') }}</a>/
                  <a href="#" @click.stop="activeName='third'">{{ $t('login.thirdLogin') }}</a>
                  <a href="#" @click.stop="activeName='wechat'">微信登录</a>
                </div> 
                -->       
              </div>
            </div>
          </div>
          <div class="tip">建议使用Chrome，Firefox，360等浏览器</div>
        </div>        
      </div>
      <div class="footer">
        Copyright 2017 - 2021 All Rights Reserved | Powered by seecis.com
      </div>
    </div>    
  </div>
</template>
<script>
  import userLogin from "./userlogin";
  import codeLogin from "./codelogin";
  import thirdLogin from "./thirdlogin";
  import weChat from "./wechat";
  import {mapGetters} from "vuex";
  import {dateFormat} from "@/util/date";
  import {validatenull} from "@/util/validate";
  import topLang from "@/page/index/top/top-lang";
  import topColor from "@/page/index/top/top-color";
  import {getQueryString, getTopUrl} from "@/util/util";

  export default {
    name: "login",
    components: {
      userLogin,
      codeLogin,
      thirdLogin,
      topLang,
      topColor,
      weChat,
    },
    data() {
      return {
        time: "",
        activeName: "user",
        socialForm: {
          tenantId: "000000",
          source: "",
          code: "",
          state: "",
        }
      };
    },
    watch: {
      $route() {
        this.handleLogin();
      }
    },
    created() {
      this.handleLogin();
      this.getTime();
    },
    mounted() {
    },
    computed: {
      ...mapGetters(["website", "tagWel"])
    },
    props: [],
    methods: {
      getTime() {
        setInterval(() => {
          this.time = dateFormat(new Date());
        }, 1000);
      },
      handleLogin() {
        const topUrl = getTopUrl();
        const redirectUrl = "/oauth/redirect/";
        this.socialForm.source = getQueryString("source");
        this.socialForm.code = getQueryString("code");
        this.socialForm.state = getQueryString("state");
        if (validatenull(this.socialForm.source) && topUrl.includes(redirectUrl)) {
          let source = topUrl.split("?")[0];
          source = source.split(redirectUrl)[1];
          this.socialForm.source = source;
        }
        if (!validatenull(this.socialForm.source) && !validatenull(this.socialForm.code) && !validatenull(this.socialForm.state)) {
          const loading = this.$loading({
            lock: true,
            text: '第三方系统登录中,请稍后。。。',
            spinner: "el-icon-loading"
          });
          this.$store.dispatch("LoginBySocial", this.socialForm).then(() => {
            window.location.href = topUrl.split(redirectUrl)[0];
            this.$router.push({path: this.tagWel.value});
            loading.close();
          }).catch(() => {
            loading.close();
          });
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "@/styles/login.scss";
</style>
