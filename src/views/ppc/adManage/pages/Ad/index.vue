<!-- 广告 -->
<template>
<div class="container">
<!-- 筛选栏 -->
<div class="filter-bar">
  <Search
    placeholder="ASIN/SKU"
    :value="filter.search"
    @search="handleSearch"
  />

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


  <el-select
    v-model="filter.groupType"
    clearable
    placeholder="投放类型"
    :size="size"
    class="filter-select"
    @change="handleGroupTypeChange"
  >
    <el-option
      v-for="(val,key) in groupTypeDict"
      :key="key"
      :label="val"
      :value="key"
    />
  </el-select>

  <el-select
    v-model="filter.qualification"
    clearable
    placeholder="投放资格"
    :size="size"
    class="filter-select"
    @change="handleQualificationChange"
  >
    <el-option label="Delivery" value="delivery" />
    <el-option label="Ineligible" value="ineligible" />
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
      :disabled="treeSelectedInfo.campaignState === 'archived'"
      type="primary"
      @click="createDialogVisible = true"
      :size="size"
    >创建广告</el-button>

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
      localStorageKey="app-adMamage-ad-customCol"
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

    <el-table-column prop="asin" label="广告" width="280" sortable="custom" fixed>
      <template slot-scope="{row}">
        <Goods :goods-info="{...row, marketplace}" />
      </template>
    </el-table-column>

     <el-table-column 
      v-if="customCols.includes('投放资格')" 
      prop="qualification" 
      label="投放资格" 
      width="94" 
    >
      <template slot-scope="{row}">
        <div :class="row.qualification">{{ row.qualification }}</div>
        <el-tooltip v-if="row.qualificationMessage" effect="dark" placement="top">
          <div slot="content" class="popper-qualification_message">{{ row.qualificationMessage }}</div>
          <div>
            <div slot="reference" class="qualification_message">{{ row.qualificationMessage }}</div>
          </div>
        </el-tooltip>
      </template>
    </el-table-column>

    <el-table-column
      v-if="customCols.includes('广告活动') && !treeSelectedInfo.campaignId" 
      prop="campaignName" 
      label="广告活动" 
      width="200" 
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
      v-if="customCols.includes('广告组') && !treeSelectedInfo.groupId" 
      prop="groupName" 
      label="广告组" 
      width="200" 
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
      v-if="customCols.includes('添加时间')" 
      prop="addTime" 
      label="添加时间" 
      width="110" 
      sortable="custom" 
    >
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

<!-- 数据分析弹窗 -->
<DataCharts
  v-if="dataChartsVisible"
  :visible.sync="dataChartsVisible"
  :currency="currency"
  :rowData="dataChartsRow"
  :namePath="dataChartsNamePath"
  pageType="ad"
/>

<!-- 创建广告弹窗 -->
<create-ad
  v-if="createDialogVisible"
  @success="$emit('createSuccess')"
  :dialogVisible.sync="createDialogVisible"
  :mwsStoreId="mwsStoreId"
  :marketplace="marketplace"
  :storeId="storeId"
/>
</div>
</template>

<script>
import {
  queryAdList,
  modifyAdState,
} from '@/api/ppc/adManage';
import { stateNameDict, groupTypeDict, stateIconDict } from '../../utils/dict';
import {
  tablePageOption, 
  defaultDateRange, 
  summaryMethod, 
  adCustomColsOptions as customColsOptions,
} from '../../utils/options';
import Goods from './Goods';
import Search from '../../components/Search';
import DatePicker from '../../components/DatePicker';
import CustomCols from '../../components/CustomCols';
import FilterMore from '../../components/FilterMore';
import DataCharts from '../../components/DataCharts';
import FilterCrumbs, { notRangeKeys } from '../../components/FilterCrumbs';
import {
  getValueLocaleString,
  formatTableSortParams,
  getCommonColOption,
  parseTreeKey,
  getFormatTotal,
} from '../../utils/fun';
import CreateAd from '../../create/createAd.vue';

