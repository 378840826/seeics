<!-- 关键词 -->
<template>
<div class="container">
<!-- 筛选栏 -->
<div class="filter-bar">
  <Search
    placeholder="活动/组/关键词/ASIN/SKU"
    :value="filter.search"
    @search="handleSearch"
  />

  <el-select
    v-model="filter.state"
    clearable
    multiple
    collapse-tags
    placeholder="状态"
    :size="size"
    class="filter-select filter-state-select"
    @change="handleStateChange"
  >
    <el-option
      v-for="(val,key) in stateNameDict"
      :key="key"
      :label="val"
      :value="key"
    />
  </el-select>

  <el-select
    v-model="filter.matchType"
    clearable
    placeholder="匹配方式"
    :size="size"
    class="filter-select"
    @change="handleMatchTypeChange"
  >
    <el-option
      v-for="(val,key) in matchTypeNameDict"
      :key="key"
      :label="val"
      :value="key"
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
    <el-button
      :disabled="treeSelectedInfo.campaignState === 'archived'"
      type="primary"
      @click="createDialogVisible = true"
      :size="size"
    >添加关键词</el-button>

    <div class="batch_state">
      批量操作：
      <el-button-group>
        <el-button
          v-for="state in Object.keys(stateNameDict)"
          :key="state"
          @click="handleBatchState(state)"
          :disabled="!tableSelected.length"
          :size="size"
        >{{ stateNameDict[state] }}</el-button>
      </el-button-group>
    </div>
  </div>

  <div>
    <DatePicker :defaultValue="filter.dateRange" @change="handleDateRangeChange" />
    <CustomCols
      localStorageKey="app-adMamage-keyword-customCol"
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
    v-loading="tableLoading"
    tooltip-effect="dark"
    :height="tableHeight"
    empty-text="没有查询到数据，请修改查询条件"
    @selection-change="handleSelectionChange"
    @sort-change="handleSortChange"
    @row-click="handleRowClick"
    border
    show-summary
    :summary-method="({columns}) => summaryMethod(columns, tableTotalData)"
    :size="size"
  >
    <el-table-column type="selection" width="55" :selectable="selectableInit" />

    <el-table-column prop="state" label="状态" width="94" fixed>
      <template slot-scope="{row}">
        <el-select
          :value="row.state"
          :size="size"
          :disabled="row.state === 'archived'"
          :class="row.state"
          @change="(v) => handleStateModify(v, row)"
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
    </el-table-column>

    <el-table-column prop="keywordText" label="关键词" width="200" sortable="custom"  fixed>
    </el-table-column>

    <el-table-column 
      v-if="customCols.includes('匹配方式')" 
      prop="matchType" 
      label="匹配方式" 
      width="80" 
      fixed
    >
      <span slot-scope="{row}">{{ matchTypeNameDict[row.matchType]}}</span>
    </el-table-column>

     <el-table-column
      v-if="customCols.includes('广告活动') && !treeSelectedInfo.campaignId" 
      prop="campaignName" 
      label="广告活动" 
      width="200" 
      sortable="custom"
    >
      <div slot-scope="{row}">
        <i :class="`${stateIconDict[row.campaignState]} ${row.campaignState}`" />
        <template v-if="row.campaignState !== 'archived'">
          <span class="link_name" @click="handleClickName(row, 'campaign')">{{ row.campaignName }}</span>
          <i class="el-icon-edit table-edit-icon"></i>
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
      sortable="custom"
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
      v-if="customCols.includes('建议竞价')" 
      prop="suggestedBid" 
      label="建议竞价" 
      width="150"
    >
      <template slot-scope="{row}">
        <span v-if="suggestedBidLoading">正在加载...</span>
        <div v-else-if="row.suggestedBid" class="suggested_bid">
          <div>
            {{ getValueLocaleString({ value: row.suggestedBid.suggested, isFraction: true, prefix: currency }) }}
            <el-button
              v-if="row.state !== 'archived'"
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

    <el-table-column v-if="customCols.includes('竞价')" prop="bid" label="竞价" width="100">
      <div slot-scope="{row}">
        {{ getValueLocaleString({ value: row.bid, isFraction: true, prefix: currency }) }}
        <i v-if="row.state !== 'archived'" class="el-icon-edit table-edit-icon"></i>
      </div>
    </el-table-column>

    <el-table-column 
      v-if="customCols.includes('添加时间')" 
      prop="createdTime" 
      label="添加时间" 
      width="110" 
      sortable="custom"
    >
      <template slot="header">
        <span>
          添加时间
          <el-tooltip effect="dark" content="北京时间" placement="top">
            <i class="el-icon-info icon-time_info"></i>
          </el-tooltip>
        </span>
      </template>
      <span slot-scope="{row}" class="td_date_time">{{ row.createdTime }}</span>
    </el-table-column>

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

