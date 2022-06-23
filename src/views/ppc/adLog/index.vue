<!-- 广告日志(调整日志) -->
<template>
  <basic-container>
    <!-- 筛选栏 -->
    <div class="filter-container">
      <!-- 店铺名称  -->
      <el-select
        v-model="form.shopName"
        placeholder="请选择店铺"
        :size="componentsSize"
        @change="handleChangeShopName"
      >
        <el-option
          v-for="item in filterOptions.shopNameList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>

      <!-- 站点  -->
      <el-select
        v-model="form.marketplace"
        placeholder="请选择站点"
        :size="componentsSize"
        @change="getTableData()"
        class="select-marketplace"
      >
        <el-option
          v-for="item in filterOptions.marketplaceList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>

      <!-- 广告类型 -->
      <el-select
        v-model="form.adType"
        placeholder="广告类型"
        :size="componentsSize"
        @change="getTableData()"
        clearable
        multiple
        class="select-multiple"
      >
        <el-option
          v-for="item in filterOptions.adType"
          :key="item"
          :label="campaignTypeDict[item]"
          :value="item"
        />
      </el-select>

      <!-- 广告对象 -->
      <el-select
        v-model="form.entityType"
        placeholder="广告对象"
        :size="componentsSize"
        @change="getTableData()"
        clearable
        multiple
        collapse-tags
        class="select-multiple"
      >
        <el-option
          v-for="item in filterOptions.entityType"
          :key="item"
          :label="adObjectTypeDict[item]"
          :value="item"
        />
      </el-select>

      <!-- 执行操作 -->
      <el-select
        v-model="form.action"
        placeholder="执行操作"
        :size="componentsSize"
        @change="getTableData()"
        clearable
      >
        <el-option
          v-for="item in filterOptions.actionList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>

      <!-- 广告活动 -->
      <el-select
        v-model="form.campaignId"
        placeholder="搜索并选择广告活动"
        filterable
        remote
        clearable
        @change="getTableData()"
        :remote-method="getCampaignList"
        :size="componentsSize"
        :loading="loading.campaignList"
        class="select"
        popper-class="seeics-ad_log-select"
      >
        <el-option
          v-for="item in filterOptions.campaignList"
          :key="item.campaignId"
          :label="item.name"
          :value="item.campaignId"
        />
      </el-select>

      <!-- 广告组 -->
      <el-select
        v-if="form.campaignId"
        v-model="form.groupId"
        placeholder="搜索选择广告组"
        filterable
        remote
        @change="getTableData()"
        :remote-method="getGroupList"
        :size="componentsSize"
        :loading="loading.groupList"
        class="select"
        popper-class="seeics-ad_log-select"
      >
        <el-option
          v-for="item in filterOptions.groupList"
          :key="item.groupId"
          :label="item.name"
          :value="item.groupId"
        />
      </el-select>

      <!-- 搜索操作对象 -->
      <el-input
        placeholder="筛选操作对象"
        v-model="form.actionEntity"
        class="input-with-select"
        :size="componentsSize"
        clearable
        @clear="getTableData()"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="getTableData({ current: 1 })"
        >搜索</el-button>
      </el-input>

      <!-- 日期范围 -->
      <el-date-picker
        v-model="form.dateRange"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="getTableData()"
        :picker-options="pickerOptions"
        :size="componentsSize"
        class="date_picker"
      />
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table
        :data="tableData"
        :size="componentsSize"
        v-loading="loading.table"
        tooltip-effect="dark"
        height="calc(100vh - 306px)"
        empty-text="没有查询到数据，请修改查询条件"
        border
      >
        <el-table-column prop="actionTime" width="96" fixed>
          <template slot="header">
            <div>
              操作时间
              <el-tooltip class="item" effect="dark" content="站点时间" placement="top">
                <i class="el-icon-info icon-time_info"></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="shopName" label="店铺站点" width="100">
          <template slot-scope="scope">
            {{ scope.row.marketplace }}-{{ scope.row.shopName }}
          </template>
        </el-table-column>

        <el-table-column prop="adType" label="广告类型" width="80" />
        
        <el-table-column prop="actionEntity" label="操作对象" width="200px" />

        <el-table-column prop="entityType" label="对象类型">
          <template slot-scope="scope">
            {{ adObjectTypeDict[scope.row.entityType] }}
          </template>
        </el-table-column>

        <el-table-column prop="camName" label="广告活动" width="200px" />
        <el-table-column prop="groupName" label="广告组" width="200px" />
        <el-table-column prop="actionMode" label="操作方式" width="80px" />
        <el-table-column prop="action" label="执行操作" width="120px" />

        <el-table-column prop="oldValue" label="操作前" width="120px">
          <template slot-scope="scope">
            {{ scope.row.oldValue === '' ? '—' : scope.row.oldValue }}
          </template>
        </el-table-column>

        <el-table-column prop="newValue" label="操作后" width="120px">
          <template slot-scope="scope">
            {{ scope.row.newValue === '' ? '—' : scope.row.newValue }}
          </template>
        </el-table-column>

        <el-table-column prop="actionResult" label="操作结果" width="80px" />
        <el-table-column prop="actionUserName" label="操作人" />
        <el-table-column prop="automationTemplateName" label="关联策略模板" width="200" />
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @current-change="getTableData()"
        @size-change="getTableData({ current: 1 })"
        :current-page.sync="tablePageOption.current"
        :page-size.sync="tablePageOption.size"
        :total="tablePageOption.total"
        :page-sizes="tablePageSizesOption"
        background
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
      />
    </div>
  </basic-container>
