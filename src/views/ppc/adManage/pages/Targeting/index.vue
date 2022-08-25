<!-- Targeting（分类/商品投放） -->
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
    </el-table-column>

    <el-table-column prop="targeting" label="Targeting" width="200" sortable="custom" fixed />

    <el-table-column prop="matchType" label="匹配方式" width="80" />

    <el-table-column prop="campaignName" label="广告活动" width="200">
      <span slot-scope="{row}" class="campaignName">{{ row.campaignName }}</span>
    </el-table-column>

    <el-table-column prop="groupName" label="广告组" width="200">
    </el-table-column>

    <el-table-column prop="suggestedBid" label="建议竞价" width="150">
      <template slot-scope="{row}">
        <span v-if="suggestedBidLoading">正在加载...</span>
        <div v-else-if="row.suggestedBid" class="suggested_bid">
          <div>
            {{ row.suggestedBid.suggested }}
            <el-button
              @click="handleApplySuggestedBid(row)"
              :size="size"
              class="btn-apply_suggested_bid"
            >应用</el-button>
            </div>
          <div>
            ({{ getValueLocaleString({ value: row.suggestedBid.rangeStart, isFraction: true, prefix: currency }) }}
            -
            {{ getValueLocaleString({ value: row.suggestedBid.rangeEnd, isFraction: true, prefix: currency }) }})
          </div>
        </div>
        <span v-else>—</span>
      </template>
    </el-table-column>

    <el-table-column prop="bid" label="竞价" width="80">
      <span slot-scope="{row}">
        {{ getValueLocaleString({ value: row.bid, isFraction: true, prefix: currency }) }}
      </span>
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
</template>

<script>
import {
  queryTargetingList,
  queryTargetingSuggestedBid,
} from '@/api/ppc/adManage';
import { stateNameDict } from '../../utils/dict';
import { log } from '@/util/util';
import {
  getValueLocaleString,
  formatTableSortParams,
  getCommonColOption,
  parseTreeKey,
  getFormatTotal,
} from '../../utils/fun';

export default {
  name: 'Keyword',

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
      tableSort: { prop: 'addTime', order: 'descending' },
      suggestedBidLoading: false,
    };
  },

  computed: {
    commonColOption() {
      return getCommonColOption(this.currency);
    },
    // 父广告活动的ID
    campaignId() {
      const treeSelectedInfo = parseTreeKey(this.treeSelectedKey);
      return treeSelectedInfo.camId;
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
        adStoreId: this.storeId,
        marketplace: this.marketplace,
        portfolioId: this.portfolioId,
        campaignId: this.campaignId,
        ...body,
      };
      queryTargetingList(queryParams, bodyParams).then(res => {
        log('获取Targeting列表成功', queryParams, bodyParams);
        this.tableData = res.data.data.page.records;
        this.tablePageOption.total = res.data.data.page.total;
        this.tablePageOption.currentPage = res.data.data.page.current;
        this.tablePageOption.pageSize = res.data.data.page.size;
        // 合计数据格式化
        this.tableTotalData = getFormatTotal(res.data.data.total, this.currency);
        // 获取建议竞价
        this.suggestedBidLoading = true;
        const params = {
          adStoreId: this.storeId,
          ids: res.data.data.page.records.map(tg => tg.id),
        };
        queryTargetingSuggestedBid(params).then(suggestedBidRes => {
          const suggestedBidRecords = suggestedBidRes.data.data.records;
          // 更新列表
          const tableData = this.tableData.map(kw => {
            return {
              ...kw,
              suggestedBid: suggestedBidRecords.find(item => item.id === kw.id && item.suggested),
            };
          });
          this.tableData = tableData;
        }).finally(() => {
          this.suggestedBidLoading = false;
        });
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

    // 点击应用建议竞价
    handleApplySuggestedBid(row) {
      log('点击应用建议竞价', row);
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

<style scoped lang="scss">
.btn-apply_suggested_bid {
  padding: 4px 8px;
}
</style>
