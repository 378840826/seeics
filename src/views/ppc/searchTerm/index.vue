<!-- 广告 SearchTerm -->
<template>
  <basic-container>
    <!-- 日期 -->
    <div class="date-bar">
      <div class="update_time">
        更新时间: {{ reportUpdateTime }}
      </div>
      <div>
        <span class="cycleTitle">筛选周期：</span>
       <el-select
          v-model="form.cycleType"
          :size="size"
        >
          <el-option label="最近7天" value="7" />
          <el-option label="最近14天" value="14" />
          <el-option label="最近21天" value="21" />
          <el-option label="最近30天" value="30" />
          <el-option label="最近60天" value="60" />
          <el-option label="最近90天" value="90" />
        </el-select>
      </div>
    </div>

    <!-- 查询和筛选 -->
    <div class="form">
      <div class="search">
        <!-- 店铺站点:  -->
        <el-select
          v-model="form.mwsStoreId"
          filterable
          placeholder="请选择店铺"
          :size="size"
        >
          <el-option
            v-for="item in shopList"
            :key="item.id"
            :label="`${item.marketplace}-${item.storeName}`"
            :value="item.id"
          />
        </el-select>
        <!-- 广告活动:  -->
        <avue-select
          v-model="form.campaginIds"
          :dic="campaignList"
          :size="size"
          all
          multiple
          filterable
          clearable
          tags
          placeholder="请选择广告活动"
          :no-data-text="noDataText"
          class="avue-select seeics-avue-select"
        />
        <!-- 广告组:  -->
        <avue-select
          v-model="form.groupIds"
          :dic="groupList"
          :size="size"
          all
          multiple
          filterable
          clearable
          tags
          placeholder="请选择广告组"
          :no-data-text="noDataText"
          class="avue-select seeics-avue-select"
        />

        <el-autocomplete
          v-model="form.searchKeyword"
          :fetch-suggestions="searchQueryKwAsync"
          :size="size"
          placeholder="搜索搜索词"
          clearable
          debounce="100"
          trigger-on-focus="false"
          @focus="handleFocusQueryKeyword"
        />

        <el-autocomplete
          v-model="form.launchKeyword"
          :fetch-suggestions="searchPutKwAsync"
          :size="size"
          placeholder="搜索投放词"
          clearable
          debounce="100"
          trigger-on-focus="false"
          @focus="handleFocusPutKeyword"
        />

        <el-select
          v-model="form.deliveryStatus"
          placeholder="投放状态"
          clearable
          :size="size"
        >
          <el-option label="已投放" value="1" />
          <el-option label="未投放" value="0" />
        </el-select>

        <el-popover
          placement="bottom"
          width="200"
          trigger="click"
        >
        <el-button slot="reference" :size="size">ASIN批量查询</el-button>
          <div>
            <el-input
              class="asin-textarea"
              v-model="form.asinMskuKeyword"
              placeholder="支持ASIN批量查询，搜索ASIN，找到ASIN相关的关键词；最多20个ASIN，换行间隔；"
              type="textarea"
              :rows="10"
              @input="handleTextAreaInput"
            />
          </div>
        </el-popover>
      </div>

      <!-- 筛选 -->
      <div class="filtrate">
        <div class="filtrate-content">
          <RangeInput label="ABA排名：" :valueFilter="strToMoneyStr" v-model="form.filter.aba" />
          <RangeInput label="订单量：" :valueFilter="strToMoneyStr" v-model="form.filter.orderNum" />
          <RangeInput label="Impressions："  :valueFilter="strToMoneyStr" v-model="form.filter.impressions" />
          <RangeInput
            v-show="isCollapseExpand"
            label="Clicks：" 
            :valueFilter="strToMoneyStr"
            v-model="form.filter.clicks"
          />
          <RangeInput
            v-show="isCollapseExpand"
            label="Spend：" 
            :valueFilter="strToMoneyStr"
            v-model="form.filter.spend"
          />
          <RangeInput
            v-show="isCollapseExpand"
            label="转化率(%)：" 
            :valueFilter="strToMoneyStr"
            v-model="form.filter.conversion"
          />
          <RangeInput
            v-show="isCollapseExpand"
            label="销售额：" 
            :valueFilter="strToMoneyStr"
            v-model="form.filter.salesVolume"
          />
          <RangeInput
            v-show="isCollapseExpand"
            label="ACoS(%)：" 
            :valueFilter="strToMoneyStr"
            v-model="form.filter.acos"
          />
          <RangeInput
            v-show="isCollapseExpand"
            label="CTR(%)：" 
            :valueFilter="strToMoneyStr"
            v-model="form.filter.ctr"
          />
          <RangeInput
            v-show="isCollapseExpand"
            label="CPC：" 
            :valueFilter="strToMoneyStr"
            v-model="form.filter.cpc"
          />
          <RangeInput
            v-show="isCollapseExpand"
            label="CPA：" 
            :valueFilter="strToMoneyStr"
            v-model="form.filter.cpa"
          />
          <RangeInput
            v-show="isCollapseExpand"
            label="RoAS：" 
            :valueFilter="strTo4Str"
            v-model="form.filter.roas"
          />
        </div>
        <div class="filtrate-btns">
          <el-button
            v-if="!isCollapseExpand"
            class="expand-btn"
            type="text"
            icon="el-icon-arrow-down"
            size="mini"
            @click="handleCollapseExpand"
          >展开</el-button>
          <el-button
            v-else
            class="expand-btn"
            type="text"
            icon="el-icon-arrow-up"
            size="mini"
            @click="handleCollapseExpand"
          >收起</el-button>
        </div>
      </div>

      <div class="form-footer-container">
        <div class="tag-container">
          <el-tag
            v-for="tag in tags"
            :key="tag.name"
            closable
            disable-transitions="false"
            type="info"
            @close="handleTagClose(tag.key)"
          >
            {{tag.name}}
            <template v-if="['转化率', 'CTR', 'ACoS'].includes(tag.name)">(%)</template>
            ：<span class="tag-value">{{tag.value}}</span>
          </el-tag>
        </div>
        <div class="form-footer-btns">
          <el-button @click="handleSave" size="mini">保存偏好</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleSubmit" size="mini">确 定</el-button>
          <el-button type="text" @click="handleEmpty" size="mini">清空</el-button>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <avue-crud
      :data="tableData"
      :option="tableOption"
      @on-load="getTableData()"
      @row-del="handleDelte"
      :page.sync="tablePageOption"
      @current-change="handleCurrentPageChange"
      @size-change="handlePageSizeChange"
      :table-loading="tableLoading"
    >

    <!-- 店铺站点 -->
      <template slot-scope="{row}" slot="marketplaceVoList">
        <span v-for="(item, index) in row.marketplaceVoList" :key="item">
          <template v-if="index === 0">
            {{ item.marketplace }}-{{ item.storeName }}
          </template>
          <template v-else>
            、 {{ item.marketplace }}-{{ item.storeName }}
          </template>
        </span>
      </template>

      <!-- 筛选条件 -->
       <template slot-scope="{row}" slot="filterConditionVo">
        <div class="filter_condition_col-container">
          <el-tag
            v-for="(val, key) in row.filterConditionVoShow"
            :key="key"
            type="info"
          >
            <!-- 广告活动数组和广告组数组 -->
            <el-tooltip
              v-if="['广告活动', '广告组'].includes(filterKeyToNameDict[key])"
              effect="dark"
              placement="top-start"
            >
              <template slot="content">
                <div v-for="v in val" :key="v">
                  {{ v }}、
                </div>
              </template>
              <span >
                {{ filterKeyToNameDict[key] }}: 
                {{ getFilterConditionVoArrShow(val) }}
              </span>
            </el-tooltip>
            <!-- 批量查询限制长度 -->
            <el-tooltip
              v-else-if="key === 'asinMskuKeyword'"
              effect="dark"
              :content="val"
              placement="top-start"
            >
              <span class="asinMskuKeywordTagShow">
                {{ filterKeyToNameDict[key] }}: 
                <span>{{ val }}</span>
              </span>
            </el-tooltip>
            <span v-else>
              {{ filterKeyToNameDict[key] }}
              <template v-if="['转化率', 'CTR', 'ACoS'].includes(filterKeyToNameDict[key])">(%)</template>
              : {{ val }}
            </span>
          </el-tag>
        </div>
      </template>

      <!-- 操作 -->
      <template slot-scope="{row}" slot="menu">
        <div class="table-menu">
          <el-button
            type="primary"
            class="btn-result"
            :size="size"
            icon="el-icon-download"
            @click="handleDownload(row.id)"
          >导出结果</el-button>
          <el-button
            type="primary"
            class="btn-result"
            :size="size"
            @click="handleClickKwRanking(row)"
          >关键词排名</el-button>
        </div>
      </template>
      
    </avue-crud>
  </basic-container>
