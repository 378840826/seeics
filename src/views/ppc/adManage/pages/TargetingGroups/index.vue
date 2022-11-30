<!-- 投放组 -->
<!-- 其实就是自动广告的 targeting 设置 -->
<template>
<div class="container">
<!-- 工具栏 -->
<div class="toolbar">
  <div>
    <div>
      <el-select
        v-model="filter.state"
        clearable
        multiple
        placeholder="状态"
        :size="size"
        class="filter-state-select"
        @change="handleStateChange"
      >
        <el-option
          v-for="(val,key) in stateNameDict"
          :key="key"
          :label="val"
          :value="key"
        />
      </el-select>
    </div>
    <div class="batch_state">
      批量操作：
      <el-button-group>
        <el-button
          @click="handleBatchState('enabled')"
          :disabled="!tableSelected.length"
          :size="size"
        >开启</el-button>
        <el-button
          @click="handleBatchState('paused')"
          :disabled="!tableSelected.length"
          :size="size"
        >停用</el-button>
      </el-button-group>
      <el-button
        :disabled="!tableSelected.length"
        @click="batchBidDialogVisible = true"
        :size="size"
      >调整竞价</el-button>
    </div>
  </div>

  <div>
    <DatePicker :defaultValue="filter.dateRange" @change="handleDateRangeChange" />
    <CustomCols
      localStorageKey="app-adMamage-targetingGroups-customCol"
      :colOptions=customColsOptions
      @change="val => customCols = val"
    />
  </div>
</div>
<!-- 表格 -->
<div class="table-container">
  <el-table
    ref="refTable"
    :data="tableData"
    v-loading="tableLoading"
    tooltip-effect="dark"
    :height="tableHeight"
    empty-text="没有查询到数据，请修改查询条件"
    @selection-change="handleSelectionChange"
    @sort-change="handleSortChange"
    @row-click="handleRowClick"
    border
    show-summary
    :summary-method="({columns}) => summaryMethod(columns, tableTotalData)"
    :size="size"
  >
    <el-table-column type="selection" width="55" :selectable="selectableInit" />

    <el-table-column prop="state" label="状态" width="94" fixed>
      <template slot-scope="{row}">
        <el-switch
          v-if="row.state !== 'archived'"
          :value="row.state === 'enabled'"
          @change="v => handleSwitchState(v, row)"
          active-color="#13ce66"
        />
        <span v-else class="archived">已归档</span>
      </template>
    </el-table-column>

    <el-table-column prop="target" label="投放组" width="90" fixed />

    <el-table-column
      v-if="customCols.includes('所属广告组') && !treeSelectedInfo.groupId" 
      prop="groupName" 
      label="所属广告组" 
      min-width="200"
      sortable="custom"
    >
      <div slot-scope="{row}">
        <i :class="`${stateIconDict[row.groupState]} ${row.groupState}`" />
        <template v-if="row.campaignState !== 'archived' && row.groupState !== 'archived'">
          <span class="link_name" @click="handleClickName(row, 'group')">{{ row.groupName }}</span>
        </template>
        <template v-else>
          {{ row.groupName }}
        </template>
      </div>
    </el-table-column>

    <el-table-column
      v-if="!treeSelectedInfo.campaignId" 
      prop="campaignName" 
      label="广告活动" 
      min-width="200"
      sortable="custom"
    >
      <div slot-scope="{row}">
        <i :class="`${stateIconDict[row.campaignState]} ${row.campaignState}`" />
        <template v-if="row.campaignState !== 'archived'">
          <span class="link_name" @click="handleClickName(row, 'campaign')">{{ row.campaignName }}</span>
        </template>
        <template v-else>
          {{ row.campaignName }}
        </template>
      </div>
    </el-table-column>

    <el-table-column 
      v-if="customCols.includes('建议竞价')" 
      prop="recommendBid" 
      label="建议竞价" 
      width="150"
    >
      <template slot-scope="{row}">
        <div v-if="row.recommendBid" class="suggested_bid">
          <div>
            {{ row.recommendBid }}
            <el-button
              v-if="row.state !== 'archived'"
              @click="handleApplySuggestedBid(row)"
              :size="size"
              class="btn-apply_suggested_bid"
            >应用</el-button>
            </div>
          <div>
            ({{ getValueLocaleString({ value: row.recommendBidStart, isFraction: true, prefix: currency }) }}
            -
            {{ getValueLocaleString({ value: row.recommendBidEnd, isFraction: true, prefix: currency }) }})
          </div>
        </div>
        <div v-else>—</div>
      </template>
    </el-table-column>

    <el-table-column v-if="customCols.includes('竞价')" prop="bid" label="竞价" width="100">
      <div slot-scope="{row}">
        {{ getValueLocaleString({ value: row.bid, isFraction: true, prefix: currency }) }}
        <i v-if="row.state !== 'archived'" class="el-icon-edit table-edit-icon"></i>
      </div>
    </el-table-column>

    <el-table-column v-if="customCols.includes('智能竞价')" prop="intelligenceBid" label="智能竞价" width="100">
      <div slot-scope="{row}">
        {{ getValueLocaleString({ value: row.intelligenceBid, isFraction: true, prefix: currency }) }}
      </div>
    </el-table-column>

    <template v-for="item in commonColOption">
      <el-table-column
        v-if="customCols.includes(item.label)"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        sortable="custom"
      >
        <span slot-scope="{row}">{{ item.formatter(row[item.prop]) }}</span>
      </el-table-column>
    </template>

    <!-- 操作 -->
    <el-table-column label="操作" fixed="right" width="60">
      <template slot-scope="{row}">
        <el-button
          @click="handleCharts(row)"
          type="text"
          :size="size"
        >分析</el-button>
      </template>
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

