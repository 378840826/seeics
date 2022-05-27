<!-- 智能广告 -->
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
          :key="item.name"
          :label="item.name"
          :value="item.name"
        />
      </el-select>

      <!-- 广告活动类型 -->
      <el-select
        v-model="form.campaignTypeList"
        placeholder="广告类型"
        :size="componentsSize"
        @change="getTableData()"
        clearable
        multiple
        class="select-multiple"
      >
        <el-option
          v-for="item in filterOptions.campaignTypeList"
          :key="item"
          :label="campaignTypeDict[item]"
          :value="item"
        />
      </el-select>

      <!-- 投放方式 -->
      <el-select
        v-model="form.targetingTypeList"
        placeholder="投放方式"
        :size="componentsSize"
        @change="getTableData()"
        clearable
        multiple
        collapse-tags
        class="select-multiple"
      >
        <el-option
          v-for="item in filterOptions.targetingTypeList"
          :key="item"
          :label="targetingTypeDict[item]"
          :value="item"
        />
      </el-select>

      <!-- 状态 -->
      <el-select
        v-model="form.state"
        placeholder="状态"
        :size="componentsSize"
        @change="getTableData()"
        clearable
      >
        <el-option
          v-for="item in filterOptions.stateExtendList"
          :key="item"
          :label="stateExtendDict[item]"
          :value="item"
        />
      </el-select>

      <!-- 搜索广告活动名称 -->
        <el-input
          placeholder="筛选广告活动"
          v-model="form.name"
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

        <!-- 重置 -->
        <el-button
          :size="componentsSize"
          icon="el-icon-refresh-left"
          @click="handleReset"
        >重置</el-button>
    </div>

    <!-- 批量设置栏 -->
    <div class="batch-container">
      <el-button
        @click="handleClickLog"
        :size="componentsSize"
        :disabled="!tableSelected.length"
      >批量设置模板</el-button>
      <el-button
        @click="handleClickLog"
        :size="componentsSize"
        :disabled="!tableSelected.length"
      >批量设置模板状态</el-button>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table
        ref="elTable"
        :data="tableData"
        v-loading="tableLoading"
        tooltip-effect="dark"
        height="calc(100vh - 306px)"
        empty-text="没有查询到数据，请修改查询条件"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        border
      >
        <el-table-column type="selection"  width="55" />

        <el-table-column prop="name" label="广告活动" sortable />

        <el-table-column prop="state" label="状态" width="120">
          <template slot-scope="scope">{{ stateExtendDict[scope.row.state] }}</template>
        </el-table-column>

        <el-table-column prop="campaignType" label="广告类型" width="120">
          <template slot-scope="scope">{{ campaignTypeDict[scope.row.campaignType] }}</template>
        </el-table-column>

        <el-table-column prop="targetingType" label="投放方式" width="120">
          <template slot-scope="scope">{{ targetingTypeDict[scope.row.targetingType] }}</template>
        </el-table-column>
        
        <el-table-column prop="keyword" label="搜索词">
          <template slot-scope="scope">
            <span style="color: #C0C4CC">功能即将开放</span>
            <div @click="handleTemplate(scope.row.campaignId)">模板1</div>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button
              @click="handleClickLog(scope.row)"
              style="color: #C0C4CC"
              type="text"
              :size="componentsSize"
            >广告日志</el-button>
          </template>
        </el-table-column>
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

    <!-- 批量设置模板弹窗 -->
    <el-dialog title="批量设置模板" :visible="dialogTemplateVisible" append-to-body>
      <el-form :model="templateForm" ref="templateForm" label-width="120px">
        <el-form-item label="广告自动化类型">
          <el-select v-model="templateForm.type" :size="componentsSize">
            <el-option value="搜索词自动化标签" label="搜索词自动化标签" />
          </el-select>
        </el-form-item>
        <div
          v-for="(item, index) in templateForm.itemList"
          :key="index"
          class="template-item"
        >
          <el-form-item label="自动化模板">
            <el-select v-model="item.template" :size="componentsSize">
              <!-- <el-option value="搜索词自动化标签" label="搜索词自动化标签" /> -->
            </el-select>
          </el-form-item>
          <el-form-item label="标签名称" :prop="'itemList.' + index + '.label'" :rules="[
            { required: true, message: '请输入标签名称', trigger: 'change' },
            { min: 1, max: 50, message: '店铺名称长度在 1 到 50 个字符', trigger: 'change' },
          ]">
            <el-input v-model="item.label" placeholder="请输入标签名称" />
          </el-form-item>
        </div>
        <i class="el-icon-circle-plus" @click="handleAddTemplateFormItem" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTemplateVisible = false" :size="componentsSize">取 消</el-button>
        <el-button type="primary" @click="handleBatchTemplate" :size="componentsSize">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible="dialogCreateVisible"
      :append-to-body="true"
      width="50%"
      class="tst"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
      destroy-on-close
    > 
      <global-filter
        v-if="ruleIs"
      />
      <auto-mation
        v-if="automationIs"
        :id="adGroupList"
      />
      
      <span slot="footer" class="dialog-footer">
        <el-button 
          size="mini" 
          @click="dialogCreateVisible = false;
            ruleIs = false;
            automationIs = false"
          >取 消</el-button>
        <el-button 
          size="mini" 
          type="primary" 
          @click="save"
          :disabled="saveDisabled"
        >保 存</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  queryShopNameList,
  queryMarketplaceList,
  queryCampaignList,
  getAutomationList
} from '@/api/ppc/autoAd';
import {
  stateExtendDict,
  campaignTypeDict,
  targetingTypeDict,
  formatTableSortParams,
} from '../util';
import autoMation from './componets/automation.vue';
import globalFilter from '@/components/globalFilter/globalFilter.vue';
export default {
  name: 'ShopList',

  components: {
    autoMation,
    globalFilter
  },

  data() {
    return {
      stateExtendDict,
      campaignTypeDict,
      targetingTypeDict,
      componentsSize: 'small',
      form: {
        name: '',
        shopName: '',
        marketplace: '',
        campaignTypeList: [],
        targetingTypeList: [],
        state: '',
      },
      filterOptions: {
        shopNameList: [],
        marketplaceList: [],
        campaignTypeList: Object.keys(campaignTypeDict),
        targetingTypeList: Object.keys(targetingTypeDict),
        stateExtendList: Object.keys(stateExtendDict),
      },
      tableData: [],
      tableLoading: false,
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
      tableSelected: [],
      dialogTemplateVisible: false,
      dialogStateVisible: false,
      // 批量设置模板参数
      templateForm: {
        type: '搜索词自动化标签',
        itemList: [
          { template: '', label: '' },
        ],
      },
      // 创建模板参数
      dialogCreateVisible: false,
      adGroupList: '',
      automationIs: false,
      ruleIs: false
    };
  },

  computed: {
  },

  created() {
    // 店铺名称
    queryShopNameList().then(res => {
      this.tableLoading = true;
      const list = res.data.data.sort((a, b) => a.localeCompare(b));
      this.filterOptions.shopNameList = list;
      this.form.shopName = list[0];
      // 用第一个店铺名称来请求站点列表和表格数据
      this.getMarketplaceListAndTableData(list[0]);
    });
    getAutomationList().then(res => {
      console.log(res)
    })
  },

  methods: {
    // 获取表格数据
    getTableData(params) {
      this.tableLoading = true;
      // 处理排序数据
      const sortParams = formatTableSortParams(this.tableSort);
      const queryParams = {
        name: this.form.name.trim(),
        shopName: this.form.shopName,
        marketplace: this.form.marketplace,
        campaignTypeList: this.form.campaignTypeList,
        targetingTypeList: this.form.targetingTypeList,
        stateList: this.form.state ? this.form.state.split(',') : [],
        ...this.tablePageOption,
        ...sortParams,
        ...params,
      };
      queryCampaignList(queryParams).then(res => {
        const resData = res.data.data;
        this.tableData = resData.records;
        this.tablePageOption.total = resData.total;
        this.tablePageOption.size = resData.size;
        this.tablePageOption.current = resData.current;
        this.tablePageOption.pages = resData.pages;
      }).finally(() => {
        this.tableLoading = false;
      });
    },

    // 获取站点列表并用第一个站点请求表格
    getMarketplaceListAndTableData(shopName) {
      queryMarketplaceList({ shopName }).then(mRes => {
        // const mList = mRes.data.data.sort((a, b) => a.localeCompare(b));
        this.filterOptions.marketplaceList = mRes.data.data;
        this.form.marketplace = mRes.data.data[0].name;
        // 获取列表
        this.getTableData();
      });
    },

    // 切换店铺名称
    handleChangeShopName(shopName) {
      // 用新的 shopName 请求站点列表和表格数据
      this.getMarketplaceListAndTableData(shopName);
    },

    // 点击重置
    handleReset() {
      this.form = {
        name: '',
        shopName: this.filterOptions.shopNameList[0],
        marketplace: this.filterOptions.marketplaceList[0],
        campaignTypeList: [],
        targetingTypeList: [],
        state: '',
      };
      this.getTableData();
    },

    // 表格行选中
    handleSelectionChange(val) {
      this.tableSelected = val;
    },

    // 排序（广告活动名称排序）
    handleSortChange({ prop, order }) {
      // 如果只有一页，则直接排序无需请求,，有多页的情况才需要请求数据
      if (this.tablePageOption.pages > 1) {
        this.tableSort.order = order;
        this.tableSort.prop = prop;
        this.getTableData();
      }
    },

    // 批量设置模板弹窗点击添加模板行
    handleAddTemplateFormItem() {
      // 填写不正确时阻止添加
      this.$refs['templateForm'].validate(valid => {
        if (!valid) {
          return false;
        }
        this.templateForm.itemList.push({ template: '', label: '' });
      });
    },

    // 批量设置模板
    handleBatchTemplate() {
      console.log('handleClickBatchTemplate', this.tableSelected);
      this.$refs['templateForm'].validate((valid) => {
        if (!valid) {
          return false;
        }
        // 
      });
    },

    // 批量设置模板状态
    handleBatchState() {
      console.log('handleClickBatchTemplateState', this.tableSelected);
    },

    handleClickLog(row) {
      console.log('点击日志', row);
      this.$message.info('功能即将开放');
    },
    handleTemplate(id) {
      this.dialogCreateVisible = true; 
      this.adGroupList = id;
      this.ruleIs = true;
      this.automationIs = true;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import "./index.scss";
</style>