<!-- 编辑弹窗 -->
<EditDialog
  v-if="editDialogVisible"
  :visible.sync="editDialogVisible"
  :data="editData"
  :editKey="editKey"
  :currency="currency"
  @save="handleEditSave"
/>

<!-- 添加关键词 -->
<create-keword
  v-if="createDialogVisible"
  :dialogVisible.sync="createDialogVisible"
  :mwsStoreId="mwsStoreId"
  :marketplace="marketplace"
  :storeId="storeId"
  :currency="currency"
  @success="$emit('createSuccess')"
/>

</div>
</template>

<script>
import {
  queryKwList,
  queryKwSuggestedBid,
  modifyKeyword,
} from '@/api/ppc/adManage';
import { stateNameDict, stateIconDict, matchTypeNameDict } from '../../utils/dict';
import {
  tablePageOption, 
  defaultDateRange, 
  summaryMethod, 
  keywordCustomColsOptions as customColsOptions,
} from '../../utils/options';
import { log } from '@/util/util';
import Search from '../../components/Search';
import DatePicker from '../../components/DatePicker';
import CustomCols from '../../components/CustomCols';
import FilterMore from '../../components/FilterMore';
import EditDialog from './EditDialog';
import FilterCrumbs, { notRangeKeys } from '../../components/FilterCrumbs';
import {
  getValueLocaleString,
  formatTableSortParams,
  getCommonColOption,
  parseTreeKey,
  getFormatTotal,
} from '../../utils/fun';
import CreateKeword from '../../create/CreateKeyword.vue';

