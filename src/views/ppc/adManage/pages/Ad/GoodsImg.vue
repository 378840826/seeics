<!-- 商品图片, 加载失败显示默认图片 -->
<template>
  <div class="img-container" :style="{ width: width, height: width }">
    <el-image :src="src" fit="contain" :alt="alt" class="img">
      <div slot="error" class="img-error">
        <img src="../../../../../../public/img/bg/logoseeics.png" :style="{ width: width }" />
        <span class="img-error-text">Failed</span>
      </div>
    </el-image>
  </div>
</template>

<script>
export default {
  name: 'GoodsImg',

  props: {
    src: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
    },
  },
};
</script>

<style scoped lang="scss">
.img-container {
  position: relative;
  background: #ebeef5;
}

.img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}

.img-error-text {
  color: #fff;
}
</style>
