<!-- 广告活动树 -->
<!-- 树的 key = "campaignState-campaignId-campaignTargetType-groupId-groupType" -->
<!-- 树的 key 例： "enabled-11111-auto-22222-keyword" -->
<!-- 其中广告活动节点的 key 为： "campaignState-campaignId-campaignTargetType" -->
<template>
  <div>
    <el-input
      placeholder="输入关键字过滤已加载的广告活动/广告组"
      v-model="filterText"
      class="input-tree-filter"
      size="mini"
    />
    <div class="tab-pane-roll">
      <el-tree
        :props="elTreeProps"
        :load="loadTreeNode"
        :filter-node-method="filterTreeNodeMethod"
        @current-change="handleTreeSelect"
        ref="treeRef"
        node-key="key"
        :current-node-key="treeSelectedKey"
        :default-expanded-keys=[expandedKey]
        lazy
        accordion
        highlight-current
      >
        <span slot-scope="{ node, data }">
        <i :class="stateIconDict[data.state]" />
        <span>{{ node.label }}</span>
      </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import {
  queryTreeCampaign,
  queryTreeGroup,
} from '@/api/ppc/adManage';
import { parseTreeKey } from '../utils/fun';
import { stateIconDict } from '../utils/dict';

export default {
  name: 'CampaignTree',

  props: {
    treeSelectedKey: {
      type: String,
    },
    storeId: {
      type: String,
      require: true,
    },
  },

  data() {
    return {
      stateIconDict,
      elTreeProps: {
        label: 'name',
        children: 'children',
        isLeaf: 'isLeaf',
      },
      filterText: '',
      expandedKey: '',
    };
  },

  methods: {
    // 广告树 load
    loadTreeNode(node, resolve) {
      // 第一级
      if (node.level === 0) {
        return resolve([
          { name: '已开启', value: 'enabled', id: 0, key: 'enabled' },
          { name: '已暂停', value: 'paused', id: 1, key: 'paused' },
          { name: '已归档', value: 'archived', id: 2, key: 'archived' },
        ]);
      }
      // 子节点
      if (node.level >= 1) {
        this.loadChildTreeNode(node, resolve);
      }
    },

    // 广告树子节点加载
    loadChildTreeNode(node, resolve) {
      // 父节点的详细参数
      const nodeParams = parseTreeKey(node.data.key);
      const params = {
        adStoreId: this.storeId,
        adType: 'sp',
        state: nodeParams.campaignState,
      };
      // 请求广告活动
      if (node.level === 1) {
        queryTreeCampaign(params).then(res => {
          const r = res.data.data.map(item => {
            // 增加 key 字段
            const key = `${nodeParams.campaignState}-${item.campaignId}-${item.targetingType}`;
            return {
              ...item,
              campaignName: item.name,
              campaignState: nodeParams.campaignState,
              key,
              isLeaf: false,
            };
          });
          resolve(r);
          // 此处是为了处理点击列表中广告活动名称跳转的情况
          this.$refs.treeRef.setCurrentKey(this.treeSelectedKey);
          const expandedCampaignKey = this.treeSelectedKey.split('-').slice(0, 3).join('-');
          this.expandedKey = expandedCampaignKey;
          this.scrollTreeToSelected();
        });
      } else if (node.level === 2) {
        // 请求广告组
        const groupParams = {
          ...params,
          campaignId: nodeParams.campaignId,
          state: null,
        };
        queryTreeGroup(groupParams).then(res => {
          const r = res.data.data.map(item => {
            // 增加 key 字段和 isLeaf
            const key = `${nodeParams.campaignState}-${nodeParams.campaignId}-${item.targetingType}-${item.groupId}-${item.groupType}`;
            return {
              ...item,
              campaignName: node.data.campaignName,
              campaignState: nodeParams.campaignState,
              groupName: item.name,
              groupId: item.groupId,
              key,
              isLeaf: true,
            };
          });
          resolve(r);
          // 此处是为了处理点击列表中广告活动名称跳转的情况
          this.$refs.treeRef.setCurrentKey(this.treeSelectedKey);
          this.scrollTreeToSelected();
        });
      }
    },
  
    // 广告树搜索
    filterTreeNodeMethod(value, data) {
      if (!value) {
        return true;
      }
      return data.name.indexOf(value) !== -1;
    },

    // 树切换选中的广告活动/广告组
    handleTreeSelect(data) {
      // 判断是否点击当前选中的
      if (data.key === this.treeSelectedKey) {
        return;
      }
      this.$emit('treeSelect', { ...data });
    },

    // 通过 key 刷新当前节点数据
    updateNode(key){
      const node = this.$refs.treeRef.getNode(key);
      // 触发loadNode函数
      node.loaded = false;
      node.expand();
    },

    // 更新广告活动的状态，通过 key 删除当前广告活动节点，并且刷新新的一级状态节点
    updateCampaignState(key, newParentKey){
      const node = this.$refs.treeRef.getNode(key);
      // 删除旧节点
      node && this.$refs.treeRef.remove(node);
      // 刷新新的状态节点
      this.updateNode(newParentKey);
    },

    // 更新广告组节点的数据
    updateGroupDate(key, newData) {
      const node = this.$refs.treeRef.getNode(key);
      node.data = {
        ...node.data,
        ...newData,
      };
    },

    // 树滚动到选中的广告活动/广告组位置
    scrollTreeToSelected() {
      setTimeout(() => {
        const selectrd = window.document.querySelector('.el-tree-node.is-current');
        const offsetTop = selectrd && selectrd.offsetTop;
        if (offsetTop) {
          const sider = window.document.querySelector('.tab-pane-roll');
          sider.scrollTo({
            top: offsetTop,
            behavior: 'smooth',
          });
        }
      }, 500);
    },
  },

  watch: {
    // 搜索树节点
    filterText(val) {
      this.$refs.treeRef.filter(val);
    },

    // 由于 elementUI 的 BUG，需要监听此值的变化后主动设置 current-node-key
    treeSelectedKey(val) {
      const selectedInfo = parseTreeKey(val);
      // 如果是广告组合树的 key，则只清空选中就行了
      if (!selectedInfo.campaignState) {
        this.$refs.treeRef.setCurrentKey(null);
        return;
      }
      this.$refs.treeRef.setCurrentKey(val);
      // 展开父节点，（面包屑导航或url跳转到指定广告活动广告组时需要展开对应的父节点）
      let parentKys = '';
      if (selectedInfo.groupId) {
        parentKys = `${selectedInfo.campaignState}-${selectedInfo.campaignId}-${selectedInfo.targetingType}`;
      } else if (selectedInfo.campaignId) {
        parentKys = selectedInfo.campaignState;
      }
      if (parentKys 
        && this.$refs.treeRef.store.nodesMap[parentKys] 
        && this.$refs.treeRef.store.nodesMap[parentKys].expanded === false) {
        this.$refs.treeRef.store.nodesMap[parentKys].expanded = true;
      }
      // 此处是为了处理点击列表中广告活动名称跳转的情况 先展开状态节点加载广告活动, 请求广告活动成功后再展开广告活动节点
      if (this.$refs.treeRef.store.nodesMap[val] && !selectedInfo.groupId) {
        // this.expandedKey = val 用于替补 loadChildTreeNode 中的展开(因为如果当前父节点已经展开过，也就是已经请求了子节点，则不会走 loadChildTreeNode 代码了)
        // 如果是广告组，则不展开了，展开父节点就行
        this.expandedKey = val;
      } else {
        this.expandedKey = selectedInfo.campaignState;
      }
      // 树滚动到选中的位置
      this.scrollTreeToSelected();
    },
  },
};
</script>

<style scoped lang="scss">
.tab-pane-roll {
  overflow: auto;
  height: calc(100vh - 300px);
}

.input-tree-filter {
  margin-bottom: 10px;
}

::v-deep {
  // 树节点
  .el-tree-node {
    white-space: normal;
    word-break: break-all;

    .el-tree-node__content {
      height: auto;
      line-height: 18px;
      padding: 6px 0;
    }
  }

  // 开启图标
  .el-icon-video-play {
    margin-right: 2px;
    color: $successColor;
  }

  // 暂停图标
  .el-icon-video-pause {
    margin-right: 2px;
    color: $danger;
  }

  // 归档图标
  .el-icon-folder-remove {
    margin-right: 2px;
    color: $disabledColor;
  }
}
</style>
