<!-- 广告 SearchTerm -->
<template>
  <basic-container>
    <!-- 日期 -->
    <div class="date-bar">
      <div class="update_time">
        更新时间: 2017-10-08 01:23:45 PM PDT (太平洋)
      </div>
      <DateRangePicker />
    </div>

    <!-- 查询和筛选 -->
    <div class="form">
      <div class="search">
        <!-- 店铺站点:  -->
        <el-select
          v-model="form.shop"
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
          v-model="form.campaigns"
          :dic="campaignList"
          :size="size"
          all
          multiple
          filterable
          clearable
          tags
          placeholder="请选择广告活动"
          :no-data-text="noDataText"
          class="avue-select"
        />
        <!-- 广告组:  -->
        <avue-select
          v-model="form.groups"
          :dic="groupList"
          :size="size"
          all
          multiple
          filterable
          clearable
          tags
          placeholder="请选择广告组"
          :no-data-text="noDataText"
          class="avue-select"
        />
        
        <el-autocomplete
          v-model="form.queryKeyword"
          :fetch-suggestions="searchQueryKwAsync"
          :size="size"
          placeholder="搜索搜索词"
          clearable
          debounce="100"
          trigger-on-focus="false"
          @focus="handleFocusQueryKeyword"
        />

        <el-autocomplete
          v-model="form.putKeyword"
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
          clearable :size="size"
        >
          <el-option label="已投放" value="alreadyLive" />
          <el-option label="未投放" value="noAlready" />
        </el-select>

        <el-popover
          placement="bottom"
          width="200"
          trigger="click"
        >
        <el-button slot="reference" :size="size">批量查询</el-button>
          <div>
            <el-input
              class="asin-textarea"
              v-model="form.asin"
              placeholder="支持ASIN、MSKU混合批量查询，最多20个商品，换行间隔；搜索ASIN，找到ASIN相关的关键词"
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
            v-model="form.filter.conversionsRate"
          />
          <RangeInput
            v-show="isCollapseExpand"
            label="销售额：" 
            :valueFilter="strToMoneyStr"
            v-model="form.filter.sales"
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
            :valueFilter="strToMoneyStr"
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
            {{tag.name}}：<span class="tag-value">{{tag.value}}</span>
          </el-tag>
        </div>
        <div class="form-footer-btns">
          <el-button @click="handleSave" size="mini">保存偏好</el-button>
          <el-button type="primary" @click="handleSubmit" size="mini">确 定</el-button>
          <el-button type="text" @click="handleEmpty" size="mini">清空</el-button>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <avue-crud
      :data="tableData"
      :option="tableOption"
      @on-load="getTableData"
      @row-del="handleDelte"
      :page.sync="tablePageOption"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >

      <template slot-scope="{row}" slot="store">
        <span v-for="(item, index) in row.store" :key="item">
          <template v-if="index === 0">
            {{ item }}
          </template>
          <template v-else>
            、 {{ item }}
          </template>
        </span>
      </template>

      <template slot-scope="{row}" slot="menu">
        <div class="table-menu">
          <div class="table-menu-btns">
            <el-button
              v-if="!row.success"
              :size="size"
              type="info"
              disabled
              class="btn-result"
            >生成失败</el-button>
           <template v-else>
              <el-button class="btn-result" :size="size" type="primary">导出筛选结果</el-button>
              <el-button class="btn-result" :size="size" type="primary">关键词排名</el-button>
            </template>
          </div>
            <el-button type="text">重新筛选</el-button>
        </div>
      </template>
      
    </avue-crud>
  </basic-container>