</template>
<script>
import {
  queryCampaigns,
  queryGroups,
  savePreference,
  queryPreference,
  querySearchTermList,
  querySearchTerm,
  queryGroupKeywordList,
  downloadReport,
  querySearchKeyword,
  createAsinKeyworkRanking,
} from '@/api/ppc/searchTerm';
import RangeInput from './components/RangeInput';
import DateRangePicker from './components/DateRangePicker';
import { strToMoneyStr, strTo4Str } from '@/util/numberString';
// import { log } from '@/util/util';
import {
  changeFilterType,
  getFilterConditionVoShow,
  rangeFilterKeyToNameDict,
  filterKeyToNameDict,
  deliveryStatusDict,
  changeFilterTypeToObj,
  getFilterConditionVoArrShow,
  downloadATag,
  addBlurTriggerInputEvent,
} from './utils';

// 表格配置
const tableOption = {
  emptyText: '暂无数据',
  delBtn: false,
  addBtn: false,
  editBtn: false,
  border: true,
  cellBtn: true,
  refreshBtn: false,
  columnBtn: false,
  menuWidth: 140,
  column: [
    {
      label: '更新时间',
      prop: 'searchTime',
      width: 160,
    }, {
      label: '店铺站点',
      prop: 'marketplaceVoList',
    }, {
      label: '筛选条件',
      prop: 'filterConditionVo',
      width: window.screen.width * 0.5,
    },
  ],
};

