<!-- 广告组合下的广告活动树 -->
<template>
  <el-tree
    :props="elTreeProps"
    :load="loadTreeNode"
    @current-change="handleTreeSelect"
    ref="treeRef"
    node-key="key"
    :current-node-key="treeSelectedKey"
    lazy
    accordion
    highlight-current
  >
    <div slot-scope="{ node, data }">
      <!-- 编辑状态 -->
      <template v-if="node.isEdit">
        <el-input
          v-model="data.name"
          autofocus
          size="mini"
          :ref="`slotTreeInput${data[NODE_KEY]}`"
          @blur.stop="handleEditComplete(node, data)"
          @keyup.enter.native="handleEditComplete(node, data)"
        ></el-input>
      </template>
      <!-- 非编辑状态 -->
      <template v-else>
        <span>
          <i :class="stateIconDict[data.state]" />
          <span>{{ node.label }}</span>
        </span>
        <i
          v-if="data.id"
          class="el-icon-edit portfolio-edit-icon"
          @click.stop="handleClickEdit(node, data)"
          title="修改名称"
        />
      </template>
    </div>
  </el-tree>
</template>

<script>
import {
  queryTreeCampaign,
  queryTreeGroup,
} from '@/api/ppc/adManage';
import { parseTreeKey } from '../utils/fun';
import { stateIconDict } from '../utils/dict';
// import { log } from '@/util/util';

export default {
  name: 'PortfolioCampaignTree',

  props: {
    portfolioList: {
      type: Object,
      require: true,
    },
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
      // 编辑时的旧名称，用于比较是否修改了
      editNameOld: '',
    };
  },

  methods: {
    // 广告树 load
    loadTreeNode(node, resolve) {
      // 第一级
      if (node.level === 0) {
        const list = this.portfolioList.map(item => ({
          name: item.name, value: item.id, id: item.id, key: String(item.id),
        }));
        return resolve(list);
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
        portfolioId: nodeParams.portfolioId,
      };
      // 请求广告活动
      if (node.level === 1) {
        queryTreeCampaign(params).then(res => {
          const r = [];
          res.data.data.forEach(item => {
            // 过滤掉已归档的广告活动
            if (item.state !== 'archived') {
              // 增加 key 字段
              const key = `${nodeParams.portfolioId}-${item.campaignId}-${item.targetingType}`;
              r.push({
                ...item,
                campaignName: item.name,
                key,
              });
            }
          });
          resolve(r);
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
            const key = `${nodeParams.portfolioId}-${nodeParams.campaignId}-${item.targetingType}-${item.groupId}-${item.groupType}`;
            return {
              ...item,
              campaignName: node.data.campaignName,
              groupName: item.name,
              key,
              isLeaf: true,
            };
          });
          resolve(r);
        });
      }
    },

    // 点击编辑图标
    handleClickEdit(node, data) {
      console.log('点击编辑图标');
      if (!node.isEdit) {
        this.$set(node, 'isEdit', true);
        this.editNameOld = data.name;
      }
      // 输入框获取焦点
      this.$nextTick(() => {
        if (this.$refs[`slotTreeInput${data[this.NODE_KEY]}`]) {
          this.$refs[`slotTreeInput${data[this.NODE_KEY]}`].$refs.input.focus();
        }
      });
    },

    // 保存编辑，退出编辑状态
    handleEditComplete(node, data) {
      if (node.isEdit) {
        this.$set(node, 'isEdit', false);
        // 判断是否未修改
        if (data.name.trim() === this.editNameOld.trim()) {
          this.$message.warning('未修改名称');
        } else {
          // 判断是否已存在相同的名称
          const duplicateName = this.portfolioList.find(item => item.name === data.name.trim());
          if (duplicateName) {
            this.$message.error('广告组合名称已存在，请重新输入');
            // 重置 node 节点
            this.$set(node.data, 'name', this.editNameOld);
          } else {
            this.$emit('saveEditName', { ...data }, res => {
              if (!res) {
                // 失败时名称改回旧的
                this.$set(node.data, 'name', this.editNameOld);
              }
            });
          }
        }
      }
    },
  
    // 树切换选中的广告活动/广告组
    handleTreeSelect(data) {
      // 判断是否点击当前选中的
      if (data.key === this.treeSelectedKey) {
        return;
      }
      const selectedInfo = parseTreeKey(data.key);
      this.$emit('treeSelect', { ...data, portfolioId: selectedInfo.portfolioId });
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
  },

  watch: {
    // 由于 elementUI 的 BUG，需要监听此值的变化后主动设置 current-node-key
    treeSelectedKey(val) {
      const selectedInfo = parseTreeKey(val);
      // 如果是状态树的 key，则只清空选中就行了
      if (!selectedInfo.portfolioId) {
        this.$refs.treeRef.setCurrentKey(null);
        return;
      }
      this.$refs.treeRef.setCurrentKey(val);
      // 展开父节点，（面包屑导航或url跳转到指定广告活动广告组时需要展开对应的父节点）
      let parentKys = '';
      if (selectedInfo.groupId) {
        parentKys = `${selectedInfo.portfolioId}-${selectedInfo.campaignId}-${selectedInfo.targetingType}`;
      } else if (selectedInfo.campaignId) {
        parentKys = selectedInfo.portfolioId;
      }
      if (parentKys && this.$refs.treeRef.store.nodesMap[parentKys].expanded === false) {
        this.$refs.treeRef.store.nodesMap[parentKys].expanded = true;
      }
    },
  },
};
</script>

<style scoped lang="scss">
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

  // 编辑图标
  .portfolio-edit-icon {
    // display: none;
    margin-left: 6px;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    &:hover {
      color: $primaryColor;
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
