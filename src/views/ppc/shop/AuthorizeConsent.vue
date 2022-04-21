<!-- 店铺绑定-登录亚马逊并授权成功后的回调页面 -->
<template>
  <div>
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
    };
  },

  methods: {
    bind() {
      const query = this.$route.query;
      const state = JSON.parse(query.state);
      this.$router.replace('');
      // 请求添加店铺广告授权
      this.$store.dispatch('bindShop', {
        sellerId: query.selling_partner_id,
        code: query.spapi_oauth_code,
        ...state,
        // 亚马逊返回的原始信息
        raw: query,
      }).then(res => {
        this.$alert(`${res.data.msg}。请给店铺进行广告授权`, '店铺授权结果', {
          showClose: false,
          callback: () => {
            this.$router.push('/ppc/shop');
          },
        });
      });
    },
  },
};
</script>
