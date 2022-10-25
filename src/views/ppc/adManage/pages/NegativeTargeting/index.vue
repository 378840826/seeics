<!-- 否定商品 -->
<template>
<div class="container">
<!-- 筛选栏 -->
<div class="filter-bar">
  <Search
    placeholder="ASIN"
    :value="filter.search"
    @search="handleSearch"
  />

  <el-select
    v-model="filter.state"
    clearable
    placeholder="状态"
    :size="size"
    class="filter-select"
    @change="handleStateChange"
  >
    <el-option label="开启" value="enabled" />
    <el-option label="归档" value="archived" />
  </el-select>
</div>

<!-- 工具栏 -->
<div class="toolbar">
  <div>
    <el-button
      type="primary"
      @click="createDialogVisible = true"
      :size="size"
    >添加否定商品</el-button>

    <el-button
      @click="handleBatchArchived()"
      :disabled="!tableSelected.length"
      :size="size"
    >归档</el-button>
  </div>
</div>

<!-- 表格 -->
<div class="table-container">
  <el-table
    :data="tableData"
    v-loading="tableLoading"
    tooltip-effect="dark"
    :height="tableHeight"
    empty-text="没有查询到数据，请修改查询条件"
    @selection-change="handleSelectionChange"
    @sort-change="handleSortChange"
    border
    :size="size"
  >
    <el-table-column type="selection" width="55" :selectable="selectableInit" />

    <el-table-column prop="state" label="状态" width="94">
      <span slot-scope="{row}" :class="row.state">{{ stateNameDict[row.state]}}</span>
    </el-table-column>

    <el-table-column prop="targeting" label="商品" sortable="custom">
    </el-table-column>

    <!-- 树选中广告活动时，显示广告组列 -->
    <el-table-column v-if="!treeSelectedInfo.groupId" prop="groupName" label="广告组">
    </el-table-column>

    <el-table-column prop="addTime" label="添加时间" width="120" sortable="custom">
      <template slot="header">
        <span>
          添加时间
          <el-tooltip effect="dark" content="北京时间" placement="top">
            <i class="el-icon-info icon-time_info"></i>
          </el-tooltip>
        </span>
      </template>
      <span slot-scope="{row}" class="td_date_time">{{ row.addTime }}</span>
    </el-table-column>
  </el-table>

  <!-- 分页器 -->
  <el-pagination
    :disabled="tableLoading"
    @current-change="getList()"
    @size-change="getList({ current: 1 })"
    :current-page.sync="tablePageOption.currentPage"
    :page-size.sync="tablePageOption.pageSize"
    :total="tablePageOption.total"
    :page-sizes="tablePageOption.pageSizes"
    background
    layout="total, sizes, prev, pager, next, jumper"
    class="pagination"
  />
</div>
</div>
</template>

<script>
import {
  queryNeTargetingList,
  archiveNeTargeting,
} from '@/api/ppc/adManage';
import { stateNameDict } from '../../utils/dict';
import { tablePageOption } from '../../utils/options';
// import { log } from '@/util/util';
import Search from '../../components/Search';
import {
  formatTableSortParams,
  parseTreeKey,
} from '../../utils/fun';

