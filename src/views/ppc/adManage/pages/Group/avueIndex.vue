<!-- 广告组 -->
<!-- 表格采用 avue， 卡顿明显 -->
<template>
  <div class="table-container">
    <!-- 表格 -->
    <avue-crud
      ref="tableRef"
      :data="tableData"
      :option="getTableOption(this.currency)"
      @on-load="getList()"
      @row-del="handleDelte"
      :page.sync="tablePageOption"
      @current-change="handleCurrentPageChange"
      @size-change="handlePageSizeChange"
      :table-loading="tableLoading"
      :summary-method="summaryMethod"
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

      <template slot-scope="{row}" slot="campaignName">{{ row.campaignName }}</template>

      <template slot-scope="{row}" slot="name">{{ row.name }}</template>

      <template slot="createdTimeHeader">
        创建时间
        <el-tooltip effect="dark" content="北京时间" placement="top">
          <i class="el-icon-info icon-time_info"></i>
        </el-tooltip>
      </template>
      <template slot-scope="{row}" slot="createdTime">
        <span class="td_date_time">{{ row.createdTime }}</span>
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
  queryGroupList,
} from '@/api/ppc/adManage';
import { stateNameDict } from '../../utils/dict';
import { log } from '@/util/util';
import { getValueLocaleString, getCommonColOption, parseTreeKey } from '../../utils/fun';

// 表格的配置
function getTableOption(currency) {
  const tableOption = {
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
    calcHeight: 178,
    menuWidth: 60,
    showSummary: true,
    column: [
      {
        label: '状态',
        prop: 'state',
        fixed: 'left',
        width: 80,
      }, {
        label: '广告活动',
        prop: 'campaignName',
        fixed: 'left',
        width: 200,
      }, {
        label: '广告组',
        prop: 'name',
        fixed: 'left',
        width: 200,
      }, {
        label: '创建时间',
        prop: 'createdTime',
        headerslot: true,
        width: 100,
      }, {
        label: '默认竞价',
        prop: 'defaultBid',
        formatter: (_, value) => getValueLocaleString({ value, isFraction: true, prefix: currency }),
        width: 100,
      }, {
        label: '广告个数',
        prop: 'productNumber',
        formatter: (_, value) => getValueLocaleString({ value }),
        width: 100,
      }, {
        label: 'Targeting',
        prop: 'targetingNumber',
        formatter: (_, value) => getValueLocaleString({ value }),
        width: 100,
      }, {
        label: '否定Targeting',
        prop: 'negativeTargetingNumber',
        formatter: (_, value) => getValueLocaleString({ value }),
        width: 110,
      }, {
        label: '开始时间',
        prop: 'startDate',
        width: 110,
      }, {
        label: '结束时间',
        prop: 'endDate',
        width: 110,
      }, {
        label: '预算控制',
        prop: 'budgetLimit',
        formatter: (_, value) => getValueLocaleString({ value, isFraction: true, prefix: currency }),
        width: 110,
      }, 
      ...getCommonColOption(currency),
    ],
  };
  return tableOption;
}

export default {
  name: 'Group',

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
      tableData: [],
      tableTotalData: {},
      tableLoading: false,
      tablePageOption: { 
        total: 100,
        currentPage: 1, 
        pageSize: 20,
        pageSizes: [20, 50, 100],
      },
    };
  },

  computed: {
    campaignId() {
      const treeSelectedInfo = parseTreeKey(this.treeSelectedKey);
      return treeSelectedInfo.camId;
    },
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
    // 获取列表
    getList() {
      const queryParams = {
        current: this.tablePageOption.currentPage,
        size: this.tablePageOption.pageSize,
      };
      const bodyParams = { storeId: this.storeId, marketplace: this.marketplace };
      log('获取广告组列表', queryParams, bodyParams);
      queryGroupList(queryParams, bodyParams).then(res => {
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
      });
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
