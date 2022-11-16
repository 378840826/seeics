<!-- 弹窗标题路径 广告活动》广告组》广告/关键词 等 -->
<template>
  <div class="data_charts-title">
    <span v-for="(item, index) in namePath" :key="item">
      {{ item }}
      <i v-if="index !== namePath.length - 1" class="el-icon-d-arrow-right arrow"></i>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    /** 按 [广告活动, 广告组, 广告/关键词等] 的顺序 */
    namePath: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.data_charts-title {
  font-size: $textSize;
  color: $textColor;

  span:last-child {
    color: $primaryColor;
  }
}

.el-icon-d-arrow-right {
  color: #ccc;
}
</style>