export default {
  name: 'SearchTerm',

  components: {
    RangeInput,
    DateRangePicker,
  },

  created() {
    this.filterKeyToNameDict = filterKeyToNameDict;
    // 加载偏好
    this.getPreference();
    // 加载店铺
    !this.shopList.length && this.$store.dispatch('getShopList');
  },

  mounted() {
    // 临时解决 avue-select 组件的搜索 bug
    addBlurTriggerInputEvent('.seeics-avue-select input');
  },

  data() {
    return {
      tableLoading: false,
      submitLoading: false,
      tableData: [],
      tableOption,
      tablePageOption: { 
        total: 100,
        currentPage: 1, 
        pageSize: 50,
        pageSizes: [20, 50, 100],
      },
      reportUpdateTime: '正在查询...',
      // 组件 size
      size: 'small',
      // 筛选折叠面板
      isCollapseExpand: false,
      // 请求供选择的关键词的 flag，用于避免不必要的请求
      flagGetKeywordList: {
        put: false,
        query: false,
      },
      // 供选择的投放词、搜索词
      putKeywordList: [],
      queryKeywordList: [],
      // 显示的广告活动、广告组（广告活动、广告组选中时，需要筛选出对应的父子关系）
      campaignList: [],
      groupList: [],
      // 全店的广告活动、广告组
      allCampaigns: [],
      allGroups: [],
      // 需要提交的数据
      form: {
        cycleType: '30',
        mwsStoreId: '',
        campaginIds: [],
        groupIds: [],
        // 投放词
        launchKeyword: '',
        // 搜索词
        searchKeyword: '',
        // 投放状态
        deliveryStatus: '',
        // 批量 asin 和 sku
        asinMskuKeyword: '',
        // 筛选
        filter: {
          salesVolume: { min: '', max: '' },
          spend: { min: '', max: '' },
          clicks: { min: '', max: '' },
          aba: { min: '', max: '' },
          conversion: { min: '', max: '' },
          orderNum: { min: '', max: '' },
          acos: { min: '', max: '' },
          ctr: { min: '', max: '' },
          cpc: { min: '', max: '' },
          roas: { min: '', max: '' },
          cpa: { min: '', max: '' },
          impressions: { min: '', max: '' },
        },
      },
    };
  },

  computed: {
    shopList() {
      return this.$store.state.shop.list;
    },

    // 广告活动、广告组下拉框无数据时候的提示
    noDataText() {
      if (this.form.mwsStoreId === '') {
        return '请先选择店铺';
      }
      return '当前状态下无数据';
    },

    // 筛选条件面包屑
    tags() {
      const tagsDict = {
        ...rangeFilterKeyToNameDict,
        launchKeyword: '投放词',
        searchKeyword: '搜索词',
        deliveryStatus: '投放状态',
        asinMskuKeyword: '批量查询',
      };
      const keys = Object.keys(tagsDict);
      const result = [];
      keys.forEach(key => {
        const name = tagsDict[key];
        if (['launchKeyword', 'searchKeyword', 'asinMskuKeyword'].includes(key)) {
          // 关键词的
          const val = this.form[key];
          val && result.push({
            name,
            key,
            value: val,
          });
        } else if (key === 'deliveryStatus') {
          // 投放状态的
          const val = this.form[key];
          val && result.push({
            name,
            key,
            value: deliveryStatusDict[val],
          });
        } else {
          // 筛选的
          const val = this.form.filter[key];
          (val.min || val.max) && result.push({
            name,
            key,
            value: `${val.min || '空'} - ${val.max || '空'}`,
          });
        }
      });
      return result;
    },
  },

  methods: {
    strToMoneyStr,
    strTo4Str,
    getFilterConditionVoArrShow,

    getTableData(identicalRecordId) {
      this.tableLoading = true;
      const params = {
        current: this.tablePageOption.currentPage, 
        size: this.tablePageOption.pageSize, 
        identicalRecordId,
      };
      querySearchTermList(params).then(res => {
        this.tableData = res.data.data.page.records.map(item => ({
          ...item,
          filterConditionVoShow: getFilterConditionVoShow(item.filterConditionVo),
        }));
        this.reportUpdateTime = res.data.data.reportUpdateTime;
        this.tablePageOption.total = res.data.data.page.total;
        this.tablePageOption.currentPage = res.data.data.page.current;
        this.tablePageOption.pageSize = res.data.data.page.size;
      }, err => {
        console.error('querySearchTermList err', err);
      }).finally(() => {
        this.tableLoading = false;
      });
    },

    handleCurrentPageChange(current) {
      this.tablePageOption.currentPage = current;
    },

    handlePageSizeChange(size) {
      this.tablePageOption.pageSize = size;
    },

    // 高级筛选收起/展开
    handleCollapseExpand() {
      this.isCollapseExpand = !this.isCollapseExpand;
    },

    getCampaignList(adStoreIds) {
      queryCampaigns(adStoreIds).then(res => {
        const list = res.data.data.records.map(item => ({
          ...item,
          label: item.name,
          value: item.campaignId,
        }));
        this.campaignList = [...list];
        this.allCampaigns = [...list];
      }, err => {
        console.error('queryCampaigns err', err);
      });
    },

    getGroupList(adStoreIds) {
      queryGroups(adStoreIds).then(res => {
        const list = res.data.data.records.map(item => ({
          ...item,
          label: item.name,
          value: item.groupId,
        }));
        this.groupList = [...list];
        this.allGroups = [...list];
      }, err => {
        console.error('queryGroups err', err);
      });
    },

    // 获取广告组下的搜索词或投放词
    getGroupKeywordList(type) {
      const typeDict = {
        // 搜索词
        '1': 'queryKeywordList',
        // 投放词
        '2': 'putKeywordList',
      };
      const params = {
        groupIds: this.form.groupIds,
        keywordType: type,
      };
      queryGroupKeywordList(params).then(res => {
        this[typeDict[type]] = res.data.data.records;
      }, err => {
        console.error('queryGroupKeywordList err', err);
      });
    },

    // 加载偏好
    getPreference() {
      queryPreference().then(res => {
        // 投放状态和周期拿出来不需要处理
        const deliveryStatus = res.data.data.deliveryStatus || '';
        const cycleType = res.data.data.cycleType || '30';
        delete res.data.data.deliveryStatus;
        delete res.data.data.cycleType;
        // 高级筛选的转为 this.data 中的格式
        const formatResData = changeFilterTypeToObj(res.data.data);
        this.form = {
          ...this.form,
          cycleType: String(cycleType),
          deliveryStatus,
          filter: {
            ...this.form.filter,
            ...formatResData,
          }
        };
      }, err => {
        console.error('queryPreference err', err);
      });
    },

    // 保存偏好
    handleSave() {
      const filterData = changeFilterType(this.form.filter);
      if (filterData.status === 'error') {
        this.$message.error(filterData.msg);
        return;
      }
      const data = {
        deliveryStatus: this.form.deliveryStatus,
        ...filterData,
        cycleType: this.form.cycleType,
      };
      savePreference(data).then(res => {
        this.$message.success(res.data.msg);
      }, err => {
        console.error('savePreference err', err);
      });
    },

    // 投放词输入框获取焦点
    handleFocusPutKeyword() {
      if (this.flagGetKeywordList.put === false) {
        return;
      }
      // 输入框为空时，且已选择广告组时，请求关键词列表。
      if (!this.form.launchKeyword && this.form.groupIds.length) {
        // 2 是投放词参数
        this.getGroupKeywordList('2');
        // 请求后设 flag 为 false
        this.flagGetKeywordList.put = false;
      }
    },

    // 搜索词输入框获取焦点
    handleFocusQueryKeyword() {
      if (this.flagGetKeywordList.query === false) {
        return;
      }
      // 输入框为空时，且已选择广告组时，请求关键词列表。
      if (!this.form.searchKeyword && this.form.groupIds.length) {
        // 1 是搜索词参数
        this.getGroupKeywordList('1');
        // 请求后设 flag 为 false
        this.flagGetKeywordList.query = false;
      }
    },

    // 搜索投放词
    searchPutKwAsync(queryString, callback) {
      const putKeywordList = this.putKeywordList;
      let results = putKeywordList;
      if (queryString) {
        results = putKeywordList.filter(k => k.includes(queryString));
      }
      const r = results.map(s => ({ value: s }));
      callback(r);
    },

    // 搜索搜索词
    searchQueryKwAsync(queryString, callback) {
      const queryKeywordList = this.queryKeywordList;
      let results = queryKeywordList;
      if (queryString) {
        results = queryKeywordList.filter(k => k.includes(queryString));
      }
      const r = results.map(s => ({ value: s }));
      callback(r);
    },

    // 批量搜索输入框输入
    handleTextAreaInput(value) {
      const maxLines = 20;
      let valueArr = value.split(/\r\n|\r|\n/);
      // 超过行数时截取
      if (valueArr.length > maxLines) {
        valueArr = valueArr.slice(0, maxLines);
        value = valueArr.join('\n');
        this.form.asinMskuKeyword = value;
      }
    },

    handleEmpty() {
      const keys = Object.keys(this.form.filter);
      keys.push('launchKeyword', 'searchKeyword', 'deliveryStatus', 'asinMskuKeyword');
      keys.forEach(key => {
        if (typeof this.form[key] === 'string') {
          this.form[key] = '';
        } else {
          // 筛选
          this.form.filter[key].min = '';
          this.form.filter[key].max = '';
        }
      });
    },

    handleTagClose(key) {
      if (['launchKeyword', 'searchKeyword', 'deliveryStatus', 'asinMskuKeyword'].includes(key)) {
        this.form[key] = '';
      } else {
        // 筛选
        this.form.filter[key].min = '';
        this.form.filter[key].max = '';
      }
    },

    // 获取以换行符分隔的批量输入的 asin 信息
    getInputBatchAsin(batchAsinString) {
      let status = 'success';
      const asinString = batchAsinString.trim();
      const errorAsins = [];
      const successAsins = [];
      const filterReg = /^B0[A-Z0-9]{8}$/;
      const list = asinString.split(/[\n+|\\,+]/);
      for (let i = 0; i < list.length; i++) {
        const asin = list[i].trim();
        if (asin !== '') {
          if (!filterReg.test(asin)) {
            errorAsins.push(asin);
            status = 'error';
          } else {
            successAsins.push(asin);
          }
        }
      }
      return {
        status,
        successAsins,
        errorAsins,
      };
    },

    // 提交查询（相同条件时，可选择是否提交，递归调用）
    submitQuerySearchTerm(params) {
      // 边界条件 强制查询
      if (params.ignoreIdentical) {
        querySearchTerm(params).then(res => {
          this.$message.success(res.data.msg);
          this.getTableData(params.identicalRecordId);
        }).finally(() => {
          this.submitLoading = false;
        });
        return;
      }
      querySearchTerm(params).then(res => {
        const { data: { searchSuccess, identicalRecordId } } = res.data;
        // 列表中已有相同条件的筛选结果时
        if (searchSuccess === false) {
          this.$confirm('相同一天内已经发起过查询，确定重复查询？', '提示', {
            type: 'warning',
            confirmButtonText: '是',
            callback: action => {
              if (action !== 'confirm') {
                return;
              }
              // 强制查询
              this.submitQuerySearchTerm({ ...params, ignoreIdentical: true, identicalRecordId });
            }
          });
        } else {
          this.$message.success(res.data.msg);
          this.getTableData();
        }
      }).finally(() => {
        this.submitLoading = false;
      });
    },

    handleSubmit() {
      if (this.form.mwsStoreId === '') {
        this.$message.warning('请选择店铺');
        return;
      }
      // 检查 ASIN 格式
      let asinList = [];
      const asinMskuKeyword = this.form.asinMskuKeyword.trim();
      if (asinMskuKeyword !== '') {
        const { status, successAsins, errorAsins } = this.getInputBatchAsin(asinMskuKeyword);
        // 有错误的 asin
        if (status === 'error') {
          this.$message.warning(`ASIN: ${errorAsins[0]} 格式输入有误，请重新输入`);
          return;
        }
        asinList = successAsins;
      }
      const filterData = changeFilterType(this.form.filter);
      if (filterData.status === 'error') {
        this.$message.error(filterData.msg);
        return;
      }
      this.submitLoading = true;
      const params = {
        ...this.form,
        ...filterData,
        mwsStoreIds: [this.form.mwsStoreId],
        asinMskuKeyword: Array.from(new Set(asinList)).join('\n'),
      };
      delete params.filter;
      delete params.mwsStoreId;
      this.submitQuerySearchTerm(params);
    },

    // 导出
    handleDownload(id) {
      downloadReport(id)
        .catch(err => {
          console.error('导出失败:', err);
          return err;
        })
        .then(res => {
          // 如果没有返回文件
          if (res.headers['content-type'].includes('application/json')) {
            this.$message.error('匹配不到结果，请修改筛选条件');
            return;
          }
          const blobUrl = window.URL.createObjectURL(res.data);
          const fileName = res.headers['content-disposition'].split(';')[1].split('filename=')[1];
          downloadATag(blobUrl, window.decodeURIComponent(fileName));
        })
        .catch(err => {
          console.error('导出发生错误:', err);
        });
    },

    // 点击关键词排名
    handleClickKwRanking(row) {
      // 查询筛选结果中是否有搜索词，如果没有则不允许跳转
      if (!row.filterConditionVo.asinMskuKeyword) {
        this.$message.error('筛选条件中没有ASIN');
        return;
      }
      const {
        id,
        marketplaceVoList,
        filterConditionVo: { asinMskuKeyword },
      } = row;
      querySearchKeyword({ recordId: id }).then(res => {
        const list = res.data.data;
        if (!list || list.length === 0) {
          this.$message.error('筛选结果中没有搜索词');
          return;
        }
        const params = {
          searchCountry: marketplaceVoList[0].marketplace,
          storeName: marketplaceVoList[0].storeName,
          asinList: asinMskuKeyword.split('\n'),
          searchKeywordList: list,
        };
        createAsinKeyworkRanking(params).then(() => {
          this.$message.success('添加ASIN关键词排名成功');
          this.$router.push('/keywordRanking/index');
        });
      });
    },
  },

  watch: {
    'form.mwsStoreId'(mwsStoreId) {
      // 增加判断是避免初始化请求店铺数据时 watch 到变化
      if (this.form.campaginIds.length) {
        this.form.campaginIds = [];
      }
      if (this.form.groupIds.length) {
        this.form.groupIds = [];
      }
      // 通过 mwsStoreId 找到 adStoreId， 目前不支持多店铺同时筛选
      const adStoreId = this.shopList.find(shop => shop.id === mwsStoreId).adStoreId;
      this.getCampaignList({ adStoreIds: [adStoreId] });
      this.getGroupList({ adStoreIds: [adStoreId] });
    },

    'form.campaginIds'(ids) {
      if (ids.length === 0) {
        this.groupList = this.allGroups;
        return;
      }
      this.groupList = this.allGroups.filter(item => ids.includes(item.campaignId));
    },

    'form.groupIds'(groupIds) {
      // 更新 flag 为 true，表示需要请求广告组关键词列表
      this.flagGetKeywordList.put = true;
      this.flagGetKeywordList.query = true;
      // 如果清空了广告组，显示全部广告活动，并且清空关键词列表
      if (groupIds.length === 0) {
        this.campaignList = this.allCampaigns;
        this.putKeywordList = [];
        this.queryKeywordList = [];
        return;
      }
      // 选中广告组后，如果没有选中广告活动，则把广告活动列表限制为当前广告组的广告活动
      // 如果有选中广告活动，则在上面的基础上，把已选中的广告活动也加进去
      const selectedGroups = groupIds.map(id => this.groupList.find(group => group.groupId === id));
      // 选中的广告组的广告活动id
      const selectedGroupsCampaignIds = [...new Set(selectedGroups.map(group => group.campaignId))];
      // 通过广告活动 id 找出过滤出广告活动列表
      const selectedGroupsCampaigns = selectedGroupsCampaignIds.map(id => {
        return this.allCampaigns.find(cam => cam.campaignId === id);
      });
      this.campaignList = selectedGroupsCampaigns;
    },
  },

};
</script>

<style lang="scss" scoped>
  @import "./index.scss";
</style>

<style lang="scss">
  // 广告活动、广告组 avue-select 的下拉框
  .el-select-dropdown.el-popper.is-multiple {
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

  // 筛选条件 tag 的 tooltip 限制高度
  .el-tooltip__popper.is-dark {
    max-height: 300px;
    overflow: auto;
  }
</style>
