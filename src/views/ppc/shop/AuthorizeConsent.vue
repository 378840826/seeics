<!-- 店铺绑定-登录亚马逊并授权成功后的回调页面 -->
<template>
  <div class="container">
    <div class="logo">
      <img src="/img/bg/logoseeics.png">
    </div>
    <div class="content">
      <div v-if="loading" class="result">
        正在绑定,请稍后...
      </div>
      <div v-else class="result">
        <div v-if="success">
          <i class="icon el-icon-success"></i>
          <div>{{ msg }}</div>
        </div>
        <div v-else>
          <i class="icon el-icon-error"></i>
          <div>{{ msg }}</div>
        </div>
        <el-button
          type="primary"
          class="btn"
          @click="handleClick"
        >
          返回店铺列表
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthorizeConsent',

  mounted() {
    this.bind();
  },

  data() {
    return {
      loading: true,
      success: false,
      msg: '正在绑定,请稍后...'
    };
  },

  methods: {
    bind() {
      const query = this.$route.query;
      console.log('query:', query);
      if (!query.spapi_oauth_code) {
        this.loading = false;
        this.msg = '没有授权数据!';
        return;
      }
      const state = JSON.parse(query.state);
      this.$router.replace('');
      // 请求添加店铺
      this.$store.dispatch('bindShop', {
        sellerId: query.selling_partner_id,
        code: query.spapi_oauth_code,
        ...state,
        // 亚马逊返回的原始信息
        raw: query,
      }).then(res => {
        this.success = true;
        this.msg = `${res.data.msg || '绑定成功'}。请给店铺进行广告授权`;
      }, err => {
        console.error('添加绑定店铺失败: ', err);
        this.msg = '绑定店铺失败! 请稍后重试';
        this.success = false;
      }).finally(() => {
        this.loading = false;
      });
    },

    handleClick() {
      this.$router.push('/ppc/shop');
    },
  },
};
</script>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
    color: #555;
    background: #f0f2f5;
  }

  .logo {
    padding: 10px;
    background: rgb(16, 31, 55);
  }

  .content {
    margin-top: 100px;
  }

  .result {
    text-align: center;
  }

  .icon {
    display: block;
    text-align: center;
    font-size: 50px;
    margin-bottom: 20px;
  }

  .el-icon-success {
    color: #67c23a
  }

  .el-icon-error {
    color: #f56c6c
  }

  .btn {
    margin-top: 20px;
  }

</style>