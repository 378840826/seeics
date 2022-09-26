<!-- 广告树的选中的路径的面包屑导航  店铺 》广告活动 》广告组 -->
<template>
<div class="container">
  <!-- 店铺站点 -->
  <el-button
    @click="() => handleClick('store')"
    type="text"
    size="mini"
    class="name store"
  >
    {{ storeInfo.storeName }}/{{ storeInfo.marketplace }}
  </el-button>

  <i class="el-icon-d-arrow-right"></i>

  <!-- 广告活动 -->
  <el-button
    v-if="treeSelectedInfo.groupId"
    :title="treeSelectedInfo.campaignName"
    @click="() => handleClick('campaign')"
    type="text"
    size="mini"
    class="name"
  >
    {{ treeSelectedInfo.campaignName }}
  </el-button>
  <span v-else class="name">
    {{ treeSelectedInfo.campaignName }}
  </span>

  <!-- 广告组 -->
  <template v-if="treeSelectedInfo.groupId">
    <i class="el-icon-d-arrow-right"></i>
    <span type="text" size="mini" :title="treeSelectedInfo.groupName" class="name">
      {{ treeSelectedInfo.groupName }}
    </span>
  </template>
</div>
</template>

<script>
export default {
  name: 'PathCrumbs',

  props: {
    treeSelectedInfo: {
      type: Object,
      required: true,
    },
    storeInfo: {
      type: Object,
      required: true,
    },
  },

  methods: {
    // 点击名称跳转
    handleClick(type) {
      if (type === 'store') {
        this.$emit('jump', this.storeInfo);
      } else if (type === 'campaign') {
        this.$emit('jump', this.treeSelectedInfo);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  align-items: center;
  margin-top: 4px;

  .name {
    display: block;
    font-size: $textSize;
    white-space: normal;
    word-break: break-all;
    text-align: left;
    padding: 0;
    line-height: 1;
  }

  .store {
    white-space: nowrap;
  }
}

.el-icon-d-arrow-right {
  font-size: $textSize;
}
</style>
