<!-- 广告活动 -->
<!-- 表格采用 avue， 卡顿明显 -->
<template>
  <div class="table-container">
    <!-- 表格 -->
    <avue-crud
      ref="tableRef"
      :data="tableData"
      :option="getTableOption(this.currency, this.tableSort)"
      @on-load="getList()"
      @row-del="handleDelte"
      :page.sync="tablePageOption"
      @current-change="handleCurrentPageChange"
      @size-change="handlePageSizeChange"
      :table-loading="tableLoading"
      :summary-method="summaryMethod"
      @sort-change="handleSortChange"
    >
      <template type="selection" width="50" align="center" />

      <!-- 状态 -->
      <template slot-scope="{row}" slot="state">
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
      </template>

      <template slot-scope="{row}" slot="portfolioId">{{ row.portfolioName }}</template>

      <template slot-scope="{row}" slot="name">{{ row.name }}</template>

      <template slot-scope="{row}" slot="targetingType">{{ targetingTypeDict[row.targetingType] }}</template>

      <template slot="createdTimeHeader">
        创建时间
        <el-tooltip effect="dark" content="北京时间" placement="top">
          <i class="el-icon-info icon-time_info"></i>
        </el-tooltip>
      </template>
      <template slot-scope="{row}" slot="createdTime">
        <span class="td_date_time">{{ row.createdTime }}</span>
      </template>

      <template slot-scope="{row}" slot="groupNumber">
        <el-button
          type="text"
          :size="size"
          @click="handleClickGroupCount(row)"
        > {{ row.groupNumber }} </el-button>
      </template>

      <template slot-scope="{row}" slot="biddingStrategy">
        <el-select :value="row.biddingStrategy" :size="size">
          <el-option
            v-for="(value, key) in biddingStrategyDict"
            :key="key"
            :label="value"
            :value="key">
          </el-option>
        </el-select>
      </template>

      <template slot-scope="{row}" slot="startDate">
        <span class="td_date_time">{{ row.startDate }}</span>
      </template>

      <template slot-scope="{row}" slot="endDate">
        <span class="td_date_time">{{ row.endDate }}</span>
      </template>

      <!-- 操作 -->
      <template slot-scope="{row}" slot="menu">
        <el-button
          @click="handleCharts(row)"
          style="color: #C0C4CC"
          type="text"
          :size="size"
        >分析</el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import {
  queryCampaignList,
} from '@/api/ppc/adManage';
import { stateNameDict, targetingTypeDict, biddingStrategyDict } from '../../utils/dict';
import { log } from '@/util/util';
import { getValueLocaleString, getCommonColOption, formatTableSortParams } from '../../utils/fun';