<!-- 编辑弹窗 -->
<EditDialog
  v-if="editDialogVisible"
  :visible.sync="editDialogVisible"
  :data="editData"
  :editKey="editKey"
  :currency="currency"
  @save="handleEditSave"
/>

<!-- 数据分析弹窗 -->
<DataCharts
  v-if="dataChartsVisible"
  :visible.sync="dataChartsVisible"
  :currency="currency"
  :rowData="dataChartsRow"
  :namePath="dataChartsNamePath"
  pageType="targetingGroup"
/>

<!-- 批量调整竞价弹窗 -->
<BatchBidDialog
  v-if="batchBidDialogVisible"
  :visible.sync="batchBidDialogVisible"
  :data="tableSelected"
  :currency="currency"
  @save="handleBatchBidSave"
/>
</div>
</template>

<script>
import { setStore, getStore } from '@/util/store';
import {
  queryTargetingGroupsList,
  modifyTargeting,
  modifyTargetingGroupsBitchBid,
} from '@/api/ppc/adManage';
import {
  defaultDateRange, 
  summaryMethod, 
  targetingGroupsCustomColsOptions as customColsOptions,
  tablePageOption,
} from '../../utils/options';
import { stateNameDict, stateIconDict } from '../../utils/dict';
import DatePicker from '../../components/DatePicker';
import CustomCols from '../../components/CustomCols';
import DataCharts from '../../components/DataCharts';
import EditDialog from './EditDialog';
import BatchBidDialog from './BatchBidDialog';
import {
  getValueLocaleString,
  formatTableSortParams,
  getCommonColOption,
  parseTreeKey,
  getFormatTotal,
} from '../../utils/fun';

