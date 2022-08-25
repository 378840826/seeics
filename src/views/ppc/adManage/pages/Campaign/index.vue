<!-- 广告活动 -->
<template>
  <div class="table-container">
    <el-table
        ref="elTableRef"
        :data="tableData"
        v-loading="tableLoading"
        tooltip-effect="dark"
        height="calc(100vh - 200px)"
        empty-text="没有查询到数据，请修改查询条件"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        :size="size"
        show-summary
        :summary-method="getSummaries"
      >
        <el-table-column type="selection" width="50" align="center" />

        <el-table-column prop="state" label="状态" width="60">
          <template slot-scope="scope">{{ stateNameDict[scope.row.state] }}</template>
        </el-table-column>

        <el-table-column prop="portfolioId" label="Portfolios">
          <template slot-scope="scope">{{ scope.row.portfolioName }}</template>
        </el-table-column>

        <el-table-column prop="name" label="广告活动" width="200" />

        <el-table-column prop="targetingType" label="投放方式" width="100">
          <template slot-scope="scope">{{ targetingTypeDict[scope.row.targetingType] }}</template>
        </el-table-column>

        <el-table-column prop="createdTime" label="创建时间" width="100">
          <div slot="header">
            创建时间
            <el-tooltip effect="dark" content="北京时间" placement="top">
              <i class="el-icon-info icon-time_info"></i>
            </el-tooltip>
          </div>
          <span slot-scope="scope" class="created_time">
            {{ scope.row.createdTime }}
          </span>
        </el-table-column>

        <el-table-column prop="groupNumber" label="广告组数量">
          <el-button
            slot-scope="scope"
            type="text"
            :size="size"
            @click="handleClickGroupCount(scope.row)"
          > {{ scope.row.groupNumber }} </el-button>
        </el-table-column>

        <el-table-column prop="biddingStrategy" label="竞价策略" width="150">
          <el-select slot-scope="scope" :value="scope.row.biddingStrategy" :size="size">
            <el-option
              v-for="(value, key) in biddingStrategyDict"
              :key="key"
              :label="value"
              :value="key">
            </el-option>
          </el-select>
        </el-table-column>

        <el-table-column prop="biddingPlacementTop" label="Top of Search" width="110">
          <template slot-scope="scope">{{ scope.row.biddingPlacementTop }}</template>
        </el-table-column>

        <el-table-column prop="biddingPlacementProductPage" label="Product page" width="110">
          <template slot-scope="scope">{{ scope.row.biddingPlacementProductPage }}</template>
        </el-table-column>
        
        <el-table-column prop="dailyBudget" label="日预算" width="110">
          <template slot-scope="scope">{{ scope.row.dailyBudget }}</template>
        </el-table-column>

        <el-table-column prop="negativeTargetingNumber" label="否定Targeting" width="110">
          <template slot-scope="scope">{{ scope.row.negativeTargetingNumber }}</template>
        </el-table-column>

        <el-table-column prop="startDate" label="开始时间" width="110">
          <template slot-scope="scope">{{ scope.row.startDate }}</template>
        </el-table-column>
        
        <el-table-column prop="endDate" label="结束时间" width="110">
          <template slot-scope="scope">{{ scope.row.endDate }}</template>
        </el-table-column>

        <el-table-column prop="sales" label="销售额" width="110">
          <template slot-scope="scope">
            {{ getValueLocaleString({ value: scope.row.sales, isFraction: true, prefix: currency }) }}
          </template>
        </el-table-column>
      
        <el-table-column prop="orderNum" label="订单量" width="110">
          <template slot-scope="scope">{{ scope.row.orderNum }}</template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="60">
          <template slot-scope="scope">
            <el-button
              @click="handleCharts(scope.row)"
              style="color: #C0C4CC"
              type="text"
              :size="size"
            >分析</el-button>
          </template>
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
import {
  queryCampaignList,
} from '@/api/ppc/adManage';
import { stateNameDict, targetingTypeDict, biddingStrategyDict } from '../../utils/dict';
import { log } from '@/util/util';
import { getValueLocaleString } from '../../utils/fun';

export default {
  name: 'Campaign',

  props: {
    marketplace: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      size: 'mini',
      stateNameDict,
      targetingTypeDict,
      biddingStrategyDict,
      tableData: [],
      tableLoading: false,
    };
  },

  computed: {

  },

  created() {
    this.getList();
  },

  updated () {
    this.$nextTick(() => {
      // 解决合计样式问题
      this.$refs.elTableRef.doLayout();
    });
    // console.log('.....', this.$store.state.shop.list);

  },

  methods: {
    getValueLocaleString,
    // 获取列表
    getList() {
      queryCampaignList().then(res => {
        this.tableData = res.data.records;
      });
    },

    // 点击广告组数量
    handleClickGroupCount(row) {
      log('点击广告组数量', row);
    },

    // 合计行数据
    getSummaries(param) {
      const { columns, data } = param;
      log('param', columns, data);
      const sums = ['', '合计:'];
      return sums;
    },

    // 点击分析
    handleCharts(row) {
      log('分析', row);
    },
  },
};
</script>

<style scoped lang="scss">
.created_time {
  word-break: break-word;
}

.icon-time_info {
  color: $warningColor; 
}

::v-deep {
  .el-table th {
    color: $textColor;
  }
}
</style>
