<template>
<div>
  <div class="user-container">
    <el-form 
      class="login-form"
      :rules="loginRules"
      ref="loginForm"
      :model="loginForm"
      label-width="0">
      <!--第一期租户id固定传000000
      <el-form-item v-if="tenantMode" prop="tenantId">
        <el-input size="small"
                  @keyup.enter.native="handleLogin"
                  v-model="loginForm.tenantId"
                  auto-complete="off"
                  :placeholder="$t('login.tenantId')">
          <i slot="prefix" class="icon-quanxian"/>
        </el-input>
      </el-form-item>
      -->
      <el-form-item prop="username">
        <el-input 
          @keyup.enter.native="handleLogin"
          v-model="loginForm.username"
          :placeholder="$t('login.username')">
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          show-password 
          @keyup.enter.native="handleLogin"        
          v-model="loginForm.password"
          :placeholder="$t('login.password')"
        >
        </el-input>
      </el-form-item>
      <el-form-item v-if="this.website.captchaMode" prop="code">
      <el-row :span="24">
        <el-col :span="16">
          <el-input size="small"
                    @keyup.enter.native="handleLogin"
                    v-model="loginForm.code"
                    auto-complete="off"
                    :placeholder="$t('login.code')">
          </el-input>
        </el-col>
        <el-col :span="8">
          <div>
            <img :src="loginForm.image" @click="refreshCode">
          </div>
        </el-col>
      </el-row>
    </el-form-item>
      <el-form-item props="freelogin">
        <el-checkbox v-model="loginForm.freelogin">七天自动登录</el-checkbox>
        <span @click="clickforgetpsw" class="aspan">忘记密码</span>
      </el-form-item>
      <el-form-item>
        <el-button 
          type="primary"
          @click.native.prevent="handleLogin"
          class="login-submit">登录/注册
        </el-button>
      </el-form-item>
    </el-form>
    <div class="inactivespan" v-if="isactivatedAccount">
      账号未激活，请<a :href="emailsite" target="aaa">前往邮箱</a>激活<span class="sendagainspan" @click="sendagainemail">重新发送</span>
    </div>
  </div>
</div>
</template>
<script>
import { mapGetters } from 'vuex';
import { info } from '@/api/system/tenant';
import { getCaptcha, sendEmailAgain, activationData } from '@/api/user';
import { getTopUrl } from '@/util/util';

