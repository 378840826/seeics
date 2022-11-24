<!-- 广告活动 -->
<template>
<div class="container">
<!-- 筛选栏 -->
<div class="filter-bar">
  <Search
    placeholder="广告活动名称/ASIN/SKU"
    :value="filter.search"
    @search="handleSearch"
  />

  <!-- 广告组合筛选 -->
  <MultipleSelect
    v-if="!treeSelectedInfo.portfolioId"
    ref="refPortfolioMultipleSelect"
    :list="portfolioList"
    placeholder="广告组合"
    @change="handlePortfolioFilterChange"
  />

  <el-select
    v-model="filter.targetingType"
    clearable
    placeholder="广告类型"
    :size="size"
    class="filter-select"
    @change="handleTargetingTypeChange"
  >
    <el-option
      key="manual"
      label="手动"
      value="manual"
    />
    <el-option
      key="auto"
      label="自动"
      value="auto"
    />
  </el-select>

  <el-select
    v-model="filter.groupType"
    clearable
    placeholder="投放类型"
    :size="size"
    class="filter-select"
    @change="handleGroupTypeChange"
  >
    <el-option
      v-for="(val,key) in campaignGroupTypeDict"
      :key="key"
      :label="val"
      :value="key"
    />
  </el-select>

  <el-select
    v-model="filter.state"
    clearable
    multiple
    collapse-tags
    placeholder="状态"
    :size="size"
    class="filter-select filter-state-select"
    @change="handleStateChange"
  >
    <el-option
      v-for="(val,key) in stateNameDict"
      :key="key"
      :label="val"
      :value="key"
    />
  </el-select>

  <el-button
    :type="filterMoreVisible ? 'primary' : ''"
    class="filter_more-btn"
    @click="filterMoreVisible = !filterMoreVisible"
    :size="size"
  >
    高级筛选
    <i :class="filterMoreVisible ? 'el-icon-arrow-down' : 'el-icon-arrow-right'" />
  </el-button>
</div>
<!-- 高级筛选 -->
<FilterMore
  ref="refFilterMore"
  :visible="filterMoreVisible"
  :currency="currency"
  @filter="handleFilter"
  @cancel="handleFilterCancel"
/>
<!-- 面包屑 -->
<FilterCrumbs
  ref="refFilterCrumbs"
  :filterConditions="filterCrumbsConditions"
  :currency="currency"
  @close="handleCloseCrumbs"
  @empty="handleEmptyCrumbs"
