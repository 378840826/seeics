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
          :type="passwordType"
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
    <div class="inactivespan" v-if="activatedAccount">
      账号未激活，请<a href="//mail.qq.com/" target="aaa">前往邮箱</a>激活
    </div>
  </div>
</div>
</template>
<script>
  import {mapGetters} from "vuex";
  import {info} from "@/api/system/tenant";
  import {getCaptcha} from "@/api/user";
  import {getTopUrl} from "@/util/util";

  export default {
    name: "userlogin",
    data() {
      return {
        //账号未激活
        activatedAccount: false,
        tenantMode: this.website.tenantMode,//是否开启租户模式
        forgetpaw:false,//忘记密码
        loginForm: {
          //租户ID
          tenantId: "000000",
          //部门ID
          deptId: "",
          //角色ID
          roleId: "",
          //用户名
          username: "",
          //密码
          password: "",
          //账号类型
          type: "account",
          //验证码的值
          code: "",
          //验证码的索引
          key: "",
          //七天免登录
          freelogin: false,
          //预加载白色背景
          image: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        },
        loginRules: {
          //第一期租户id固定000000，不显示
          /**         
          tenantId: [
            {required: false, message: "请输入租户ID", trigger: "blur"}
          ],
          */
          username: [
            {required: true, message: "请输入用户名", trigger: "blur"},
            //验证邮箱格式
            {pattern:/^\s*([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+\s*/,message: '邮箱格式不正确', trigger: "blur"}
          ],
          password: [
            {required: true, message: "请输入密码", trigger: "blur"},// eslint-disable-next-line
            {pattern: /(?!^[0-9]+$)(?!^[A-Za-z]+$)(?!^[^A-Za-z0-9]+$)^[`~!@#$%\^&*\(\)\-=_+\[\]\\\{\}:";'',./<>?|A-z0-9]{6,16}$/,message: '长度6~16，至少包含字母、数字和英文符号中的两种', trigger: "blur"},
          ],
          code: [
            {required: true, message: "请输入验证码", trigger: "blur"}
          ]
        },
        passwordType: "password",
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
                message: "请选择部门",
                trigger: "blur"
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
                message: "请选择角色",
                trigger: "blur"
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
    mounted() {
    },
    watch: {
      'loginForm.deptId'() {
        const column = this.findObject(this.userOption.column, "deptId");
        if (this.loginForm.deptId.includes(",")) {
          column.dicUrl = `/api/blade-system/dept/select?deptId=${this.loginForm.deptId}`;
          column.display = true;
        } else {
          column.dicUrl = '';
        }
      },
      'loginForm.roleId'() {
        const column = this.findObject(this.userOption.column, "roleId");
        if (this.loginForm.roleId.includes(",")) {
          column.dicUrl = `/api/blade-system/role/select?roleId=${this.loginForm.roleId}`;
          column.display = true;
        } else {
          column.dicUrl = '';
        }
      }
    },
    
    computed: {
      ...mapGetters(["tagWel", "userInfo", "isPhone"])
    },
    props: [],
    methods: {
      //点忘记密码单击事件
      clickforgetpsw(){
        this.$emit('forgetpswFn', true);
      },
      //将邮箱的值传回去
      emailCallback(){
        this.$emit('regsuccessFn', this.loginForm.username);  
      },
      
      refreshCode() {
        if (this.website.captchaMode) {
          getCaptcha().then(res => {
            const data = res.data;
            this.loginForm.key = data.key;
            this.loginForm.image = data.image;
          })
        }
      },
      
      showPassword() {
        this.passwordType === ""
          ? (this.passwordType = "password")
          : (this.passwordType = "");
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
              spinner: "el-icon-loading"
            });
            //将邮箱传回去
            this.emailCallback();
            this.$store.dispatch("LoginByUsername", this.loginForm).then(() => {
              if (this.website.switchMode) {
                const deptId = this.userInfo.dept_id;
                const roleId = this.userInfo.role_id;
                if (deptId.includes(",") || roleId.includes(",")) {
                  this.loginForm.deptId = deptId;
                  this.loginForm.roleId = roleId;
                  this.userBox = true;
                  loading.close();
                  return false;
                }
              }
              //判断是否有电话，有就去关键词分析，没有去个人信息
              this.isPhone ? this.$router.push({path: this.tagWel.value}) : this.$router.push({path: 'info/index'});      
              loading.close();
            }).catch(() => {
              loading.close();
              this.refreshCode();
            });
          }
        });
      },
      getTenant() {
        let domain = getTopUrl();
        // 临时指定域名，方便测试
        //domain = "https://bladex.vip";
        info(domain).then(res => {
          const data = res.data;
          if (data.success && data.data.tenantId) {
            this.tenantMode = false;
            this.loginForm.tenantId = data.data.tenantId;
            this.$parent.$refs.login.style.backgroundImage = `url(${data.data.backgroundUrl})`;
          }
        })
      }
    }
  };
</script>