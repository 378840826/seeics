<!-- 广告 -->
<template>
<div>
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
    placeholder="状态"
    :size="size"
    class="filter-select"
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
  <el-button
    type="primary"
    @click="createDialogVisible = true"
    :size="size"
  >创建广告</el-button>

  <DatePicker :defaultValue="filter.dateRange" @change="handleDateRangeChange" />
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
    <el-table-column type="selection" width="55" />

    <el-table-column prop="state" label="状态" width="80" fixed>
      <span slot-scope="{row}" :class="row.state">{{ stateNameDict[row.state]}}</span>
    </el-table-column>

    <el-table-column prop="qualification" label="投放资格" width="130" fixed>
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

    <el-table-column prop="name" label="广告" width="200" sortable="custom"  fixed>
    </el-table-column>

    <el-table-column prop="campaignName" label="广告活动" width="200">
      <span slot-scope="{row}" class="campaignName">{{ row.campaignName }}</span>
    </el-table-column>

    <el-table-column prop="groupName" label="广告组" width="200">
    </el-table-column>

    <el-table-column prop="addTime" label="添加时间" width="110" sortable="custom" >
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

    <el-table-column
      v-for="item in commonColOption"
      :key="item.prop"
      :prop="item.prop"
      :label="item.label"
      :width="item.width"
    >
      <span slot-scope="{row}">{{ item.formatter(row[item.prop]) }}</span>
    </el-table-column>

    <!-- 操作 -->
    <el-table-column label="操作" fixed="right" width="60">
      <template slot-scope="{row}">
        <el-button
          @click="handleCharts(row)"
          style="color: #C0C4CC"
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

<!-- 创建广告弹窗 -->
<create-ad
  v-if="createDialogVisible"
  @success="getList({ current: 1 })"
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
} from '@/api/ppc/adManage';
import { stateNameDict } from '../../utils/dict';
import { tablePageOption, defaultDateRange, summaryMethod } from '../../utils/options';
import { log } from '@/util/util';
import Search from '../../components/Search';
import DatePicker from '../../components/DatePicker';
import FilterMore from '../../components/FilterMore';
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
    DatePicker,
    FilterMore,
    FilterCrumbs,
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
    portfolioId: {
      type: String,
    },
    treeSelectedKey: {
      type: String,
    },
  },

  data: function() {
    return {
      size: 'mini',
      stateNameDict,
      summaryMethod,
      filter: {
        search: '',
        state: '',
        qualification: '',
        dateRange: defaultDateRange,
        more: {},
      },
      // 高级筛选 Visible
      filterMoreVisible: false,
      tableHeight: 'calc(100vh - 326px)',
      tableData: [],
      tableTotalData: {},
      tableLoading: false,
      tablePageOption: { ...tablePageOption },
      tableSort: { prop: 'addTime', order: 'descending' },
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
      this.filter.state && (obj.state = stateNameDict[this.filter.state]);
      this.filter.qualification && (obj.qualification = this.filter.qualification);
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
        portfolioId: this.portfolioId,
        campaignId: this.treeSelectedInfo.campaignId,
        groupId: this.treeSelectedInfo.groupId,
        state: this.filter.state,
        qualification: this.filter.qualification,
        search: this.filter.search,
        startTime: this.filter.dateRange[0],
        entTime: this.filter.dateRange[1],
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
      this.filter.state = '';
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
        state: '',
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

    // 点击分析
    handleCharts(row) {
      log('分析', row);
    },
  },

  watch: {
    // portfolioId(val) {
    //   log('广告活动 watch portfolioId', val);
    // },

    treeSelectedKey() {
      this.getList();
    },

    // 面包屑出现时，改变表格高度
    filterCrumbsConditions() {
      let h = 326;
      this.$nextTick(function() {
        if (Object.keys(this.filterCrumbsConditions).length) {
          const margin = 10;
          h = h + this.$refs.refFilterCrumbs.$el.offsetHeight + margin;
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
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.popper-qualification_message {
  width: 300px;
}
</style>