/>
<!-- 工具栏 -->
<div class="toolbar">
  <div>
    <el-button
      type="primary"
      @click="createCampaignDialogVisible = true"
      :size="size"
    >创建广告活动</el-button>

    <div class="batch_state">
      批量操作：
      <el-button-group>
        <el-button
          v-for="state in Object.keys(stateNameDict)"
          :key="state"
          @click="handleBatchState(state)"
          :disabled="!tableSelected.length"
          :size="size"
        >{{ stateNameDict[state] }}</el-button>
      </el-button-group>
    </div>
  </div>

  <div>
    <DatePicker :defaultValue="filter.dateRange" @change="handleDateRangeChange" />
    <CustomCols
      localStorageKey="app-adMamage-campaign-customCol"
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
        <el-select
          :value="row.state"
          :size="size"
          :disabled="row.state === 'archived'"
          :class="row.state"
          @change="(v) => handleStateModify(v, row)"
        >
          <el-option
            v-for="(value, key) in stateNameDict"
            :key="key"
            :label="value"
            :value="key"
          >
            <span :class="key">{{ value }}</span>
          </el-option>
        </el-select>
      </template>
    </el-table-column>

    <el-table-column prop="name" label="广告活动" width="200" sortable="custom"  fixed>
      <div slot-scope="{row}">
        <template v-if="row.state !== 'archived'">
          <span class="link_name" @click="handleClickName(row)">{{ row.name }}</span>
          <i class="el-icon-edit table-edit-icon"></i>
        </template>
        <template v-else>
          {{ row.name }}
        </template>
      </div>
    </el-table-column>

    <el-table-column
      v-if="customCols.includes('广告组合')"
      prop="portfolioId"
      label="广告组合"
      width="100"
    >
      <div slot-scope="{row}">
        {{ row.portfolioName }}
        <i v-if="row.state !== 'archived'" class="el-icon-edit table-edit-icon"></i>
      </div>
    </el-table-column>

    <el-table-column
      v-if="customCols.includes('广告类型')" 
      prop="targetingType" 
      label="广告类型" 
      width="80"
    >
      <template slot-scope="{row}">
        {{ targetingTypeDict[row.targetingType] }}
      </template>
    </el-table-column>

    <el-table-column
      v-if="customCols.includes('创建时间')"
      prop="createdTime" 
      label="创建时间" 
      width="112" 
      sortable="custom" 
    >
      <template slot="header">
        <span>
          创建时间
          <el-tooltip effect="dark" content="北京时间" placement="top">
            <i class="el-icon-info icon-time_info"></i>
          </el-tooltip>
        </span>
      </template>
      <span slot-scope="{row}" class="td_date_time">{{ row.createdTime }}</span>
    </el-table-column>

    <el-table-column
      v-if="customCols.includes('广告组数量')" 
      prop="groupNumber" 
      label="广告组数量" 
      width="90"
    >
      <div slot-scope="{row}">
        <template v-if="row.state !== 'archived'">
          <el-button
            type="text"
            :size="size"
            @click="handleClickName(row)"
          >{{ row.groupNumber }}</el-button>
        </template>
        <template v-else>
          {{ row.groupNumber }}
        </template>
      </div>
    </el-table-column>

    <el-table-column
      v-if="customCols.includes('竞价策略')" 
      prop="biddingStrategy" 
      label="竞价策略" 
      width="122"
    >
      <div slot-scope="{row}">
        {{ biddingStrategyDict[row.biddingStrategy] }}
        <i v-if="row.state !== 'archived'" class="el-icon-edit table-edit-icon"></i>
      </div>
    </el-table-column>

    <el-table-column 
      v-if="customCols.includes('搜索结果顶部')" 
      prop="biddingPlacementTop" 
      label="搜索结果顶部" 
      width="120"
      sortable="custom"
    >
      <div slot-scope="{row}">
        {{ getValueLocaleString({ value: row.biddingPlacementTop, isFraction: true, suffix: '%' }) }}
        <i v-if="row.state !== 'archived'" class="el-icon-edit table-edit-icon"></i>
      </div>
    </el-table-column>

    <el-table-column 
      v-if="customCols.includes('商品页面')" 
      prop="biddingPlacementProductPage" 
      label="商品页面" 
      width="100"
      sortable="custom"
    >
      <div slot-scope="{row}">
        {{ getValueLocaleString({ value: row.biddingPlacementProductPage, isFraction: true, suffix: '%' }) }}
        <i v-if="row.state !== 'archived'" class="el-icon-edit table-edit-icon"></i>
      </div>
    </el-table-column>

    <el-table-column
      v-if="customCols.includes('日预算')"
      prop="dailyBudget"
      label="日预算" 
      width="100"
      sortable="custom"
    >
      <div slot-scope="{row}">
        {{ getValueLocaleString({ value: row.dailyBudget, isFraction: true, prefix: currency }) }}
        <i v-if="row.state !== 'archived'" class="el-icon-edit table-edit-icon"></i>
      </div>
    </el-table-column>

    <el-table-column 
      v-if="customCols.includes('否定关键词')" 
      prop="negativeKeywordNumber" 
      label="否定关键词" 
      width="100"
    >
      <template slot-scope="{row}">
        {{ row.negativeKeywordNumber }}
      </template>
    </el-table-column>

    <el-table-column 
      v-if="customCols.includes('否定商品')"  
      prop="negativeTargetingNumber" 
      label="否定商品" 
      width="100"
    >
      <template slot-scope="{row}">
        {{ row.negativeTargetingNumber }}
      </template>
    </el-table-column>

    <el-table-column
      v-if="customCols.includes('开始时间')"
      prop="startDate" 
      label="开始时间" 
      width="110"
      sortable="custom"
    >
      <div slot-scope="{row}">
        <span class="td_date_time">{{ row.startDate }}</span>
        <i v-if="row.state !== 'archived'" class="el-icon-edit table-edit-icon"></i>
      </div>
    </el-table-column>

    <el-table-column 
      v-if="customCols.includes('结束时间')" 
      prop="endDate" 
      label="结束时间" 
      width="110"
      sortable="custom"
    >
      <div slot-scope="{row}">
        <span class="td_date_time">{{ row.endDate }}</span>
        <i v-if="row.state !== 'archived'" class="el-icon-edit table-edit-icon"></i>
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
    :page-sizes="[20, 50, 100]"
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
  pageType="campaign"
