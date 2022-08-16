<template>
  <div class="sortBox">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="分类" name="first">
        <category/>
      </el-tab-pane>
      
      <el-tab-pane label="商品" name="second">配置管理</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import Category from './Category.vue';

export default {

  components: {
    Category
  },
   
  data() {
    return {
      activeName: 'first',
    };
  }
}
</script>

<style lang="scss" scoped>

  .sortBox {
    margin-top: 20px;
    height: 290px;
    background-color: rgba(242, 242, 242, 1);
  }

</style>
