<!-- SearchTerm -->
<template>
<div class="container">
<!-- 筛选栏 -->
<div class="filter-bar">
  <el-radio-group
    v-model="filter.isKeyword"
    @change="handleIsKeywordChange"
    :size="size"
  >
    <el-radio-button :label="null">全部</el-radio-button>
    <el-radio-button :label="0">关键词</el-radio-button>
    <el-radio-button :label="1">ASIN</el-radio-button>
  </el-radio-group>

  <el-input
    v-model="searchInputValue" 
    :placeholder="`请输入${typeDict[filter.searchType]}`" 
    class="search-input_with_select" 
    clearable
    :size="size"
  >
    <el-select v-model="filter.searchType" slot="prepend" @change="filter.search = ''">
      <el-option label="搜索词" value="queryText"></el-option>
      <el-option label="投放" value="targetText"></el-option>
    </el-select>
    <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
  </el-input>

  <!-- 广告组合筛选 -->
  <MultipleSelect
    v-if="!treeSelectedInfo.portfolioId && !treeSelectedInfo.campaignId"
    ref="refPortfolioMultipleSelect"
    :list="portfolioList"
    placeholder="广告组合"
    @change="handlePortfolioFilterChange"
  />

  <!-- 广告活动筛选 -->
  <MultipleSelect
    v-if="!treeSelectedInfo.campaignId"
    ref="refCampaignMultipleSelect"
    :list="campaignList"
    :loading="loading.campaign"
    placeholder="广告活动"
    @change="handleCampaignFilterChange"
  />

  <!-- 广告组筛选 -->
  <MultipleSelect
    v-if="!treeSelectedInfo.groupId"
    ref="refGroupMultipleSelect"
    :list="groupList"
    :loading="loading.group"
    placeholder="广告组"
    @change="handleGroupFilterChange"
  />

  <el-select
    v-model="filter.targetingType"
    clearable
    placeholder="投放方式"
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
    <el-button type="primary" :size="size" @click="handleDownload" :loading="loading.download">下载报表</el-button>
  </div>
  <div>
    <DatePicker :defaultValue="filter.dateRange" @change="handleDateRangeChange" />
    <CustomCols
      localStorageKey="app-adMamage-searchTerm-customCol"
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
    v-loading="loading.table"
    tooltip-effect="dark"
    :height="tableHeight"
    empty-text="没有查询到数据，请修改查询条件"
    @selection-change="handleSelectionChange"
    @sort-change="handleSortChange"
    border
    show-summary
    :summary-method="({columns}) => summaryMethod(columns, tableTotalData, 1)"
    :size="size"
  >
    <el-table-column type="selection" width="55" />

    <el-table-column prop="queryText" label="搜索词" width="200" sortable="custom" fixed>
      <div slot-scope="{row}">
        <template v-if="row.isKeyword === 0">
          {{ row.queryText }}
        </template>
        <template v-else>
          <a
            :title="row.queryText"
            :href="getAmazonAsinUrl(row.queryText, marketplace)"
            target="_blank"
            rel="noopener noreferrer"
            class="link"
          >{{ row.queryText }}</a>
        </template>
      </div>
    </el-table-column>
      
    <el-table-column 
      v-if="customCols.includes('投放')"
      prop="targetText" 
      label="投放" 
      width="180" 
      sortable="custom"
    >
      <div slot-scope="{row}">
        <template v-if="row.isKeyword === 0">
          {{ row.targetText }}
        </template>
        <template v-else>
          <a
            :title="row.targetText"
            :href="getAmazonAsinUrl(row.targetText, marketplace)"
            target="_blank"
            rel="noopener noreferrer"
            class="link"
          >{{ row.targetText }}</a>
        </template>
      </div>
    </el-table-column>

    <el-table-column v-if="customCols.includes('匹配类型')" prop="matchType" label="匹配类型" width="80">
      <div slot-scope="{row}">
        {{ matchTypeNameDict[row.matchType] }}
      </div>
    </el-table-column>

    <el-table-column
      v-if="customCols.includes('广告活动') && !treeSelectedInfo.campaignId" 
      prop="campaignName" 
      label="广告活动" 
      width="200" 
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
      v-if="customCols.includes('ABA排名')" 
      prop="aba" 
      label="ABA排名" 
      width="100" 
      sortable="custom"
    ></el-table-column>

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
    :disabled="loading.table"
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

  <!-- 数据分析弹窗 -->
  <DataCharts
    v-if="dataChartsVisible"
    :visible.sync="dataChartsVisible"
    :currency="currency"
    :rowData="dataChartsRow"
    :namePath="dataChartsNamePath"
    pageType="searchTerm"
  />