export default {
  name: 'Keyword',

  components: {
    Search,
    DatePicker,
    CustomCols,
    FilterMore,
    FilterCrumbs,
    EditDialog,
    CreateKeword,
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
  },

  data: function() {
    return {
      size: 'mini',
      customColsOptions,
      stateIconDict,
      stateNameDict,
      matchTypeNameDict,
      summaryMethod,
      filter: {
        search: '',
        state: [],
        matchType: '',
        dateRange: defaultDateRange,
        more: {},
      },
      // 高级筛选 Visible
      filterMoreVisible: false,
      // 自定义列显示
      customCols: [],
      tableHeight: 'calc(100vh - 326px)',
      tableData: [],
      tableTotalData: {},
      tableSelected: [],
      tableLoading: false,
      tablePageOption: { ...tablePageOption },
      tableSort: { prop: 'createdTime', order: 'descending' },
      editDialogVisible: false,
      editData: {},
      // 点击哪个编辑图标激活的弹窗
      editKey: '',
      suggestedBidLoading: false,
      createDialogVisible: false,
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
      this.filter.search && (obj.search = this.filter.search);
      this.filter.state.length && (obj.state = this.filter.state.map(s => stateNameDict[s]).toString());
      this.filter.matchType && (obj.matchType = matchTypeNameDict[this.filter.matchType]);
      return obj;
    },
  },

  created() {
    this.getList();
  },

  updated () {
    // 解决表格合计行样式问题
    this.$refs.refTable.doLayout();
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
        adType: 'sp',
        portfolioId: this.treeSelectedInfo.portfolioId,
        campaignId: this.treeSelectedInfo.campaignId,
        groupId: this.treeSelectedInfo.groupId,
        state: this.filter.state,
        matchType: this.filter.matchType,
        search: this.filter.search,
        startTime: this.filter.dateRange[0],
        entTime: this.filter.dateRange[1],
        ...this.filter.more,
        ...body,
      };
      queryKwList(queryParams, bodyParams).then(res => {
        this.tableData = res.data.data.page.records;
        this.tablePageOption.total = res.data.data.page.total;
        this.tablePageOption.currentPage = res.data.data.page.current;
        this.tablePageOption.pageSize = res.data.data.page.size;
        // 合计数据格式化
        this.tableTotalData = getFormatTotal(res.data.data.total, this.currency);
        // 获取建议竞价
        this.suggestedBidLoading = true;
        const params = {
          storeId: this.storeId,
          keywords: res.data.data.page.records.map(kw => ({
            canId: kw.campaignId,
            groupId: kw.groupId,
            id: kw.keywordId,
            keywordText: kw.keywordText,
            matchType: kw.matchType,
          })),

        };
        queryKwSuggestedBid(params).then(suggestedBidRes => {
          const suggestedBidRecords = suggestedBidRes.data.data.records;
          // 更新列表
          const tableData = this.tableData.map(kw => {
            return {
              ...kw,
              suggestedBid: suggestedBidRecords.find(item => item.id === kw.keywordId && item.suggested),
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

    // 点击搜索
    handleSearch(val) {
      this.filter.search = val;
      this.filter.state = [];
      this.filter.matchType = '';
      // 清空并收起高级筛选
      this.filter.more = {};
      this.filterMoreVisible = false;
      this.$refs.refFilterMore.handleEmpty();
      this.getList({ current: 1 });
    },

    // 状态筛选
    handleStateChange(val) {
      this.filter.state = val;
      this.getList({ current: 1 });
    },

    // 匹配方式筛选
    handleMatchTypeChange(val) {
      this.filter.matchType = val;
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
      if (notRangeKeys.includes(key)) {
        this.filter[key] = '';
        key === 'state' && (this.filter.state = []);
      } else {
        this.filter.more[`${key}Min`] = '';
        this.filter.more[`${key}Max`] = '';
      }
      this.getList({ current: 1 });
    },

    // 面包屑清空
    handleEmptyCrumbs() {
      this.filter = {
        search: '',
        state: [],
        matchType: '',
        dateRange: [...this.filter.dateRange],
        more: {},
      };
      this.getList({ current: 1 });
    },

    // 表格排序变化
    handleSortChange(val) {
      this.tableSort = { prop: val.prop, order: val.order };
      // 排序后回到第一页
      this.tablePageOption.currentPage = 1;
      this.getList();
    },

    // 表格行是否可勾选
    selectableInit(row) {
      let flag = true;
      if (row.state === 'archived') {
        flag = false;
      }
      return flag;
    },

    // 表格勾选变化
    handleSelectionChange(val) {
      this.tableSelected = val;
    },

    // 批量修改页面表格数据
    updateTableData(ids, newData) {
      ids.forEach(id => {
        const index = this.tableData.findIndex(data => data.keywordId === id);
        this.tableData.splice(index, 1, {
          ...this.tableData[index],
          ...newData,
        });
      });
    },

    // 修改状态(可批量)
    updateState(state, list) {
      const ids = list.map(item => item.keywordId);
      const params = {
        adStoreId: this.storeId,
        keywordSettings: ids.map(id => {
          return {
            keywordId: id,
            state,
          };
        })
      };
      modifyKeyword(params).then(res => {
        const { success, fail } = res.data.data;
        // 有失败的，或全部失败
        if (fail.length) {
          let msg = '';
          if (fail.length === ids.length) {
            // 全部失败
            msg = '操作失败';
          } else {
            // 部分失败部分成功
            msg = '部分修改失败';
          }
          const createElement = this.$createElement;
          const contentElement = fail.map(item => {
            return createElement('div', null, [
              `${item.name}：`,
              createElement('span', { class: '_adManage-error-msgbox-msg' }, item.errorMsg),
            ]);
          });
          this.$msgbox({
            title: msg,
            customClass: '_adManage-error-msgbox-container',
            confirmButtonText: '确定',
            showCancelButton: false,
            showClose: false,
            closeOnClickModal: false,
            message: createElement('div', { class: '_adManage-error-msgbox' }, contentElement),
          });
        } else {
          this.$message({
            type: 'success',
            message: '操作成功',
          });
        }
        const successIds = success.map(item => item.id);
        this.updateTableData(successIds, { state });
      });
    },

    // 单个修改状态
    handleStateModify(state, row) {
      if (state === 'archived') {
        this.$confirm('归档后不可重新开启，确认归档吗？', '警告', {
          type: 'warning',
          callback: (action) => {
            if (action === 'confirm') {
              this.updateState(state, [row]);
            }            
          }
        });
      } else {
        this.updateState(state, [row]);
      }
    },

    // 批量修改状态
    handleBatchState(state) {
      if (state === 'archived') {
        this.$confirm('归档后不可重新开启，确定要归档吗？', '警告', {
          type: 'warning',
          callback: (action) => {
            if (action === 'confirm') {
              this.updateState(state, this.tableSelected);
            }            
          }
        });
      } else {
        this.updateState(state, this.tableSelected);
      }
    },

    // 点击编辑图标
    handleRowClick(row, column, event) {
      if (event.target._prevClass === 'el-icon-edit table-edit-icon') {
        this.editKey = column.property;
        this.editDialogVisible = true;
        this.editData = { ...row };
      }
    },

    // 编辑保存
    handleEditSave(val) {
      const params = {
        adStoreId: this.storeId,
        keywordSettings: [{ ...val }],
      };
      modifyKeyword(params).then(res => {
        const { success, fail } = res.data.data;
        if (fail.length) {
          this.$message.error(fail[0].errorMsg);
        } else {
          this.$message({
            type: 'success',
            message: '操作成功',
          });
        }
        const successIds = success.map(item => item.id);
        this.updateTableData(successIds, val);
      });
    },

    // 点击应用建议竞价
    handleApplySuggestedBid(row) {
      const bid = row.suggestedBid.suggested;
      const params = {
        adStoreId: this.storeId,
        keywordSettings: [{
          keywordId: row.keywordId,
          bid,
        }],
      };
      modifyKeyword(params).then(res => {
        const { fail } = res.data.data;
        if (fail.length) {
          this.$message.error(fail[0].errorMsg);
        } else {
          this.$message({
            type: 'success',
            message: '操作成功',
          });
        }
        this.updateTableData([row.keywordId], { bid });
      });
    },

    // 点击广告活动/广告组名称
    handleClickName(row, type) {
      const { campaignId, campaignName, campaignState, groupId, groupName, campaignTargetType, groupType } = row;
      let data = {
        key: `${campaignState}-${campaignId}-${campaignTargetType}`,
        campaignId,
        campaignName,
        targetingType: campaignTargetType,
        campaignState,
        isLeaf: false,
      };
      if (type === 'group') {
        data.key = `${campaignState}-${campaignId}-${campaignTargetType}-${groupId}-${groupType}`;
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

    // 点击分析
    handleCharts(row) {
      log('分析', row);
    },
  },

  watch: {
    treeSelectedKey() {
      this.getList();
    },

    // 面包屑出现时，改变表格高度
    filterCrumbsConditions() {
      let h = 326;
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
</style>

<style scoped lang="scss">
.btn-apply_suggested_bid {
  padding: 4px 8px;
}
</style>

<style lang="scss">
  @import "../commonGlobal.scss";
</style>