</template>

<script>
import {
  queryShopNameList,
  queryMarketplaceList,
  queryCampaignList,
} from '@/api/ppc/autoAd';
import { queryTable } from '@/api/ppc/adLog';
import { queryGroups as queryGroupList } from '@/api/ppc/searchTerm';
import {
  actionList,
  campaignTypeDict,
  adObjectTypeDict,
  formatTableSortParams,
} from '../util';
import { getDateRangeForKey } from '@/util/date';

// 日期选择器配置
const pickerOptions = {
  // 限制可选日期为最近 60 天
  disabledDate: (time) => {
    const nowDate = (new Date()).getTime();
    const durationTime = 60 * 24 * 3600 * 1000;
    const twoMonths = nowDate - durationTime;
    return time.getTime() > Date.now() || time.getTime() < twoMonths;
  },
  // 快捷选项
  shortcuts: [
    {
      text: '今日',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey(0));
      }
    }, {
      text: '昨日',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey('yesterday'));
      }
    }, {
      text: '上周',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey('lastWeek'));
      }
    }, {
      text: '上月',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey('lastMonth'));
      }
    }, {
      text: '最近7天',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey(7));
      }
    }, {
      text: '最近30天',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey(30));
      }
    }, {
      text: '最近60天',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey(60));
      }
    },
  ],
};