/>

<!-- 创建广告活动弹窗 -->
<CreateCampaignDialog
  v-if="createCampaignDialogVisible"
  @success="$emit('createSuccess')"
  :dialogVisible.sync="createCampaignDialogVisible"
  :mwsStoreId="mwsStoreId"
  :marketplace="marketplace"
  :currency="currency"
  :storeId="storeId"
/>

</div>
</template>

<script>
import { setStore, getStore } from '@/util/store';
import {
  queryCampaignList,
  modifyCampaignState,
  modifyCampaign,
} from '@/api/ppc/adManage';
import { stateNameDict, targetingTypeDict, campaignGroupTypeDict, biddingStrategyDict } from '../../utils/dict';
import {
  tablePageOption, 
  defaultDateRange, 
  summaryMethod, 
  campaignCustomColsOptions as customColsOptions,
} from '../../utils/options';
import { log } from '@/util/util';
import {
  getValueLocaleString,
  formatTableSortParams,
  getCommonColOption,
  getFormatTotal,
  parseTreeKey,
} from '../../utils/fun';
import Search from '../../components/Search';
import DatePicker from '../../components/DatePicker';
import CustomCols from '../../components/CustomCols';
import FilterMore from '../../components/FilterMore';
import MultipleSelect from '../../components/MultipleSelect';
import DataCharts from '../../components/DataCharts';
import EditDialog from './EditDialog';
import FilterCrumbs, { notRangeKeys, multipleLongValueKeys } from '../../components/FilterCrumbs';
import CreateCampaignDialog from '../../create/createCampaignDialog';

