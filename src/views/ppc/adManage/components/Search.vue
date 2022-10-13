<!-- 搜索框 -->
<template>
  <el-input
    :placeholder="placeholder"
    v-model="value"
    :maxlength="maxlength"
    class="input"
    size="mini"
    clearable
  >
    <el-button
      slot="append"
      icon="el-icon-search"
      @click="handleSearch"
    ></el-button>
  </el-input>
</template>

<script>
export default {
  name: 'Search',

  props: {
    placeholder: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    maxlength: {
      type: Number,
    },
  },

  data() {
    return {
      // value: '',
    };
  },

  methods: {
    // 点击搜索
    handleSearch() {
      console.log('Search搜索', this.value );
      this.$emit('search', this.value);
    },
  },
};
</script>

<style scoped lang="scss">
.input {
  width: 240px;

  ::v-deep {
    .el-input-group__append {
      padding: 0 16px;
      background-color: $primaryColor;
      border-color: $primaryColor;
      color: #fff;
    }
  }
}
</style>