export default {
  name: 'adLog',

  data() {
    return {
      actionList,
      campaignTypeDict,
      adObjectTypeDict,
      pickerOptions,
      componentsSize: 'small',
      form: {
        // 操作对象
        actionEntity: '',
        adStoreId: '',
        shopName: '',
        marketplace: '',
        // 广告类型
        adType: [],
        // 广告对象
        entityType: [],
        // 执行操作
        action: '',
        campaignId: '',
        groupId: '',
        // 日期范围，默认最近 30 天
        dateRange: getDateRangeForKey(30),
      },
      filterOptions: {
        shopNameList: [],
        marketplaceList: [],
        adType: Object.values(campaignTypeDict),
        entityType: Object.keys(adObjectTypeDict),
        actionList,
        campaignList: [],
        groupList: [],
      },
      tableData: [],
      loading: {
        table: false,
        campaignList: false,
        groupList: false,
      },
      tablePageOption: { 
        total: 100,
        current: 1, 
        size: 20,
        pages: 1,
      },
      tableSort: {
        prop: '',
        order: '',
      },
      tablePageSizesOption: [20, 50, 100],
    };
  },

  created() {
    // 店铺名称
    queryShopNameList().then(res => {
      this.loading.table = true;
      const list = res.data.data.sort((a, b) => a.localeCompare(b));
      console.log('res.data.data', res.data);
      this.filterOptions.shopNameList = list;
      this.form.shopName = list[0];
      // 用第一个店铺名称来请求站点列表和表格数据
      this.getMarketplaceListAndTableData(list[0]);
    });
    // 智能广告跳转 queryString 中的广告活动数据
    this.initParams();
  },

  methods: {
    // 获取 qs 跳转参数并初始化数据
    initParams() {
      const query = this.$route.query;
      // queryString 中的广告活动数据
      if (query.campaignId && query.campaignName) {
        this.filterOptions.campaignList.push({
          campaignId: query.campaignId,
          name: query.campaignName,
        });
        this.form.campaignId = query.campaignId;
        this.$router.replace('');
      }
    },
    
    // 获取表格数据
    getTableData(params) {
      this.loading.table = true;
      // 处理排序数据
      const sortParams = formatTableSortParams(this.tableSort);
      const queryParams = {
        actionEntity: this.form.actionEntity.trim(),
        shopName: this.form.shopName,
        adStoreId: this.form.adStoreId,
        marketplace: this.form.marketplace,
        adType: this.form.adType,
        entityType: this.form.entityType,
        camId: this.form.campaignId,
        groupId: this.form.groupId,
        action: this.form.action,
        startTime: this.form.dateRange[0],
        endTime: this.form.dateRange[1],
        ...this.tablePageOption,
        ...sortParams,
        ...params,
      };
      console.log('queryParams', queryParams);
      queryTable(queryParams).then(res => {
        const resData = res.data.data;
        this.tableData = resData.records;
        this.tablePageOption.total = resData.total;
        this.tablePageOption.size = resData.size;
        this.tablePageOption.current = resData.current;
        this.tablePageOption.pages = resData.pages;
      }).finally(() => {
        this.loading.table = false;
      });
    },

    // 获取站点列表并用第一个站点请求表格
    getMarketplaceListAndTableData(shopName) {
      queryMarketplaceList({ shopName }).then(mRes => {
        const mList = mRes.data.data.map(m => m.name).sort((a, b) => a.localeCompare(b));
        this.filterOptions.marketplaceList = mList;
        this.form.marketplace = mList[0];
        // 获取列表
        this.getTableData();
      });
    },

    // 切换店铺名称
    handleChangeShopName(shopName) {
      // 用新的 shopName 请求站点列表和表格数据
      this.getMarketplaceListAndTableData(shopName);
    },

    // 获取广告活动列表
    getCampaignList(query) {
      if (query !== '') {
        this.loading.campaignList = true;
        const param = {
          name: query.trim(),
          shopName: this.form.shopName,
          marketplace: this.form.marketplace,
        };
        queryCampaignList(param).then(res => {
          const list = res.data.data.records.map(item => ({
            ...item,
            label: item.name,
            value: item.campaignId,
          }));
          this.filterOptions.campaignList = [...list];
        }).finally(() => {
          this.loading.campaignList = false;
        });
      } else {
        this.filterOptions.campaignList = [];
      }
    },

    // 获取广告组列表
    getGroupList(query) {
      if (query !== '') {
        this.loading.groupList = true;
        const param = {
          name: query.trim(),
          shopName: this.form.shopName,
          marketplace: this.form.marketplace,
        };
        queryGroupList(param).then(res => {
          const list = res.data.data.records.map(item => ({
            ...item,
            label: item.name,
            value: item.groupId,
          }));
          this.filterOptions.groupList = [...list];
        }).finally(() => {
          this.loading.groupList = false;
        });
      } else {
        this.filterOptions.groupList = [];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  @import "./index.scss";
</style>


<style lang="scss">
// 广告活动、广告组 select 的下拉框
.seeics-ad_log-select.el-select-dropdown.el-popper {
  .seeics-st-check_all {
    padding: 3px 10px;
    display: flex;
    justify-content: flex-end;
  }

  li.el-select-dropdown__item {
    max-width: 400px;
    line-height: 20px;
    padding: 6px 20px;
    white-space: normal;
    word-break: break-all;

    span {
      padding: 0;
      line-height: 20px;
    }
  }
}
</style>