</template>
<script>
import {
  queryCampaigns,
  queryGroups,
  queryPutKeywordList,
  queryQueryKeywordList,
  savePreference,
  queryPreference,
  querySearchTermList,
} from '@/api/ppc/searchTerm';
import RangeInput from './components/RangeInput';
import DateRangePicker from './components/DateRangePicker';
import { strToMoneyStr } from '@/util/numberString';

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
  column: [
    {
      label: '更新时间',
      prop: 'updateTime',
    }, {
      label: '店铺站点',
      prop: 'store',
    }, {
      label: '筛选条件',
      prop: 'filterCondition',
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
    this.getPreference();
    if (!this.shopList.length) {
      this.$store.dispatch('getShopList');
    }
  },

  data() {
    return {
      tableData: [],
      tableOption,
      tablePageOption: { 
        total: 100,
        currentPage: 1, 
        pageSize: 20,
        pageSizes: [20, 50, 100],
      },
      // 组件 size
      size: 'small',
      // 筛选折叠面板
      isCollapseExpand: true,
      // 请求供选择的关键词的 flag，用于避免不必要的请求
      flagGetKeywordList: {
        put: false,
        query: false,
      },
      // 供选择的投放词、搜索词
      putKeywordList: [],
      queryKeywordList: [],
      // 显示的广告活动、广告组
      campaignList: [],
      groupList: [],
      // 全店的广告活动、广告组
      allCampaigns: [],
      allGroups: [],
      // 需要提交的数据
      form: {
        shop: '',
        campaigns: [],
        groups: [],
        // 投放词
        putKeyword: '',
        // 搜索词
        queryKeyword: '',
        // 投放状态
        deliveryStatus: '',
        // 批量 asin 和 sku
        asin: '',
        // 筛选
        filter: {
          sales: { min: '', max: '' },
          spend: { min: '', max: '' },
          clicks: { min: '', max: '' },
          aba: { min: '', max: '' },
          conversionsRate: { min: '', max: '' },
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
      if (this.form.shop === '') {
        return '请先选择店铺';
      }
      return '当前状态下无数据';
    },

    tags() {
      const keyToNameDict = {
        putKeyword: '投放词',
        queryKeyword: '搜索词',
        deliveryStatus: '投放状态',
        asin: '批量查询',
        // 筛选的
        aba: 'ABA排名',
        sales: '销售额',
        spend: 'Spend',
        clicks: 'Clicks',
        conversionsRate: '转化率',
        orderNum: '订单量',
        acos: 'ACoS',
        ctr: 'CTR',
        cpc: 'CPC',
        roas: 'RoAS',
        cpa: 'CPA',
        impressions: 'Impressions',
      };
      const keys = Object.keys(keyToNameDict);
      const result = [];
      keys.forEach(key => {
        const name = keyToNameDict[key];
        if (['putKeyword', 'queryKeyword', 'asin'].includes(key)) {
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
          const dict = { alreadyLive: '已投放', noAlready: '未投放' };
          val && result.push({
            name,
            key,
            value: dict[val],
          });
        } else {
          // 筛选的
          const val = this.form.filter[key];
          if (val === undefined) {
            console.log('val', key, this.form.filter);
          }
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

    getTableData() {
      const params = {
        current: this.tablePageOption.currentPage, 
        size: this.tablePageOption.pageSize, 
      };
      querySearchTermList(params).then(res => {
        this.tableData = res.data.records;
        this.tablePageOption.total = res.data.total;
        this.tablePageOption.currentPage = res.data.current;
        this.tablePageOption.pageSize = res.data.size;
      }, err => {
        console.log('queryCampaigns err', err);
      });
    },

    handleCurrentChange(current) {
      this.tablePageOption.currentPage = current;
      console.log('current', current);
    },

    handleSizeChange(size) {
      this.tablePageOption.pageSize = size;
      console.log('size', size);
    },

    handleCollapseExpand() {
      this.isCollapseExpand = !this.isCollapseExpand;
    },

    getCampaignList(storeId) {
      queryCampaigns(storeId).then(res => {
        const list = res.data.map(item => ({
          ...item,
          label: item.name,
          value: item.id,
        }));
        this.campaignList = [...list];
        this.allCampaigns = [...list];
      }, err => {
        console.log('queryCampaigns err', err);
      });
    },

    getGroupList(storeId) {
      queryGroups(storeId).then(res => { 
        const list = res.data.map(item => ({
          ...item,
          label: item.name,
          value: item.id,
        }));
        this.groupList = [...list];
        this.allGroups = [...list];
      }, err => {
        console.log('queryGroups err', err);
      });
    },

    getPutKeywordList() {
      queryPutKeywordList(this.form.groups).then(res => {
        this.putKeywordList = res.data;
      }, err => {
        console.log('err', err);
      });
    },

    getQueryKeywordList() {
      queryQueryKeywordList(this.form.groups).then(res => {
        this.queryKeywordList = res.data;
      }, err => {
        console.log('err', err);
      });
    },

    getPreference() {
      queryPreference().then(res => {
        this.form = {
          ...this.form,
          ...res.data,
        };
      }, err => {
        console.log('err', err);
      });
    },

    // 投放词输入框获取焦点
    handleFocusPutKeyword() {
      if (this.flagGetKeywordList.put === false) {
        return;
      }
      // 输入框为空时，且已选择广告组时，请求关键词列表。
      if (!this.form.putKeyword && this.form.groups.length) {
        this.getPutKeywordList();
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
      if (!this.form.queryKeyword && this.form.groups.length) {
        this.getQueryKeywordList();
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
      const maxLines = 2;
      let valueArr = value.split(/\r\n|\r|\n/);
      // 超过行数时截取
      if (valueArr.length > maxLines) {
        valueArr = valueArr.slice(0, maxLines);
        value = valueArr.join('\n');
        this.form.asin = value;
      }
    },

    handleEmpty() {
      const keys = Object.keys(this.form.filter);
      keys.push('putKeyword', 'queryKeyword', 'deliveryStatus', 'asin');
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

    // 保存偏好
    handleSave() {
      const data = {
        deliveryStatus: this.form.deliveryStatus,
        filter: this.form.filter,
      };
      console.log('保存偏好', data);
      savePreference(data).then(res => {
        this.$message.success(res.data.msg);
      }, err => {
        console.log('err', err);
      });
    },

    handleTagClose(key) {
      if (['putKeyword', 'queryKeyword', 'deliveryStatus', 'asin'].includes(key)) {
        this.form[key] = '';
      } else {
        // 筛选
        this.form.filter[key].min = '';
        this.form.filter[key].max = '';
      }
    },

    handleSubmit() {
      console.log('handleSubmit', JSON.parse(JSON.stringify(this.form)));
    },
  },

  watch: {
    'form.shop'(storeId) {
      // 增加判断是避免初始化请求店铺数据时 watch 到变化
      if (this.form.campaigns.length) {
        this.form.campaigns = [];
      }
      if (this.form.groups.length) {
        this.form.groups = [];
      }
      this.getCampaignList(storeId);
      this.getGroupList(storeId);
    },

    'form.campaigns'(ids) {
      if (ids.length === 0) {
        this.groupList = this.allGroups;
        return;
      }
      this.groupList = this.allGroups.filter(item => ids.includes(item.campaignId));
    },

    'form.groups'(groupIds) {
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
      const selectedGroups = groupIds.map(id => this.groupList.find(group => group.id === id));
      // 选中的广告组的广告活动id
      const selectedGroupsCampaignIds = [...new Set(selectedGroups.map(group => group.campaignId))];
      // 通过广告活动 id 找出过滤出广告活动列表
      const selectedGroupsCampaigns = selectedGroupsCampaignIds.map(id => {
        return this.allCampaigns.find(cam => cam.id === id);
      });
      this.campaignList = selectedGroupsCampaigns;
    },
  },

};
</script>

<style lang="scss" scoped>
  @import "./index.scss";
</style>