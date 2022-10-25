<template>
  <div class="sortBox">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="分类" name="first">
        <category/>
      </el-tab-pane>
      
      <el-tab-pane label="商品" name="second">
        <!-- <price-tab/> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import Category from '../Category.vue';
// import PriceTab from './PriceTab.vue';

export default {

  components: {
    Category,
    // PriceTab
  },
   
  data() {
    return {
      activeName: 'first',
    };
  }
};
</script>

<style lang="scss" scoped>

  .sortBox {
    margin-top: 20px;
    // height: 400px;
    background-color: rgba(242, 242, 242, 1);
  }

</style>
