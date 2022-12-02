<!-- 广告位 -->
<template>
<div class="container">
<!-- 工具栏 -->
<div class="toolbar">
  <div></div>
  <div>
    <DatePicker :defaultValue="filter.dateRange" @change="handleDateRangeChange" />
    <CustomCols
      localStorageKey="app-adMamage-placement-customCol"
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
    @sort-change="handleSortChange"
    @row-click="handleRowClick"
    border
    :size="size"
  >
    <el-table-column prop="campaignPlacement" label="广告位" width="150" fixed>
      <div slot-scope="{row}">
        {{ placementNameDict[row.campaignPlacement] }}
      </div>
    </el-table-column>

    <el-table-column
      v-if="customCols.includes('竞价策略')" 
      prop="biddingStrategy" 
      label="竞价策略" 
      width="158"
    >
      <div slot-scope="{row}">
        {{ biddingStrategyDict[row.biddingStrategy] }}
        <i v-if="row.campaignState !== 'archived'" class="el-icon-edit table-edit-icon"></i>
      </div>
    </el-table-column>

    <el-table-column v-if="customCols.includes('竞价调整')" prop="bidAdjustment" label="竞价调整" width="100">
      <div slot-scope="{row}">
        {{ getValueLocaleString({ value: row.bidAdjustment, isFraction: true, suffix: '%' }) }}
        <i 
          v-if="row.campaignPlacement !== 'Other on-Amazon' && row.campaignState !== 'archived'" 
          class="el-icon-edit table-edit-icon"
        ></i>
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
</div>

<!-- 编辑弹窗 -->
<EditDialog
  v-if="editDialogVisible"
  :visible.sync="editDialogVisible"
  :data="editData"
  :portfolioList="portfolioList"
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
  pageType="placement"
/>
</div>
</template>

<script>
import {
  queryPlacementList,
  modifyCampaign,
} from '@/api/ppc/adManage';
import {
  defaultDateRange, 
  placementCustomColsOptions as customColsOptions,
} from '../../utils/options';
import { biddingStrategyDict, placementNameDict } from '../../utils/dict';
import DatePicker from '../../components/DatePicker';
import CustomCols from '../../components/CustomCols';
import DataCharts from '../../components/DataCharts';
import EditDialog from './EditDialog';
import {
  getValueLocaleString,
  formatTableSortParams,
  getCommonColOption,
  parseTreeKey,
} from '../../utils/fun';

export default {
  name: 'Placement',

  components: {
    DatePicker,
    CustomCols,
    EditDialog,
    DataCharts,
  },

  props: {
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
    portfolioList: {
      type: Array,
      required: true,
    },
  },

  data: function() {
    return {
      size: 'mini',
      biddingStrategyDict,
      placementNameDict,
      customColsOptions,
      filter: {
        dateRange: defaultDateRange,
      },
      // 自定义列显示
      customCols: [],
      tableHeight: 'calc(100vh - 270px)',
      tableData: [],
      tableLoading: false,
      tableSort: { prop: '', order: '' },
      editDialogVisible: false,
      editData: {},
      // 点击哪个编辑图标激活的弹窗
      editKey: '',
      // 数据分析
      dataChartsVisible: false,
      dataChartsRow: {},
      dataChartsNamePath: [],
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
    this.getList();
  },

  updated () {
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
        ...sortParams,
        ...query,
      };
      const bodyParams = {
        adStoreId: this.storeId,
        adType: 'sp',
        campaignId: this.treeSelectedInfo.campaignId,
        startTime: this.filter.dateRange[0],
        endTime: this.filter.dateRange[1],
        ...body,
      };
      queryPlacementList(queryParams, bodyParams).then(res => {
        this.tableData = res.data.data;
      }).finally(() => {
        this.tableLoading = false;
      });
    },

    // 日期范围改变
    handleDateRangeChange(val) {
      this.filter.dateRange = val;
      this.getList();
    },

    // 表格排序变化
    handleSortChange(val) {
      this.tableSort = { prop: val.prop, order: val.order };
      this.getList();
    },

    // 点击编辑图标
    handleRowClick(row, column, event) {
      if (event.target._prevClass === 'el-icon-edit table-edit-icon') {
        let editKey = column.property;
        if (column.property === 'bidAdjustment') {
          const editKeyDict = {
            'Detail Page on-Amazon': 'biddingPlacementProductPage',
            'Top of Search on-Amazon': 'biddingPlacementTop',
          };
          editKey = editKeyDict[row.campaignPlacement];
        }
        this.editKey = editKey;
        this.editDialogVisible = true;
        this.editData = { ...row };
      }
    },

    // 编辑保存
    handleEditSave(val) {
      const params = {
        ...val,
        adStoreId: this.storeId,
      };
      modifyCampaign(params).then(res => {
        this.$message.success(res.data.msg || '操作成功');
        // 刷新页面数据
        this.getList();
      });
    },

    // 点击分析
    handleCharts(row) {
      this.dataChartsNamePath = [row.campaignName, placementNameDict[row.campaignPlacement]];
      this.dataChartsVisible = true;
      this.dataChartsRow = { ...row, entityId: row.campaignId, adStoreId: this.storeId };
    },
  },

  watch: {
    treeSelectedKey() {
      // 要求清空排序
      this.tableSort = { prop: '', order: '' };
      this.$refs.refTable.clearSort();
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
