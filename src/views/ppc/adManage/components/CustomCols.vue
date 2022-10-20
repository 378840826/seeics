<!-- 自定义列 -->
<!-- 数据存储在 localStorage 中 -->
<template>
  <el-dropdown :hide-on-click="false" trigger="click" class="container">
    <el-button size="mini">
      自定义列<i class="el-icon-arrow-down el-icon--right"></i>
    </el-button>
    <el-dropdown-menu slot="dropdown">
      <div class="_ad_mamage-custom_cols-dropdown">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll" 
          @change="handleCheckAllChange"
          class="_ad_mamage-custom_cols-check_all"
        >全选</el-checkbox>
        <el-checkbox-group
          v-model="checkedKeys"
          class="_ad_mamage-custom_cols-group"
        >
          <el-checkbox
            v-for="item in colOptions" 
            :label="item" 
            :value="item" 
            :key="item"
          >{{item}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { setStore, getStore } from '@/util/store';

export default {
  name: 'CustomCols',

  props: {
    localStorageKey: {
      type: String,
      required: true,
    },

    colOptions: {
      type: Array,
      required: true,
    },
  },

  created() {
    // 若是第一次加载，设一个对象用于存储自定义列数据，并设数据为全部 col
    if (!getStore({ name: this.localStorageKey })) {
      const content = this.colOptions;
      setStore({ name: this.localStorageKey, content });
    }
  },

  computed: {
    isIndeterminate() {
      return this.checkedKeys.length !== 0 && this.checkedKeys.length !== this.colOptions.length;
    },

    checkAll() {
      return this.checkedKeys.length === this.colOptions.length;
    },
  },

  data() {
    return {
      // localStorage 没有数据则设数据为全选
      checkedKeys: getStore({ name: this.localStorageKey }) || [...this.colOptions],
    };
  },

  methods: {
    // 全选
    handleCheckAllChange(val) {
      if (val) {
        this.checkedKeys = [...this.colOptions];
      } else {
        this.checkedKeys = [];
      }
    },
  },

  watch: {
    checkedKeys: {
      immediate: true,
      handler(val){
        this.$emit('change', val);
        // 存储
        setStore({ name: this.localStorageKey, content: val });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  margin-left: 12px;
}
</style>

<style lang="scss">
._ad_mamage-custom_cols-dropdown {
  ._ad_mamage-custom_cols-check_all {
    display: block;
    padding: 6px 10px;
    border-bottom: 1px solid #eee;

    .el-checkbox__label {
      font-size: $textSize;
    }
  }

  ._ad_mamage-custom_cols-group {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: 260px;
    height: 300px;

    .el-checkbox {
      padding: 4px 10px;
    }

    .el-checkbox__label {
      font-size: $textSize;
    }
  }
}

</style>