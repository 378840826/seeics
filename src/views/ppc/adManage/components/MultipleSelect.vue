<!-- 支持多选/全选的下拉框 -->
<template>
<div class="container">
  <el-dropdown
    ref="refDropdown"
    @command="handleCommand" 
    placement="bottom-start" 
    :hide-on-click="false"
    trigger="click"
    @visible-change="handleVisibleChange"
    class="dropdown"
  >
    <div class="content-btn">
      <el-input
        readonly 
        class="dropdown-btn-input" 
        :placeholder="!showTags && placeholder" 
        size="mini"
      />
      <!-- tags -->
      <div class="tags" v-if="showTags && selectedList.length">
        <el-tag type="info" size="mini" class="tag-main" :title="selectedList[0].name">{{selectedList[0].name}}</el-tag>
        <el-tag v-if="selectedList.length > 1" type="info" size="mini">+{{selectedList.length - 1}}</el-tag>
      </div>
      <!-- 尾缀图标 -->
      <span slot="suffix" class="suffix-icons" :class="{hasTags: showTags}">
        <i class="el-icon-arrow-down" :class="{'is-reverse': visible}" />
        <i v-if="showTags" class="el-icon-circle-close" @click.stop="handleClickEmpty" />
      </span>
    </div>
    <el-dropdown-menu slot="dropdown">
      <div class="filter-input-container">
        <el-input ref="refFilterInput" v-model="filterText" placeholder="过滤选项" size="mini" />
      </div>
      <el-checkbox
        :indeterminate="isIndeterminate" 
        v-model="checkAll" 
        @change="handleCheckAllChange"
        class="check_all"
      >全选</el-checkbox>
      <!-- 复选框 -->
      <el-checkbox-group
        v-model="selectedIds" 
        @change="handleCheckedChange"
        class="checkbox-group"
      >
        <el-dropdown-item v-for="item in filteredList" :key="item.id">
          <el-checkbox :label="item.id">{{item.name}}</el-checkbox>
        </el-dropdown-item>
      </el-checkbox-group>
      <!-- footer -->
      <div class="footer">
        <el-button type="primary" size="mini" @click="handleOk">确定</el-button>
        <el-button size="mini" @click="handleCancel">取消</el-button>
      </div>
    </el-dropdown-menu>
  </el-dropdown>
</div>
</template>

<script>
export default {
  name: 'MultipleSelect',

  props: {
    list: {
      type: Object,
      required: true,
    },
    placeholder: {
      type: String,
    },
    noDataText: {
      type: String,
    },
  },

  data() {
    return {
      selectedIds: [],
      visible: false,
      showTags: false,
      filterText: '',
    };
  },

  computed: {
    isIndeterminate() {
      return this.selectedIds.length !== 0 && this.filteredList.length !== this.selectedIds.length;
    },

    checkAll() {
      return this.selectedIds.length === this.filteredList.length;
    },

    // 勾选的对象 list
    selectedList() {
      return this.filteredList.filter(item => this.selectedIds.includes(item.id));
    },

    // 筛选框输入过滤后显示的
    filteredList() {
      return this.list.filter(item => item.name.toLowerCase().includes(this.filterText.toLowerCase()));
    },
  },

  methods: {
    // 显隐下拉框
    handleVisibleChange(visible) {
      this.visible = visible;
      this.$nextTick(() => {
        visible && this.$refs.refFilterInput.focus();
      });
    },

    // 全选
    handleCheckAllChange(checked) {
      if (checked) {
        this.selectedIds = this.filteredList.map(item => item.id);
      } else {
        this.selectedIds = [];
      }
    },

    // 确定
    handleOk() {
      this.showTags = true;
      this.$emit('change', this.selectedIds, this.selectedList);
      this.$refs.refDropdown.hide();
    },

    // 取消
    handleCancel() {
      this.showTags = false;
      this.selectedIds = [];
      this.$refs.refDropdown.hide();
    },

    // 清空
    handleClickEmpty() {
      this.showTags = false;
      this.selectedIds = [];
      this.$refs.refDropdown.hide();
      this.$emit('change', this.selectedIds, this.selectedList);
    },

    // 清除勾选
    emptyChecked() {
      this.showTags = false;
      this.selectedIds = [];
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  position: relative;
}

.dropdown {
  width: 184px;
}

.filter-input-container {
  margin: 10px;
}

.tags {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 6px;
  display: flex;

  .tag-main {
    margin-right: 4px;
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.content-btn {
  .el-icon-circle-close {
    display: none;
  }

  .suffix-icons {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);

    i {
      cursor: pointer;
      font-size: 14px;
      transition: all .3s;
      color: #C0C4CC;
    }

    &.hasTags:hover {
      .el-icon-arrow-down {
        display: none;
      }

      .el-icon-circle-close {
        display: inline-block;
      }
    }
  }

  .el-icon-arrow-down {
    font-size: 14px;

    &.is-reverse {
      transform: rotate(-180deg);
    }
  }
}

.check_all {
  display: block;
  padding: 0 20px 8px 20px;
  border-bottom: 1px solid #DCDFE6;
  font-weight: 400;
}

.dropdown-btn-input {
  ::v-deep input {
    cursor: pointer !important;
  }
}

.checkbox-group {
  max-height: 200px;
  overflow: auto;

  li {
    line-height: 20px !important;
  }

  ::v-deep {
    .el-checkbox {
      display: block;
      font-weight: 400;

      span {
        font-size: $textSize;
      }
    }
  }
}

.footer {
  padding: 10px 0 0 20px;
  border-top: 1px solid #DCDFE6;
}
</style>