export default {
  name: 'Ad',

  components: {
    Search,
    Goods,
    DatePicker,
    CustomCols,
    FilterMore,
    FilterCrumbs,
    DataCharts,
    CreateAd,
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
    mwsStoreId: {
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
      customColsOptions,
      stateIconDict,
      stateNameDict,
      groupTypeDict,
      summaryMethod,
      filter: {
        search: '',
        state: [],
        groupType: '',
        qualification: '',
        dateRange: defaultDateRange,
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
      tableSort: { prop: 'addTime', order: 'descending' },
      // 数据分析
      dataChartsVisible: false,
      dataChartsRow: {},
      dataChartsNamePath: [],
      createDialogVisible: false,
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

    // 面包屑需要显示的筛选条件
    filterCrumbsConditions() {
      const obj = {
        ...this.filter.more,
      };
      this.filter.search && (obj.search = this.filter.search);
      this.filter.groupType && (obj.groupType = groupTypeDict[this.filter.groupType]);
      this.filter.state.length && (obj.state = this.filter.state.map(s => stateNameDict[s]).toString());
      return obj;
    },
  },

  created() {
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
        campaignId: this.treeSelectedInfo.campaignId,
        groupId: this.treeSelectedInfo.groupId,
        groupType: this.filter.groupType,
        state: this.filter.state,
        qualification: this.filter.qualification,
        search: this.filter.search,
        startTime: this.filter.dateRange[0],
        endTime: this.filter.dateRange[1],
        ...this.filter.more,
        ...body,
      };
      queryAdList(queryParams, bodyParams).then(res => {
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
      this.filter.state = [];
      this.filter.groupType = '';
      this.filter.qualification = '';
      // 清空并收起高级筛选
      this.filter.more = {};
      this.filterMoreVisible = false;
      this.$refs.refFilterMore.handleEmpty();
      this.getList({ current: 1 });
    },

    // 状态筛选
    handleStateChange(val) {
      this.filter.state = val;
      this.getList({ current: 1 });
    },

    // 投放类型筛选
    handleGroupTypeChange(val) {
      this.filter.groupType = val;
      this.getList({ current: 1 });
    },

    // 投放资格筛选
    handleQualificationChange(val) {
      this.filter.qualification = val;
      this.getList({ current: 1 });
    },

    // 高级筛选确定
    handleFilter(val) {
      this.filterMoreVisible = false;
      this.filter.more = { ...val };
      this.getList({ current: 1 }, { ...val });
    },

    // 高级筛选点击取消
    handleFilterCancel() {
      this.filterMoreVisible = false;
    },

    // 日期范围改变
    handleDateRangeChange(val) {
      this.filter.dateRange = val;
      this.getList({ current: 1 }, this.filter.more);
    },

    // 面包屑关闭
    handleCloseCrumbs(key) {
      if (notRangeKeys.includes(key)) {
        this.filter[key] = '';
        key === 'state' && (this.filter.state = []);
      } else {
        this.filter.more[`${key}Min`] = '';
        this.filter.more[`${key}Max`] = '';
      }
      this.getList({ current: 1 });
    },

    // 面包屑清空
    handleEmptyCrumbs() {
      this.filter = {
        search: '',
        state: [],
        groupType: '',
        qualification: '',
        dateRange: [...this.filter.dateRange],
        more: {},
      };
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

    // 修改状态(可批量)
    updateState(state, list) {
      const ids = list.map(item => item.id);
      const params = {
        adStoreId: this.storeId,
        adProductIds: ids,
        state,
      };
      modifyAdState(params).then(res => {
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

    // 点击广告活动/广告组名称
    handleClickName(row, type) {
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

    // 点击分析
    handleCharts(row) {
      this.dataChartsNamePath = [row.campaignName, row.groupName, row.asin];
      this.dataChartsVisible = true;
      this.dataChartsRow = { ...row, entityId: row.id };
    },
  },

  watch: {
    treeSelectedKey() {
      this.getList();
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

<style scoped lang="scss">
.qualification_message {
  color: $danger;
  width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.popper-qualification_message {
  width: 300px;
}
</style>

<style lang="scss">
  @import "../commonGlobal.scss";
</style>
