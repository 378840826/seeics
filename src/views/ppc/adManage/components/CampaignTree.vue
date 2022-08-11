<!-- 广告活动树 -->
<!-- 树的 key = "广告活动开启状态-广告活动id-广告组id" -->
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
        lazy
        accordion
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
import { log } from '@/util/util';

export default {
  name: 'CampaignTree',

  props: {
    treeSelectedKey: {
      type: String,
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
      treeSelect: '',
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
      // 请求广告活动
      if (node.level === 1) {
        queryTreeCampaign().then(res => {
          const r = res.data.data.records.map(item => {
            // 增加 key 字段
            const key = `${nodeParams.camState}-${item.id}`;
            return {
              ...item,
              key,
            };
          });
          resolve(r);
        });
      } else if (node.level === 2) {
        // 请求广告组
        queryTreeGroup().then(res => {
          const r = res.data.data.records.map(item => {
            // 增加 key 字段和 isLeaf
            const key = `${nodeParams.camState}-${nodeParams.camId}-${item.id}`;
            return {
              ...item,
              key,
              isLeaf: true,
            };
          });
          resolve(r);
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
    handleTreeSelect(data, treeNode) {
      // 判断是否点击当前选中的
      if (this.treeSelect !== null
        && this.treeSelect.id === data.id
        && this.treeSelect.level === treeNode.level) {
        return;
      }
      // console.log('树切换选中,data,treeNode', data, treeNode);
      this.treeSelect = { ...data, level: treeNode.level };
    },
  },

  watch: {
    // 搜索树节点
    filterText(val) {
      this.$refs.treeRef.filter(val);
    },

    // 树节点选中切换
    treeSelect(val) {
      // log('watch treeSelect', val);
      this.$emit('treeSelect', val);
    },

    // 由于 elementUI 的 BUG，需要监听此值的变化后主动设置 current-node-key
    treeSelectedKey(val) {
      log('watch props treeSelectedKey', val);
      this.$refs.treeRef.setCurrentKey(val);
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