export default {
  name: 'Campaign',

  components: {
    Search,
    DatePicker,
    CustomCols,
    FilterMore,
    MultipleSelect,
    FilterCrumbs,
    EditDialog,
    DataCharts,
    CreateCampaignDialog,
  },

  props: {
    marketplace: {
      type: String,
      required: true,
    },
    treeSelectedKey: {
      type: String,
      required: true,
    },
    storeId: {
      type: String,
      required: true,
    },
    mwsStoreId: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    portfolioList: {
      type: Array,
      required: true,
    },
  },

  data: function() {
    return {
      size: 'mini',
      customColsOptions,
      stateNameDict,
      targetingTypeDict,
      campaignGroupTypeDict,
      biddingStrategyDict,
      summaryMethod,
      portfolioCheckedAll: false,
      filter: {
        search: '',
        state: [],
        targetingType: '',
        groupType: '',
        dateRange: defaultDateRange,
        portfolioIds: [],
        more: {},
      },
      // 高级筛选 Visible
      filterMoreVisible: false,
      // 自定义列显示
      customCols: [],
      tableHeight: 'calc(100vh - 326px)',
      tableData: [],
      tableTotalData: {},
      tableSelected: [],
      tableLoading: false,
      tablePageOption: { ...tablePageOption },
      tableSort: { prop: 'createdTime', order: 'descending' },
      editDialogVisible: false,
      editData: {},
      // 点击哪个编辑图标激活的弹窗
      editKey: '',
      // 数据分析
      dataChartsVisible: false,
      pageType: 'campaign',
      dataChartsRow: {},
      dataChartsNamePath: [],
      createCampaignDialogVisible: false,
    };
  },

  computed: {
    // 广告树选中的节点信息
    treeSelectedInfo() {
      const treeSelectedInfo = parseTreeKey(this.treeSelectedKey);
      return treeSelectedInfo;
    },

    // 面包屑需要显示的筛选条件
    filterCrumbsConditions() {
      const obj = {
        ...this.filter.more,
      };
      this.filter.search && (obj.search = this.filter.search);
      this.filter.targetingType && (obj.targetingType = targetingTypeDict[this.filter.targetingType]);
      this.filter.groupType && (obj.groupType = campaignGroupTypeDict[this.filter.groupType]);
      this.filter.state.length && (obj.state = this.filter.state.map(s => stateNameDict[s]).toString());
      this.filter.portfolioIds.length && (obj.portfolios = this.filter.portfolioList.map(item => item.name));
      return obj;
    },

    commonColOption() {
      return getCommonColOption(this.currency);
    },
  },

  created() {
    // 由于表格的”投放方式“ 改名为 ”广告类型“，导致保存在用户本地的自定义列项不一致，先打补丁， 后期删除
    const localStorageCustomCols = getStore({ name: 'app-adMamage-campaign-customCol' });
    const index = localStorageCustomCols.findIndex(item => item === '投放方式');
    if (index !== -1) {
      localStorageCustomCols[index] = '广告类型';
      setStore({ name: 'app-adMamage-campaign-customCol', content: localStorageCustomCols });
    }

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
        storeId: this.storeId,
        marketplace: this.marketplace,
        adType: 'sp',
        portfolioId: this.treeSelectedInfo.portfolioId,
        portfolioIds: this.filter.portfolioIds,
        state: this.filter.state,
        search: this.filter.search,
        targetingType: this.filter.targetingType,
        groupType: this.filter.groupType,
        startTime: this.filter.dateRange[0],
        endTime: this.filter.dateRange[1],
        ...this.filter.more,
        ...body,
      };
      queryCampaignList(queryParams, bodyParams).then(res => {
        this.tableData = res.data.data.page.records;
        this.tablePageOption.total = res.data.data.page.total;
        this.tablePageOption.currentPage = res.data.data.page.current;
        this.tablePageOption.pageSize = res.data.data.page.size;
        // 合计数据格式化
        this.tableTotalData = getFormatTotal(res.data.data.total, this.currency);
      }).finally(() => {
        this.tableLoading = false;
      });
    },

    // 点击搜索
    handleSearch(val) {
      this.filter.search = val;
      this.filter.targetingType = '';
      this.filter.groupType = '';
      this.filter.portfolioIds = [];
      // 清空并收起高级筛选
      this.filter.more = {};
      this.filterMoreVisible = false;
      this.$refs.refFilterMore.handleEmpty();
      this.getList({ current: 1 });
    },

    // 状态筛选
    handleStateChange(val) {
      this.$emit('changeTreeCampaignState', val);
      this.filter.state = val;
      this.getList({ current: 1 });
    },

    // 广告类型筛选
    handleTargetingTypeChange(val) {
      this.filter.targetingType = val;
      this.getList({ current: 1 });
    },

    // 投放类型筛选
    handleGroupTypeChange(val) {
      this.filter.groupType = val;
      this.getList({ current: 1 });
    },

    //  广告组合筛选
    handlePortfolioFilterChange(ids, list) {
      this.filter.portfolioIds = ids;
      this.filter.portfolioList = list;
      this.getList({ current: 1 });
    },

    // 高级筛选确定
    handleFilter(val) {
      this.filterMoreVisible = false;
      this.filter.more = { ...val };
      this.getList({ current: 1 });
    },

    // 高级筛选点击取消
    handleFilterCancel() {
      this.filterMoreVisible = false;
    },

    // 日期范围改变
    handleDateRangeChange(val) {
      this.filter.dateRange = val;
      this.getList({ current: 1 });
    },

    // 面包屑关闭
    handleCloseCrumbs(key) {
      if ([...notRangeKeys, ...multipleLongValueKeys].includes(key)) {
        this.filter[key] = '';
        if (key === 'state') {
          this.$emit('changeTreeCampaignState', null);
          this.filter.state = [];
        } else if (key === 'portfolios') {
          this.filter.portfolioIds = [];
          // 清除广告组合筛选组件的勾选
          this.$refs.refPortfolioMultipleSelect.emptyChecked();
        }
      } else {
        this.filter.more[`${key}Min`] = '';
        this.filter.more[`${key}Max`] = '';
      }
      this.getList({ current: 1 });
    },

    // 面包屑清空
    handleEmptyCrumbs() {
      this.$emit('changeTreeCampaignState', null);
      this.filter = {
        search: '',
        state: [],
        targetingType: '',
        groupType: '',
        portfolioIds: [],
        dateRange: [...this.filter.dateRange],
        more: {},
      };
      // 清除广告组合筛选组件的勾选
      this.$refs.refPortfolioMultipleSelect.emptyChecked();
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
        const index = this.tableData.findIndex(data => data.id === id);
        this.tableData.splice(index, 1, {
          ...this.tableData[index],
          ...newData,
        });
      });
    },

    // 更新列表中的广告组合 (修改了广告组合名称后，若当前列表有该广告组合则需要修改)
    updatePortfolio(portfolio) {
      this.tableData.forEach(item => {
        if (item.portfolioId === portfolio.id) {
          item.portfolioName = portfolio.newName;
        }
      });
    },

    // 修改状态(可批量)
    updateState(state, list) {
      const ids = list.map(item => item.id);
      const params = {
        adStoreId: this.storeId,
        campaignIds: ids,
        state,
      };
      modifyCampaignState(params).then(res => {
        const { success, fail } = res.data.data;
        // 是否需要刷新广告树
        let isUpdateTree = true;
        // 有失败的，或全部失败
        if (fail.length) {
          let msg = '';
          if (fail.length === ids.length) {
            // 全部失败
            msg = '操作失败';
            isUpdateTree = false;
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
        if (isUpdateTree) {
          // 刷新广告树
          this.$emit('updateStateTree', { type: 'campaign', newState: state, list });
        }
      });
    },

    // 单个修改状态
    handleStateModify(state, row) {
      if (state === 'archived') {
        this.$confirm('归档后不可重新开启，确认归档吗？', '警告', {
          type: 'warning',
          callback: (action) => {
            if (action === 'confirm') {
              this.updateState(state, [row]);
            }            
          }
        });
      } else {
        this.updateState(state, [row]);
      }
    },

    // 批量修改状态
    handleBatchState(state) {
      if (state === 'archived') {
        this.$confirm('归档后不可重新开启，确定要归档吗？', '警告', {
          type: 'warning',
          callback: (action) => {
            if (action === 'confirm') {
              this.updateState(state, this.tableSelected);
            }            
          }
        });
      } else {
        this.updateState(state, this.tableSelected);
      }
    },

    // 点击编辑图标
    handleRowClick(row, column, event) {
      if (event.target._prevClass === 'el-icon-edit table-edit-icon') {
        this.editKey = column.property;
        this.editDialogVisible = true;
        this.editData = {
          ...row,
          // 接口传回 4 位小数，转为两位小数
          dailyBudget: getValueLocaleString({ value: row.dailyBudget, isFraction: true }),
        };
      }
    },

    // 编辑保存
    handleEditSave(val) {
      const params = {
        ...val,
        adStoreId: this.storeId,
      };
      modifyCampaign(params).then(res => {
        // 更新页面数据
        const { data } = res.data;
        // 日预算 dailyBudget 的 key 返回的是 budget
        if (data.budget) {
          data.dailyBudget = data.budget;
        }
        // 如果修改了广告组合，添加广告组合名称用于修改页面数据
        if (data.portfolioId !== undefined) {
          data.portfolioId = Number(data.portfolioId);
          data.portfolioName = val.portfolioName;
        }
        this.updateTableData([this.editData.id], data);
        this.$message.success(res.data.msg || '操作成功');
      });
    },

    // 点击广告活动名称
    handleClickName(row) {
      const { state, id, name, targetingType } = row;
      this.$emit('changeTreeSelected', {
        key: `${state}-${id}-${targetingType}`,
        campaignId: 165279365602,
        campaignName: name,
        targetingType,
        campaignState: state,
        isLeaf: false,
      });
    },

    // 点击广告组数量
    handleClickGroupCount(row) {
      log('点击广告组数量', row);
    },

    // 点击分析
    handleCharts(row) {
      this.dataChartsNamePath = [row.name];
      this.dataChartsVisible = true;
      this.dataChartsRow = { ...row, entityId: row.id };
    },
  },

  watch: {
    // 此处只会监听到 状态树的状态改变 + 广告组合树的组合改变， 因为只有点击状态或组合时才会加载此模块
    treeSelectedKey(val) {
      // 树清空时不再请求列表，因为树清空时是选中了广告组合，已经请求了一次列表
      if (val) {
        // 更新 filter.state
        this.filter.state = this.treeSelectedInfo.campaignState ? [this.treeSelectedInfo.campaignState] : [];
        // 清空筛选栏的广告组合筛选，避免和组合树冲突
        this.treeSelectedInfo.portfolioId && (this.filter.portfolioIds = []);
        this.getList({ current: 1 });
      }
    },

    // 面包屑出现时，改变表格高度
    filterCrumbsConditions() {
      let h = 326;
      this.$nextTick(function() {
        if (Object.keys(this.filterCrumbsConditions).length) {
          h = h + this.$refs.refFilterCrumbs.$el.offsetHeight;
        }
        this.tableHeight = `calc(100vh - ${h}px)`;
      });
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