export default {
  name: 'NegativeTargeting',

  components: {
    Search,
  },

  props: {
    marketplace: {
      type: String,
      required: true,
    },
    storeId: {
      type: String,
      required: true,
    },
    treeSelectedKey: {
      type: String,
    },
  },

  data: function() {
    return {
      size: 'mini',
      stateNameDict,
      filter: {
        search: '',
        state: '',
      },
      tableHeight: 'calc(100vh - 326px)',
      tableData: [],
      tableSelected: [],
      tableLoading: false,
      tablePageOption: { ...tablePageOption },
      tableSort: { prop: 'addTime', order: 'descending' },
      createDialogVisible: false,
    };
  },

  computed: {
    // 广告树选中的节点信息
    treeSelectedInfo() {
      const treeSelectedInfo = parseTreeKey(this.treeSelectedKey);
      return treeSelectedInfo;
    },
  },

  created() {
    this.getList();
  },

  methods: {
    formatTableSortParams,
    // 获取列表
    getList(query, body) {
      this.tableLoading = true;
      // 排序参数格式化
      const sortParams = this.formatTableSortParams(this.tableSort);
      const queryParams = {
        current: this.tablePageOption.currentPage,
        size: this.tablePageOption.pageSize,
        ...sortParams,
        ...query,
      };
      const bodyParams = {
        adStoreId: this.storeId,
        adType: 'sp',
        campaignId: this.treeSelectedInfo.campaignId,
        groupId: this.treeSelectedInfo.groupId,
        state: this.filter.state ? [this.filter.state] : [],
        search: this.filter.search,
        ...body,
      };
      queryNeTargetingList(queryParams, bodyParams).then(res => {
        this.tableData = res.data.data.records;
        this.tablePageOption.total = res.data.data.total;
        this.tablePageOption.currentPage = res.data.data.current;
        this.tablePageOption.pageSize = res.data.data.size;
      }).finally(() => {
        this.tableLoading = false;
      });
    },

    // 点击搜索
    handleSearch(val) {
      this.filter.search = val;
      this.filter.state = '';
      this.getList({ current: 1 });
    },

    // 状态筛选
    handleStateChange(val) {
      this.filter.state = val;
      this.getList({ current: 1 });
    },

    // 表格排序变化
    handleSortChange(val) {
      this.tableSort = { prop: val.prop, order: val.order };
      // 排序后回到第一页
      this.tablePageOption.currentPage = 1;
      this.getList();
    },

    // 表格行是否可勾选
    selectableInit(row) {
      let flag = true;
      if (row.state === 'archived') {
        flag = false;
      }
      return flag;
    },

    // 表格勾选变化
    handleSelectionChange(val) {
      this.tableSelected = val;
    },

    // 批量修改页面表格数据
    updateTableData(ids, newData) {
      ids.forEach(id => {
        const index = this.tableData.findIndex(data => data.targetId === id);
        this.tableData.splice(index, 1, {
          ...this.tableData[index],
          ...newData,
        });
      });
    },

    // 批量归档
    batchArchived(list) {
      // 区分广告活动下的和广告组下的，接口不同，参数不同
      let params = {};
      const ids = list.map(item => item.targetId);
      if (this.treeSelectedInfo.groupId) {
        // 广告组下
        params = {
          storeId: this.storeId,
          campaignId: this.treeSelectedInfo.campaignId,
          groupId: this.treeSelectedInfo.groupId,
          neTargetIds: ids,
        };
      } else {
        // 广告活动下
        params = {
          storeId: this.storeId,
          campaignId: this.treeSelectedInfo.campaignId,
          archiveIds: list.map(item => (
            { groupId: item.groupId, neTargetId: item.targetId, }
          )),
        };
      }
      archiveNeTargeting(params).then(res => {
        const { success, fail } = res.data.data;
        // 有失败的，或全部失败
        if (fail.length) {
          let msg = '';
          if (fail.length === ids.length) {
            // 全部失败
            msg = '操作失败';
          } else {
            // 部分失败部分成功
            msg = '部分归档失败';
          }
          const createElement = this.$createElement;
          const contentElement = fail.map(item => {
            return createElement('div', null, [
              `${item.name}：`,
              createElement('span', { class: '_adManage-error-msgbox-msg' }, item.errorMsg),
            ]);
          });
          this.$msgbox({
            title: msg,
            customClass: '_adManage-error-msgbox-container',
            confirmButtonText: '确定',
            showCancelButton: false,
            showClose: false,
            closeOnClickModal: false,
            message: createElement('div', { class: '_adManage-error-msgbox' }, contentElement),
          });
        } else {
          this.$message({
            type: 'success',
            message: '操作成功',
          });
        }
        const successIds = success.map(item => item.id);
        this.updateTableData(successIds, { state: 'archived' });
      });  
    },

    // 批量归档
    handleBatchArchived() {
      this.$confirm('归档后不可重新开启，确定要归档吗？', '警告', {
        type: 'warning',
        callback: (action) => {
          if (action === 'confirm') {
            this.batchArchived(this.tableSelected);
          }
        }
      });
    },
  },

  watch: {
    treeSelectedKey() {
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
  @import "../common.scss";
</style>

<style lang="scss">
  @import "../commonGlobal.scss";
</style>
