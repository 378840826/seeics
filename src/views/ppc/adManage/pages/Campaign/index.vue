<!-- 广告活动 -->
<template>
<!-- 表格 -->
<div class="table-container">
  <el-table
    ref="tableRef"
    :data="tableData"
    v-loading="tableLoading"
    tooltip-effect="dark"
    height="calc(100vh - 252px)"
    empty-text="没有查询到数据，请修改查询条件"
    @selection-change="handleSelectionChange"
    @sort-change="handleSortChange"
    border
    show-summary
    :summary-method="summaryMethod"
    :size="size"
  >
    <el-table-column type="selection" width="55" />

    <el-table-column prop="state" label="状态" width="80" fixed>
      <span slot-scope="{row}" :class="row.state">{{ stateNameDict[row.state]}}</span>
      <!-- <template slot-scope="{row}">
        <el-select
          :value="row.state"
          :size="size"
          :disabled="row.state === 'archived'"
          :class="row.state"
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
      </template> -->
    </el-table-column>

    <el-table-column prop="portfolioId" label="Portfolios" width="120" fixed>
      <template slot-scope="{row}">
        {{ row.portfolioName }}
      </template>
    </el-table-column>

    <el-table-column prop="name" label="广告活动" width="120" sortable="custom"  fixed>
    </el-table-column>

    <el-table-column prop="targetingType" label="投放方式" width="120" >
      <template slot-scope="{row}">
        {{ targetingTypeDict[row.targetingType] }}
      </template>
    </el-table-column>

    <el-table-column prop="createdTime" label="创建时间" width="120" sortable="custom" >
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

    <el-table-column prop="groupNumber" label="广告组数量" width="100">
      <el-button
        slot-scope="{row}"
        type="text"
        :size="size"
        @click="handleClickGroupCount(row)"
      > {{ row.groupNumber }} </el-button>
    </el-table-column>

    <el-table-column prop="biddingStrategy" label="竞价策略" width="130">
      <template slot-scope="{row}">
        {{ biddingStrategyDict[row.biddingStrategy] }}
      </template>
    </el-table-column>

    <el-table-column prop="biddingPlacementTop" label="Top of Search" width="110">
      <template slot-scope="{row}">
        {{ row.biddingPlacementTop }}
      </template>
    </el-table-column>

    <el-table-column prop="biddingPlacementProductPage" label="Product page" width="110">
      <template slot-scope="{row}">
        {{ row.biddingPlacementProductPage }}
      </template>
    </el-table-column>

    <el-table-column prop="dailyBudget" label="日预算" width="110">
      <template slot-scope="{row}">
        {{ row.dailyBudget }}
      </template>
    </el-table-column>

    <el-table-column prop="negativeTargetingNumber" label="否定Targeting" width="110">
      <template slot-scope="{row}">
        {{ row.negativeTargetingNumber }}
      </template>
    </el-table-column>

    <el-table-column prop="startDate" label="开始时间" width="110">
      <span slot-scope="{row}" class="td_date_time">{{ row.startDate }}</span>
    </el-table-column>

    <el-table-column prop="endDate" label="结束时间" width="110">
      <span slot-scope="{row}" class="td_date_time">{{ row.endDate }}</span>
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
    :page-sizes="[20, 50, 100]"
    background
    layout="total, sizes, prev, pager, next, jumper"
    class="pagination"
  />
</div>
</template>

<script>
import {
  queryCampaignList,
} from '@/api/ppc/adManage';
import { stateNameDict, targetingTypeDict, biddingStrategyDict } from '../../utils/dict';
import { log } from '@/util/util';
import {
  getValueLocaleString,
  formatTableSortParams,
  getCommonColOption,
  getFormatTotal,
} from '../../utils/fun';

export default {
  name: 'Campaign',

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
    portfolioId: {
      type: String,
    },
  },

  data: function() {
    return {
      size: 'mini',
      stateNameDict,
      targetingTypeDict,
      biddingStrategyDict,
      tableData: [],
      tableTotalData: {},
      tableLoading: false,
      tablePageOption: { 
        total: 100,
        currentPage: 1, 
        pageSize: 20,
        pageSizes: [20, 50, 100],
      },
      tableSort: { prop: 'createdTime', order: 'descending' },
    };
  },

  computed: {
    commonColOption() {
      return getCommonColOption(this.currency);
    },
  },

  created() {
    this.getList();
  },

  updated () {
    // 解决表格合计行样式问题
    this.$refs.tableRef.doLayout();
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

    // 表格排序变化
    handleSortChange(val) {
      this.tableSort = { prop: val.prop, order: val.order };
      // 排序后回到第一页
      this.tablePageOption.currentPage = 1;
      this.getList();
    },

    // 点击广告组数量
    handleClickGroupCount(row) {
      log('点击广告组数量', row);
    },

    // 合计行数据
    summaryMethod({ columns }){
      const keys = Object.keys(this.tableTotalData);
      const sums = ['', '', '', '合计'];
      columns.forEach((column, index) => {
        if (keys.includes(column.property)) {
          sums[index] = this.tableTotalData[column.property];
        }
      });
      return sums;
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
  },
};
</script>

<style scoped lang="scss">
  @import "../common.scss";
</style>
