<!-- 广告组 -->
<template>
  <div>广告组组件</div>
</template>

<script>

export default {
  name: 'Group',

  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {

    };
  },

  methods: {
    // 取消
    handleCancel() {
      this.$emit('cancel', false);
    },
  },
};
</script>