export default {
  name: 'userlogin',
  data() {
    return {
      //账号未激活
      //activatedAccount: true,
      emailsite: '', //前往邮箱地址
      tenantMode: this.website.tenantMode, //是否开启租户模式
      forgetpaw: false, //忘记密码
      loginForm: {
        //租户ID
        tenantId: '000000',
        //部门ID
        deptId: '',
        //角色ID
        roleId: '',
        //用户名
        username: '',
        //密码
        password: '',
        //账号类型
        type: 'account',
        //验证码的值
        code: '',
        //验证码的索引
        key: '',
        //七天免登录
        freelogin: false,
        //预加载白色背景
        image: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      },
      loginRules: {
        //第一期租户id固定000000，不显示
        /**         
          tenantId: [
            {required: false, message: "请输入租户ID", trigger: "blur"}
          ],
          */
        username: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          //验证邮箱格式
          { pattern: /^\s*([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+\s*/, message: '邮箱格式不正确', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }, // eslint-disable-next-line
            {pattern: /(?!^[0-9]+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)^[`~!@#$%\^&*\(\)\-=_+\[\]\\\{\}:";'',./<>?|A-z0-9]{6,16}$/,message: '长度6~16，至少包含字母、数字和英文符号中的两种', trigger: "blur"},
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      passwordType: 'password',
      userBox: false,
        
      userForm: {
        deptId: '',
        roleId: ''
      },
        
      userOption: {
        labelWidth: 70,
        submitBtn: true,
        emptyBtn: false,
        submitText: '登录',
        column: [
          {
            label: '部门',
            prop: 'deptId',
            type: 'select',
            props: {
              label: 'deptName',
              value: 'id'
            },
            dicUrl: '/api/blade-system/dept/select',
            span: 24,
            display: false,
            rules: [{
              required: true,
              message: '请选择部门',
              trigger: 'blur'
            }],
          },
          {
            label: '角色',
            prop: 'roleId',
            type: 'select',
            props: {
              label: 'roleName',
              value: 'id'
            },
            dicUrl: '/api/blade-system/role/select',
            span: 24,
            display: false,
            rules: [{
              required: true,
              message: '请选择角色',
              trigger: 'blur'
            }],
          },
        ]
      }
    };
  },
  created() {
    this.getTenant();
    this.refreshCode();
  },
  // mounted() {
  // },
  watch: {
    'loginForm.deptId'() {
      const column = this.findObject(this.userOption.column, 'deptId');
      if (this.loginForm.deptId.includes(',')) {
        column.dicUrl = `/api/blade-system/dept/select?deptId=${this.loginForm.deptId}`;
        column.display = true;
      } else {
        column.dicUrl = '';
      }
    },
    'loginForm.roleId'() {
      const column = this.findObject(this.userOption.column, 'roleId');
      if (this.loginForm.roleId.includes(',')) {
        column.dicUrl = `/api/blade-system/role/select?roleId=${this.loginForm.roleId}`;
        column.display = true;
      } else {
        column.dicUrl = '';
      }
    },
    'cacheemail'(){
      const regEmail = /@(\w)+((\.\w+)+)$/;
      const m = this.cacheemail.match(regEmail);
      if (m.length){
        this.emailsite = `http://www.mail.${ m[0].substr(1)}`;
      }
    },  
  },
    
  computed: {
    ...mapGetters(['tagWel', 'userInfo', 'isPhone', 'isactivatedAccount', 'cacheemail', 'isactivatedAccountspan', 'registeredsuccess'])
  },
  props: [],
  methods: {
    //重发邮件
    sendagainemail(){
      sendEmailAgain(this.cacheemail).then((res) => {
        if (res.data.code === 200){
          this.$message.success('激活邮件已发送至您的邮箱，请查收');
        }
      });
    },
    //点忘记密码单击事件
    clickforgetpsw(){
      this.$emit('forgetpswFn', true);
    },
      
    refreshCode() {
      if (this.website.captchaMode) {
        getCaptcha().then(res => {
          const data = res.data;
          this.loginForm.key = data.key;
          this.loginForm.image = data.image;
        });
      }
    },
      
    showPassword() {
      this.passwordType === ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '');
    },
    submitLogin (form, done) {
      if (form.deptId !== '') {
        this.loginForm.deptId = form.deptId;
      }
      if (form.roleId !== '') {
        this.loginForm.roleId = form.roleId;
      }
      this.handleLogin();
      done();
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {

        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '登录中,请稍后。。。',
            spinner: 'el-icon-loading'
          });
          this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
            if (this.website.switchMode) {
              const deptId = this.userInfo.dept_id;
              const roleId = this.userInfo.role_id;
              if (deptId.includes(',') || roleId.includes(',')) {
                this.loginForm.deptId = deptId;
                this.loginForm.roleId = roleId;
                this.userBox = true;
                loading.close();
                return false;
              }
            }
            loading.close();
            //前提条件是有invalid_grant就要拦截 注册要拦截
            if (!this.isactivatedAccount && !this.registeredsuccess){
              //后端要求初始化数据
              activationData();
              //有电话去关键词分析，没有去信息页
              this.isPhone ? this.$router.push({ path: this.tagWel.value }) : this.$router.push({ path: 'info/index' });
            }              
          }).catch(() => {
            loading.close();
            this.refreshCode();
          });
        }
      });
    },
    getTenant() {
      const domain = getTopUrl();
      // 临时指定域名，方便测试
      //domain = "https://bladex.vip";
      info(domain).then(res => {
        const data = res.data;
        if (data.success && data.data.tenantId) {
          this.tenantMode = false;
          this.loginForm.tenantId = data.data.tenantId;
          this.$parent.$refs.login.style.backgroundImage = `url(${data.data.backgroundUrl})`;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.user-container {
  .sendagainspan {
    color: #419EFF;
    display: inline-block;
    margin-left: 10px;
    font-size: 14px;
    line-height: 14px;

    &:hover{
      cursor: pointer;
    }
  }
  .el-input__inner {
    padding: 0 30px;
    height: 34px;
  }

  .el-button {
    width: 100%;
    height: 34px;
    padding: 0;
    font-size: 14px;
    line-height: 34px;
  }

  .el-form-item {
    height: 35px;
  }
  .el-col{
    margin: 0;
  }

  .aspan{
    float: right;
    color: #419EFF;
  }

  .inactivespan {
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: #606266;
    line-height: 14px;
  }

  a{
    color: #419EFF;
  }

  img {
    border: 1px solid #DCDFE5;
    height: 33px;
    /* margin: 0 auto; */
    /* margin: 4px 10px; */
    float: right;
    margin: 2px 0;
    border-radius: 4px;
  }
}
</style>