</div>
</div>
</template>

<script>
import {
  querySearchTermList,
  queryConciseCampaignList,
  queryConciseGroupList,
  downloadSearchTermTable,
} from '@/api/ppc/adManage';
import { downloadExcel } from '@/util/util';
import { stateIconDict, matchTypeNameDict, targetingMatchTypeNameDict } from '../../utils/dict';
import {
  tablePageOption, 
  defaultDateRange, 
  summaryMethod,
  searchTermCustomColsOptions as customColsOptions,
} from '../../utils/options';
import { getAmazonAsinUrl } from '@/views/ppc/util';
import DatePicker from '../../components/DatePicker';
import CustomCols from '../../components/CustomCols';
import MultipleSelect from '../../components/MultipleSelect';
import FilterMore from '../../components/FilterMore';
import DataCharts from '../../components/DataCharts';
import FilterCrumbs, { notRangeKeys, multipleLongValueKeys } from '../../components/FilterCrumbs';
import {
  getValueLocaleString,
  formatTableSortParams,
  getCommonColOption,
  parseTreeKey,
  getFormatTotal,
} from '../../utils/fun';

export default {
  name: 'SearchTerm',

  components: {
    DatePicker,
    CustomCols,
    FilterMore,
    FilterCrumbs,
    MultipleSelect,
    DataCharts,
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
    portfolioList: {
      type: Array,
      required: true,
    },
  },

  data: function() {
    return {
      size: 'mini',
      customColsOptions,
      stateIconDict,
      summaryMethod,
      matchTypeNameDict: {
        ...matchTypeNameDict,
        ...targetingMatchTypeNameDict,
      },
      typeDict: {
        queryText: '搜索词',
        targetText: '投放',
      },
      allCampaignList: [],
      campaignList: [],
      allGroupList: [],
      groupList: [],
      loading: {
        table: false,
        campaign: false,
        group: false,
        download: false,
      },
      filter: {
        // 搜索的类型 搜索词/投放
        searchType: 'queryText',
        search: '',
        isKeyword: null,
        dateRange: defaultDateRange,
        portfolioIds: [],
        campaignIds: [],
        groupIds: [],
        targetingType: '',
        more: {},
      },
      searchInputValue: '',
      // 高级筛选 Visible
      filterMoreVisible: false,
      // 自定义列显示
      customCols: [],
      tableHeight: 'calc(100vh - 336px)',
      tableData: [],
      tableTotalData: {},
      tableSelected: [],
      tablePageOption: { ...tablePageOption },
      tableSort: { prop: 'impressions', order: 'descending' },
      // 数据分析
      dataChartsVisible: false,
      pageType: 'campaign',
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

    // 面包屑需要显示的筛选条件
    filterCrumbsConditions() {
      const obj = {
        ...this.filter.more,
      };
      if (this.filter.search) {
        obj[this.filter.searchType] = this.search;
      }
      this.filter.portfolioIds.length && (obj.portfolios = this.filter.portfolioList.map(item => item.name));
      this.filter.campaignIds.length && (obj.campaigns = this.filter.campaignList.map(item => item.name));
      this.filter.groupIds.length && (obj.groups = this.filter.groupList.map(item => item.name));
      return obj;
    },
  },

  created() {
    this.getList();
    // 用于筛选的
    this.getCampaignList();
    this.getGroupList();
  },

  updated () {
    // 解决表格合计行样式问题
    this.$refs.refTable.doLayout();
  },

  methods: {
    getAmazonAsinUrl,
    getValueLocaleString,
    formatTableSortParams,
    // 获取列表
    getList(query, body) {
      this.loading.table = true;
      // 排序参数格式化
      const sortParams = this.formatTableSortParams(this.tableSort);
      const queryParams = {
        current: this.tablePageOption.currentPage,
        size: this.tablePageOption.pageSize,
        ...sortParams,
        ...query,
      };
      const bodyParams = {
        ...queryParams,
        adStoreId: this.storeId,
        campaignType: 'sp',
        portfolioIds: this.treeSelectedInfo.portfolioId ? 
          [this.treeSelectedInfo.portfolioId] : this.filter.portfolioIds,
        campaignIds: this.treeSelectedInfo.campaignId ? 
          [this.treeSelectedInfo.campaignId] : this.filter.campaignIds,
        groupIds: this.treeSelectedInfo.groupId ? 
          [this.treeSelectedInfo.groupId] : this.filter.groupIds,
        targetingType: this.filter.targetingType,
        [this.filter.searchType]: this.filter.search,
        isKeyword: this.filter.isKeyword,
        startTime: this.filter.dateRange[0],
        endTime: this.filter.dateRange[1],
        ...this.filter.more,
        ...body,
      };
      querySearchTermList(bodyParams).then(res => {
        this.tableData = res.data.data.page.records;
        this.tablePageOption.total = res.data.data.page.total;
        this.tablePageOption.currentPage = res.data.data.page.current;
        this.tablePageOption.pageSize = res.data.data.page.size;
        // 合计数据格式化
        this.tableTotalData = getFormatTotal(res.data.data.total, this.currency);
      }).finally(() => {
        this.loading.table = false;
      });
    },

    // 数据源切换
    handleIsKeywordChange(val) {
      this.filter.isKeyword = val;
      this.getList({ current: 1 });
    },

    // 广告活动筛选列表
    getCampaignList() {
      this.loading.campaign = true;
      const bodyParams = {
        adStoreId: this.storeId,
        campaignType: 'sp',
      };
      queryConciseCampaignList(bodyParams).then(res => {
        this.campaignList = res.data.data.records.map(item => ({ ...item, id: item.campaignId }));
        this.allCampaignList = [...this.campaignList];
      }).finally(() => {
        this.loading.campaign = false;
      });
    },

    // 广告组筛选列表
    getGroupList() {
      this.loading.group = true;
      const bodyParams = {
        adStoreId: this.storeId,
        campaignType: 'sp',
      };
      queryConciseGroupList(bodyParams).then(res => {
        this.groupList = res.data.data.records.map(item => ({ ...item, id: item.groupId }));
        this.allGroupList = [...this.groupList];
      }).finally(() => {
        this.loading.group = false;
      });
    },

    // 点击搜索
    handleSearch() {
      this.filter.search = this.searchInputValue;
      this.filterCrumbsConditions[this.filter.searchType] = this.searchInputValue;
      this.getList({ current: 1 });
    },

    //  广告组合筛选
    handlePortfolioFilterChange(ids, list) {
      this.filter.portfolioIds = ids;
      this.filter.portfolioList = list;
      this.getList({ current: 1 });
    },

    //  广告活动筛选
    handleCampaignFilterChange(ids, list) {
      this.filter.campaignIds = ids;
      this.filter.campaignList = list;
      this.getList({ current: 1 });
    },

    //  广告组筛选
    handleGroupFilterChange(ids, list) {
      this.filter.groupIds = ids;
      this.filter.groupList = list;
      this.getList({ current: 1 });
    },

    // 投放方式筛选
    handleTargetingTypeChange(val) {
      this.filter.targetingType = val;
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
      if ([...notRangeKeys, ...multipleLongValueKeys].includes(key)) {
        this.filter[key] = '';
        if (['queryText', 'targetText'].includes(key)) {
          this.filter.search = '';
        } else if (key === 'portfolios') {
          this.filter.portfolioIds = [];
          this.$refs.refPortfolioMultipleSelect.emptyChecked();
        } else if (key === 'campaigns') {
          this.filter.campaignIds = [];
          this.$refs.refCampaignMultipleSelect.emptyChecked();
        } else if (key === 'groups') {
          this.filter.groupIds = [];
          this.$refs.refGroupMultipleSelect.emptyChecked();
        }
      } else {
        this.filter.more[`${key}Min`] = '';
        this.filter.more[`${key}Max`] = '';
      }
      this.getList({ current: 1 });
    },

    // 面包屑清空
    handleEmptyCrumbs() {
      this.filter = {
        searchType: 'queryText',
        search: '',
        isKeyword: null,
        portfolioIds: [],
        campaignIds: [],
        groupIds: [],
        dateRange: [...this.filter.dateRange],
        more: {},
      };
      // 清除勾选
      this.$refs.refPortfolioMultipleSelect.emptyChecked();
      this.$refs.refCampaignMultipleSelect.emptyChecked();
      this.$refs.refGroupMultipleSelect.emptyChecked();
      this.getList({ current: 1 });
    },

    // 表格排序变化
    handleSortChange(val) {
      this.tableSort = { prop: val.prop, order: val.order };
      // 排序后回到第一页
      this.tablePageOption.currentPage = 1;
      this.getList();
    },

    // 表格勾选变化
    handleSelectionChange(val) {
      this.tableSelected = val;
    },

    // 点击广告活动/广告组名称
    handleClickName(row, type) {
      const { campaignId, campaignName, campaignState, groupId, groupName, targetingType, isKeyword } = row;
      const groupType = isKeyword === 0 ? 'keyword' : 'targeting';
      let data = {
        key: `${campaignState}-${campaignId}-${targetingType}`,
        campaignId,
        campaignName,
        targetingType: targetingType,
        campaignState,
        isLeaf: false,
      };
      if (type === 'group') {
        data.key = `${campaignState}-${campaignId}-${targetingType}-${groupId}-${groupType}`;
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

    // 下载表格
    async handleDownload() {
      this.loading.download = true;
      const params = {
        adStoreId: this.storeId,
        campaignType: 'sp',
        portfolioIds: this.treeSelectedInfo.portfolioId ? 
          [this.treeSelectedInfo.portfolioId] : this.filter.portfolioIds,
        campaignIds: this.treeSelectedInfo.campaignId ? 
          [this.treeSelectedInfo.campaignId] : this.filter.campaignIds,
        groupIds: this.treeSelectedInfo.groupId ? 
          [this.treeSelectedInfo.groupId] : this.filter.groupIds,
        targetingType: this.filter.targetingType,
        [this.filter.searchType]: this.filter.search,
        isKeyword: this.filter.isKeyword,
        startTime: this.filter.dateRange[0],
        endTime: this.filter.dateRange[1],
        ...this.filter.more,
      };
      const res = await downloadSearchTermTable(params);
      try {
        await downloadExcel(res);
      } catch (error) {
        this.$message.error(error.msg || '下载出错！');
      } finally {
        this.loading.download = false;
      }
    },

    // 点击分析
    handleCharts(row) {
      this.dataChartsNamePath = [row.name];
      this.dataChartsVisible = true;
      this.dataChartsRow = { ...row };
    },
  },

  watch: {
    treeSelectedKey() {
      this.getList();
      // 过滤广告活动和广告组下拉列表
      const { portfolioId, campaignState, campaignId } = this.treeSelectedInfo;
      if (campaignId) {
        this.groupList = this.allGroupList.filter(item => String(item.campaignId) === campaignId);
      } else if (campaignState) {
        this.campaignList = this.allCampaignList.filter(item => item.state === campaignState);
      } else if (portfolioId) {
        const filter = item => {
          // campaignList groupList 的未分组 portfolioId 是空，treeSelectedInfo 的未分组 portfolioId 是 '0'
          if (item.portfolioId === null) {
            return portfolioId === '0';
          }
          return String(item.portfolioId) === portfolioId;
        };
        this.campaignList = this.allCampaignList.filter(filter);
        this.groupList = this.allGroupList.filter(filter);
      } else {
        this.campaignList = [...this.allCampaignList];
        this.groupList = [...this.allGroupList];
      }
    },

    // 面包屑出现时，改变表格高度
    filterCrumbsConditions() {
      let h = 336;
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
  @import "./index.scss";
</style>

<style lang="scss">
  @import "../commonGlobal.scss";
</style>
