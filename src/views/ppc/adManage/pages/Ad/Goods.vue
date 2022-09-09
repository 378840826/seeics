<!-- 表格td中的商品展示 -->
<template>
  <div class="goods-container">
    <GoodsImg :src="goodsInfo.imageUrl" width="40px" />
    <div class="goods-info">
      <div class="goods-title-line">
        <i class="el-icon-link"></i>
        <el-link
          :href="getAmazonAsinUrl(goodsInfo.asin, goodsInfo.marketplace)"
          type="primary"
          class="goods-title"
          :title="goodsInfo.title"
          :underline="false"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ goodsInfo.title }}
        </el-link>
      </div>
      <div>{{ goodsInfo.asin }}</div>
      <div>{{ goodsInfo.sku }}</div>
    </div>
  </div>
</template>

<script>
import { getAmazonAsinUrl } from '@/views/ppc/util.js';
import GoodsImg from './GoodsImg';

export default {
  name: 'Goods',

  components: {
    GoodsImg,
  },

  props: {
    goodsInfo: {
      type: Object,
      required: true,
    },
  },

  methods: {
    getAmazonAsinUrl,
  },
};
</script>

<style scoped lang="scss">
.goods-container {
  display: flex;
  align-items: center;
  text-align: left;

  .goods-info {
    display: flex;
    flex-direction: column;
    margin-left: 10px;

    & > div {
      line-height: 16px;
    }
  }

  .goods-title-line {
    white-space: nowrap;

    ::v-deep {
      .el-link--inner {
        width: 200px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: $textSize;
        font-weight: 400;
      }
    }
    
    &:hover {
      i {
        color: $linkColor;
      }
    }
  }

  .goods-title {
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 0;
  }
}
</style>
