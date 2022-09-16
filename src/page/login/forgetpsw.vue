<template>
  <div class="forgetpsw-container">
    <el-form 
    :rules="forgetpswRules"
    ref="forgetpswForm"
    :model="forgetpswForm"
    label-width="0"
  >
    <el-form-item prop="useremail">
      <el-input  
        placeholder="请输入注册邮箱"
        v-model="forgetpswForm.useremail"       
      ></el-input>
    </el-form-item>

    <el-form-item>
    <el-row :span="24">
        <el-col :span="16">
          <el-input           
            @keyup.enter.native="forgetpswTolink"
            v-model="forgetpswForm.code"
            auto-complete="off"
            :placeholder="$t('login.code')">
          </el-input>
        </el-col>
        <el-col :span="8">
          <div>
            <img :src="forgetpswForm.image" @click="refreshCode"/>
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button 
        type="primary"
        size="small"
        @click.native.prevent="forgetpswTolink"
        >发送链接
      </el-button>
    </el-form-item>
  </el-form> 
  </div>
</template>
<script>
import { getCaptcha, sendresetpswEmail, isEmail } from '@/api/user';

export default {
  name: 'forgetpsw',
  data(){
    const validateUseremail = async (rule, value, callback) => {
      if (!value) {
        callback(new Error('注册邮箱不能为空'));
        return;
      }
      const reg = /^\s*([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+\s*/;
      if (!reg.test(value)){
        callback(new Error('注册邮箱格式不正确'));
        return;
      }
      //发送请求判断邮箱是否存在
      await isEmail(this.forgetpswForm.useremail).then(res => {
        if (!res.data.data){
          callback(new Error('用户不存在'));
          return;
        }
        callback();
      });  
    };
    return {
      forgetpswForm: {
        useremail: '',
        type: 'account',
        //验证码的值
        code: '',
        //验证码的索引
        key: '',
        //预加载白色背景
        image: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      },
      forgetpswRules: {
        useremail: [
          { required: true, trigger: 'blur', validator: validateUseremail },
          //发送请求验证邮箱是否存在提供对应提示语
          //{pattern:/^\s*([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+\s*/,message: '邮箱格式不正确',trigger: "blur"}
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.refreshCode();   
  },
  methods: {
    //发送链接按钮
    forgetpswTolink(){
      //先验证
      this.$refs.forgetpswForm.validate(valid => {
        if (valid){
          if (!this.forgetpswForm.code){
            this.$message.error('验证码不能为空');
            return;
          }
          //发请求
          sendresetpswEmail(
            this.forgetpswForm.useremail, this.forgetpswForm.code, this.forgetpswForm.key,
          ).then((res) => {
            //成功就提示邮件已发送，请查收
            if (res.data.code === 200){
              this.$message.success('重置密码邮件已发送至您的邮箱，请查收');
              
            }
          });     
        }
        //this.refreshCode(); 
      });   
    },
    //刷新验证码
    refreshCode() {
      if (this.website.captchaMode) {
        getCaptcha().then(res => {
          const data = res.data;
          this.forgetpswForm.key = data.key;
          this.forgetpswForm.image = data.image;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.forgetpsw-container {
  .el-form{
    margin-top: 90px;
  }
  img {
    border: 1px solid #DCDFE5;
    height: 38px;
    /* margin: 0 auto; */
    /* margin: 4px 10px; */
    float: right;
    //margin: 4px 0;
    border-radius: 4px;
  }
  .el-button {
    width: 100%;
    height: 40px;
    padding: 0;
    font-size: 14px;
    line-height: 40px;
  }

}
</style>
