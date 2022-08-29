<!-- 广告 -->
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
</template>

<script>
import {
  queryAdList,
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
  name: 'Ad',

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
        campaignId: this.treeSelectedInfo.campaignId,
        groupId: this.treeSelectedInfo.groupId,
        ...body,
      };
      queryAdList(queryParams, bodyParams).then(res => {
        log('获取广告列表成功', queryParams, bodyParams);
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
