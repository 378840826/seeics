<template>
  <div class="setupnewpsw-container">
    <div class="setupnewpsw-center">
      <div class="logo">
        <img src="/img/bg/bluelogo.png">
      </div>
      <div class="centerdiv">
        <div class="setupnewpsw-form">
          <div class="setupnewpsw-header">设 置 新 密 码</div>
          <div class="form-main">
            <el-form
            :rules="setupnewpswRules"
            ref="setupnewpswForm"
            :model="setupnewpswForm"
            label-width="0"
            >
            <el-form-item prop="password">
              <el-input 
                show-password
                v-model="setupnewpswForm.password"
                placeholder="请输入新密码"
                :type="passwordType">
              </el-input>
            </el-form-item>
            <el-form-item prop="confirmpassword">
              <el-input 
                show-password
                v-model="setupnewpswForm.confirmpassword"
                placeholder="请确认密码"
                :type="passwordType">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button 
                type="primary"
                @click.native.prevent="submitpsw"
                class="login-submit">提交
              </el-button>
            </el-form-item>
            </el-form>
          </div>        
        </div>
      </div>
      <div class="setupnewpsw-tips">
        建议使用Chrome，Firefox，360等浏览器    
      </div>
    </div>
    <footer class="footer">Copyright 2017 - 2021 All Rights Reserved | Powered seecis.com</footer>
  </div>
</template>
<script>
//import {getQueryString} from "@/util/util";
import {resetPassword} from "@/api/user";
import md5 from 'js-md5';

export default {
  name: 'activatesuccess',
  data(){
    const validaconfirmpassword=(rule, value, callback) => {
      if (!value) {
        callback(new Error("新密码不能为空"));
        return;
      }
      //与第一次输入密码相比较
      if(value !== this.setupnewpswForm.password){
        callback(new Error("两次密码输入不一致"));
        return;
      }
      //要考虑修改了上面的
      callback();    
    };

    return {
      markId: 'whf',
      passwordType: "password",
      setupnewpswForm:{
        password: '',
        confirmpassword: '',
      },
      setupnewpswRules: {
        password:[
          {required: true, message: "请输入新密码", trigger: ["blur","change"]}, // eslint-disable-next-line
          {pattern:/(?!^[0-9]+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)^[`~!@#$%\^&*\(\)\-=_+\[\]\\\{\}:";'',./<>?|A-z0-9]{6,16}$/,message: '长度6~16，至少包含字母、数字和英文符号中的两种', trigger: "blur"},
        ],
        confirmpassword:[
          {required: true, trigger: ["blur","change"],validator: validaconfirmpassword}
        ]
      }
    }
  },
  methods: {
    //提交密码
    submitpsw() {
      //从url切出markId
      const dd = this.$route.query.markId;
      
      //先验证
      this.$refs.setupnewpswForm.validate(valid => {
        if(valid){
          resetPassword(dd,md5(this.setupnewpswForm.password)).then((res) => {
          if(res.data.code === 200){
            this.$message.success(res.data.msg);
            this.$router.push({path: '/login'});
            }       
          });
        }
      }) 
    }
  },
}
</script>