export default {
  name: 'TargetingGroups',

  components: {
    DatePicker,
    CustomCols,
    EditDialog,
    DataCharts,
    BatchBidDialog,
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
    currency: {
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
      stateIconDict,
      customColsOptions,
      summaryMethod,
      filter: {
        state: null,
        dateRange: defaultDateRange,
      },
      // 自定义列显示
      customCols: [],
      tableHeight: 'calc(100vh - 294px)',
      tableData: [],
      tableTotalData: {},
      tableSelected: [],
      tableLoading: false,
      tablePageOption: { ...tablePageOption },
      tableSort: { prop: '', order: '' },
      editDialogVisible: false,
      editData: {},
      // 点击哪个编辑图标激活的弹窗
      editKey: '',
      // 数据分析
      dataChartsVisible: false,
      dataChartsRow: {},
      dataChartsNamePath: [],
      batchBidDialogVisible: false,
    };
  },

  computed: {
    commonColOption() {
      return getCommonColOption(this.currency);
    },

    // 广告树选中的节点信息
    treeSelectedInfo() {
      const treeSelectedInfo = parseTreeKey(this.treeSelectedKey);
      return treeSelectedInfo;
    },
  },

  created() {
    // 由于表格增加 智能竞价，导致保存在用户本地的自定义列项不一致， 先打补丁， 后期删除
    (function patch (colKey) {
      const flagKey = `flag-${colKey}`;
      const flag = getStore({ name: flagKey });
      if (!flag) {
        setStore({ name: colKey, content: null });
        setStore({ name: flagKey, content: true });
      }
    })('app-adMamage-targetingGroups-customCol');
    
    this.getList();
  },

  updated () {
    // 解决表格合计行样式问题
    this.$refs.refTable.doLayout();
  },

  methods: {
    getValueLocaleString,
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
        state: this.filter.state,
        startTime: this.filter.dateRange[0],
        endTime: this.filter.dateRange[1],
        ...body,
      };
      queryTargetingGroupsList(queryParams, bodyParams).then(res => {
        this.tableData = res.data.data.page.records;
        this.tablePageOption.total = res.data.data.page.total;
        this.tablePageOption.currentPage = res.data.data.page.current;
        this.tablePageOption.pageSize = res.data.data.page.size;
        // 合计数据格式化
        this.tableTotalData = getFormatTotal(res.data.data.page.total, this.currency);
      }).finally(() => {
        this.tableLoading = false;
      });
    },

    // 状态筛选
    handleStateChange(val) {
      this.filter.state = val;
      this.getList();
    },

    // 日期范围改变
    handleDateRangeChange(val) {
      this.filter.dateRange = val;
      this.getList();
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
      // 如果修改了竞价，同时修改智能竞价为竞价
      if (newData.bid) {
        newData.intelligenceBid = newData.bid;
      }
      ids.forEach(id => {
        const index = this.tableData.findIndex(data => data.id === id);
        this.tableData.splice(index, 1, {
          ...this.tableData[index],
          ...newData,
        });
      });
    },

    // 批量修改页面表格竞价
    updateTableBid(data) {
      data.forEach(item => {
        const index = this.tableData.findIndex(t => t.id === item.id);
        this.tableData.splice(index, 1, {
          ...this.tableData[index],
          bid: item.bid,
        });
      });
    },

    // 修改状态(可批量)
    updateState(state, list) {
      const ids = list.map(item => item.id);
      const params = {
        adStoreId: this.storeId,
        targetSettings: ids.map(id => {
          return {
            targetId: id,
            state,
          };
        })
      };
      modifyTargeting(params).then(res => {
        const { success, fail } = res.data.data;
        // 有失败的，或全部失败
        if (fail.length) {
          let msg = '';
          if (fail.length === ids.length) {
            // 全部失败
            msg = '操作失败';
          } else {
            // 部分失败部分成功
            msg = '部分修改失败';
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
        this.updateTableData(successIds, { state });
      });
    },

    // 单个修改状态
    handleSwitchState(val, row) {
      const state = val ? 'enabled' : 'paused';
      this.updateState(state, [row]);
    },

    // 批量修改状态
    handleBatchState(state) {
      this.updateState(state, this.tableSelected);
    },

    // 点击编辑图标
    handleRowClick(row, column, event) {
      if (event.target._prevClass === 'el-icon-edit table-edit-icon') {
        this.editKey = column.property;
        this.editDialogVisible = true;
        this.editData = { ...row };
      }
    },

    // 编辑保存
    handleEditSave(val) {
      const params = {
        adStoreId: this.storeId,
        targetSettings: [{ ...val }],
      };
      modifyTargeting(params).then(res => {
        const { success, fail } = res.data.data;
        if (fail.length) {
          this.$message.error(fail[0].errorMsg);
        } else {
          this.$message({
            type: 'success',
            message: '操作成功',
          });
        }
        const successIds = success.map(item => item.id);
        this.updateTableData(successIds, val);
      });
    },

    // 点击应用建议竞价
    handleApplySuggestedBid(row) {
      const bid = row.recommendBid;
      const params = {
        adStoreId: this.storeId,
        targetSettings: [{
          targetId: row.id,
          bid,
        }],
      };
      modifyTargeting(params).then(res => {
        const { fail } = res.data.data;
        if (fail.length) {
          this.$message.error(fail[0].errorMsg);
        } else {
          this.$message({
            type: 'success',
            message: '操作成功',
          });
        }
        this.updateTableData([row.id], { bid });
      });
    },

    // 点击广告活动/广告组名称
    handleClickName(row, type) {
      this.$log('handleClickName', row, type);
      const { campaignId, campaignName, campaignState, groupId, groupName, campaignTargetType, groupType } = row;
      let data = {
        key: `${campaignState}-${campaignId}-${campaignTargetType}`,
        campaignId,
        campaignName,
        targetingType: campaignTargetType,
        campaignState,
        isLeaf: false,
      };
      if (type === 'group') {
        data.key = `${campaignState}-${campaignId}-${campaignTargetType}-${groupId}-${groupType}`;
        data = {
          ...data,
          groupId,
          groupName,
          groupType,
          isLeaf: true,
        };
      }
      this.$emit('changeTreeSelected', data);
    },

    // 批量调整竞价保存
    handleBatchBidSave(val) {
      const params = {
        adStoreId: this.storeId,
        ...val,
        updateBids: this.tableSelected.map(item => {
          // 接口所需的 bid 为调整的基准竞价
          return {
            targetId: item.id,
            bid: item[val.base],
          };
        }),
      };
      modifyTargetingGroupsBitchBid(params).then(res => {
        const { success, fail } = res.data.data;
        if (fail.length) {
          this.$message.error(fail[0].errorMsg);
        } else {
          this.$message({
            type: 'success',
            message: '操作成功',
          });
        }
        this.updateTableBid(success);
      });
    },

    // 点击分析
    handleCharts(row) {
      this.dataChartsNamePath = [row.campaignName, row.groupName, row.target];
      this.dataChartsVisible = true;
      this.dataChartsRow = { ...row, entityId: row.id };
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

<style scoped lang="scss">
.toolbar div.batch_state {
  margin-left: 0;

  & > button {
    margin-left: 6px;
  }
}

.btn-apply_suggested_bid {
  padding: 4px 8px;
}

// 状态筛选下拉框
.filter-state-select {
  width: 200px;
  margin-right: 10px;
}
</style>

<style lang="scss">
  @import "../commonGlobal.scss";
</style>