// 表格的配置
function getTableOption(currency, defaultSort) {
  const tableOption = {
    defaultSort,
    emptyText: '未查询到数据',
    delBtn: false,
    addBtn: false,
    editBtn: false,
    border: true,
    cellBtn: true,
    selection: true,
    selectClearBtn: false,
    refreshBtn: false,
    columnBtn: false,
    height: 'auto',
    calcHeight: 120,
    menuWidth: 60,
    showSummary: true,
    column: [
      {
        label: '状态',
        prop: 'state',
        fixed: 'left',
        width: 80,
      }, {
        label: 'Portfolios',
        prop: 'portfolioId',
        fixed: 'left',
        width: 100,
      }, {
        label: '广告活动',
        prop: 'name',
        fixed: 'left',
        sortable: 'custom',
        width: 200,
      }, {
        label: '投放方式',
        prop: 'targetingType',
        width: 100,
      }, {
        label: '创建时间',
        prop: 'createdTime',
        sortable: 'custom',
        headerslot: true,
        width: 110,
      }, {
        label: '广告组数量',
        prop: 'groupNumber',
        width: 100,
      }, {
        label: '竞价策略',
        prop: 'biddingStrategy',
        width: 130,
      }, {
        label: 'Top of Search',
        prop: 'biddingPlacementTop',
        formatter: (_, value) => getValueLocaleString({ value, isFraction: true, suffix: '%' }),
        width: 110,
      }, {
        label: 'Product page',
        prop: 'biddingPlacementProductPage',
        formatter: (_, value) => getValueLocaleString({ value, isFraction: true, suffix: '%' }),
        width: 110,
      }, {
        label: '日预算',
        prop: 'dailyBudget',
        formatter: (_, value) => getValueLocaleString({ value, isFraction: true, prefix: currency }),
        width: 110,
      }, {
        label: '否定Targeting',
        prop: 'negativeTargetingNumber',
        width: 110,
      }, {
        label: '开始时间',
        prop: 'startDate',
        width: 110,
      }, {
        label: '结束时间',
        prop: 'endDate',
        width: 110,
      },
      ...getCommonColOption(currency),
    ],
  };
  return tableOption;
}

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

  },

  created() {
    // this.getList();
  },

  updated () {
    // 解决表格合计行样式问题
    // this.$refs.tableRef.refreshTable();
  },

  methods: {
    getValueLocaleString,
    getTableOption,
    formatTableSortParams,
    // 获取列表
    getList(query, body) {
      this.tableLoading = true;
      const queryParams = {
        current: this.tablePageOption.currentPage,
        size: this.tablePageOption.pageSize,
        ...query,
      };
      const bodyParams = {
        storeId: this.storeId,
        marketplace: this.marketplace,
        portfolioId: this.portfolioId,
        ...body,
      };
      queryCampaignList(queryParams, bodyParams).then(res => {
        log('获取列表成功', queryParams, bodyParams);
        this.tableData = res.data.data.page.records;
        this.tablePageOption.total = res.data.data.page.total;
        this.tablePageOption.currentPage = res.data.data.page.current;
        this.tablePageOption.pageSize = res.data.data.page.size;
        // 合计数据格式化
        const {
          sales, orderNum, impressions, clicks, spend, acos, roas, ctr, cpc, cpa, conversionsRate,
        } = res.data.data.total;
        this.tableTotalData = {
          sales: getValueLocaleString({ value: sales, isFraction: true, prefix: this.currency }),
          orderNum: getValueLocaleString({ value: orderNum }),
          impressions: getValueLocaleString({ value: impressions }),
          clicks: getValueLocaleString({ value: clicks }),
          spend: getValueLocaleString({ value: spend, isFraction: true, prefix: this.currency }),
          acos: getValueLocaleString({ value: acos, isFraction: true, suffix: '%' }),
          roas: getValueLocaleString({ value: roas, isFraction: true, }),
          ctr: getValueLocaleString({ value: ctr, isFraction: true, suffix: '%' }),
          cpc: getValueLocaleString({ value: cpc, isFraction: true, prefix: this.currency }),
          cpa: getValueLocaleString({ value: cpa, isFraction: true, prefix: this.currency }),
          conversionsRate: getValueLocaleString({ value: conversionsRate, isFraction: true, suffix: '%' }),
        };
        // 解决表格合计行样式问题
        this.$refs.tableRef.refreshTable();
      }).finally(() => {
        this.tableLoading = false;
      });
    },

    // 表格排序变化
    handleSortChange(val) {
      const qs = this.formatTableSortParams(val);
      this.tableSort = { prop: val.prop, order: val.order };
      this.getList(qs);
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
    portfolioId(val) {
      log('广告活动 watch portfolioId', val);
    },
  },
};
</script>

<style scoped lang="scss">
  @import "../common.scss";
</style>

<style scoped lang="scss">
.td_date_time {
  word-break: break-word;
}

.icon-time_info {
  color: $warningColor; 
}

::v-deep {
  .avue-crud__menu {
    display: none;
  }

  .avue-crud__tip {
    display: none;
  }
}
</style>
