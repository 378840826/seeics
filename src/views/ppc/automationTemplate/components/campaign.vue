<template>
  <el-dialog
    :visible.sync="visible"
    :append-to-body="true"
    :close-on-press-escape="false"
    destroy-on-close
    @close="close"
    width="80%">
    <span slot="title">广告活动</span>

    <div>
      <span>模板名称：{{rowInfo.templateName}}</span>
      <span style="marginLeft: 50px">模板类型：{{rowInfo.templateType}}</span>
    </div>

    <div class="filter">
      <span>
        <el-select
          v-model="form.storeName"
          @change="handelShopChange"
          placeholder="请选择店铺"
          clearable
          style="padding: 10px 20px 0 0; minWidth: 160px">
          <el-option
            v-for="item in storeList"
            :key="item.storeName"
            :value="item.storeName"
            :label="item.storeName"
          />
        </el-select>
      </span>

      <span>
        <el-select
          v-model="form.country"
          @change="handleMarketplace" 
          placeholder="请选择站点"
          clearable
          style="padding: 10px 20px 0 0; minWidth: 160px">
          <el-option
            v-for="item in marketplaceList"
            :key="item"
            :value="item"
            :label="item"
          />
        </el-select>
      </span>

      <span>
        <el-select
          v-model="form.campaignType"
          @change="queryCampaignPage"
          placeholder="广告类型"
          clearable
          style="padding: 10px 20px 0 0; minWidth: 160px">
          <el-option
            v-for="item in type"
            :key="item.vlaue"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </span>

      <span>
        <el-select
          v-model="form.targetingType"
          @change="queryCampaignPage"
          placeholder="投放类型"
          clearable
          style="padding: 10px 20px 0 0; minWidth: 160px">
          <el-option
            v-for="item in launchTypeList"
            :key="item.vlaue"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </span>

      <span>
        <el-select
          v-model="form.campaignState"
          @change="queryCampaignPage"
          placeholder="广告状态"
          clearable
          style="padding: 10px 20px 0 0; minWidth: 160px">
          <el-option
            v-for="item in adStatusList"
            :key="item.vlaue"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </span>

      <span>
        <el-select
          v-model="form.automationlStatus"
          @change="queryCampaignPage"
          placeholder="规则状态"
          clearable
          style="padding: 10px 20px 0 0; minWidth: 160px">
          <el-option
            v-for="item in ruleStatusList"
            :key="item.vlaue"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </span>

      <span style="padding: 10px 20px 0 0">
        <el-input
          placeholder="筛选广告活动"
          v-model="form.campaignName"
          clearable
          @clear="queryCampaignPage"
          style="width: 250px"/>
      </span>

      <span style="padding: 10px 20px 0 0">
        <el-button
          @click="queryCampaignPage"
          type="primary"
          size="mini"
          style="height: 30px; width: 50px">搜索</el-button>
      </span>

      <span style="padding: 10px 20px 0 0">
        <el-button
          @click="empty(); queryCampaignPage()"
          size="mini"
          style="height: 30px; width: 50px">重置</el-button>
      </span>
      
    </div>

    <el-table
      :data="dataSource"
      style="width: 100%; marginTop: 10px"
      border
      height="350px"
      v-loading="loading"
      empty-text="暂无广告活动"
    >
      <el-table-column
        prop="campaignName"
        label="广告活动"
        align="center"
        sortable>

        <div slot-scope="{row}" class="campaign">{{row.campaignName}}</div>

      </el-table-column>

      <el-table-column
        prop="campaignStatus"
        label="状态"
        align="center"
        >

        <div slot-scope="{row}">{{statusFormmat(row.campaignStatus)}}</div>
      </el-table-column>

      <el-table-column
        prop="campaignType"
        label="广告类型"
        align="center">

        <div slot-scope="{row}">{{ campaignTypeDict[row.campaignType] }}</div>
      </el-table-column>

      <el-table-column
        prop="targetingType"
        label="投放方式"
        align="center">

        <div slot-scope="{row}">{{ targetingTypeDict[row.targetingType] }}</div>
      </el-table-column>

      <el-table-column
        prop="storeName"
        label="店铺"
        align="center">
      </el-table-column>

      <el-table-column
        prop="country"
        label="站点"
        align="center">
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="100">

        <template slot-scope="{row}">
        <el-button type="text" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
        
    </el-table>
    
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.current"
      :page-sizes="[20, 50, 100]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="marginTop: 10px">
    </el-pagination>
  </el-dialog>
</template>

<script>

import {
  queryCampaignList,
  getMarketplaceList,
  queryCampaignPage,
  deleteCampaign,
  getShopNameList } from '@/api/ppc/automation';

import { 
  campaignTypeDict,
  targetingTypeDict } from '../../util';

export default {

  props: {
    visible: {
      type: Boolean,
      require: true
    },
    rowInfo: {
      type: Object,
      require: true
    },
  },

  data() {
    return {
      campaignTypeDict,
      targetingTypeDict,
      loading: false,
      dataSource: [],
      form: {
        storeName: '',
        country: '',
        campaignType: '',
        targetingType: '',
        campaignState: '',
        automationlStatus: '',
        campaignName: ''
      },
      page: {
        size: 20,
        current: 1,
      },
      total: 0,
      marketplaceList: [],
      storeList: [],
      type: [
        {
          label: '全选',
          value: '全选'
        },
        {
          label: '商品推广（SP）',
          value: 'sponsoredProducts'
        },
        {
          label: '品牌推广（SB）',
          value: 'sd'
        },
        {
          label: '展示型推广（SD）',
          value: 'sb'
        },
      ],
      launchTypeList: [
        {
          label: '全选',
          value: '全选'
        },
        {
          label: 'SP-手动投放',
          value: 'manual'
        },
        {
          label: 'SP-自动投放',
          value: 'auto'
        },
        // {
        //   label: 'SB-关键词投放',
        //   value: 'SB-关键词投放'
        // },
        // {
        //   label: 'SB-商品投放',
        //   value: 'SB-商品投放'
        // },
        // {
        //   label: 'SBV-关键词投放',
        //   value: 'SBV-关键词投放'
        // },
        // {
        //   label: 'SBV-商品投放',
        //   value: 'SBV-商品投放'
        // },
        {
          label: 'SD-受众',
          value: 'T00030'
        },
        {
          label: 'SD-商品投放',
          value: 'T00020'
        },
      ],
      adStatusList: [
        {
          label: '运行中（广告）',
          value: 'enabled'
        },
        {
          label: '运行中和已暂停（广告）',
          value: '运行中和已暂停'
        },
        {
          label: '已暂停（广告）',
          value: 'paused'
        },
      ],
      ruleStatusList: [
        {
          label: '运行中（规则）',
          value: 'runing'
        },
        {
          label: '运行中和已暂停（规则）',
          value: '运行中和已暂停'
        },
        {
          label: '已暂停（规则）',
          value: 'stop'
        },
      ],
    };
  },

  mounted() {
    queryCampaignList({ templateId: this.rowInfo.id }).then(res => {
      this.storeList = [{ storeName: '不限' }, ...res.data.data.sort((a, b) => b.storeName.localeCompare(a.storeName))];
      // this.getMarketplaceList();
      
    });
    this.queryCampaignPage();
  },

  methods: {
    close() {
      this.$emit('update:visible', false);
    },

    empty() {
      this.form = {
        storeName: '',
        country: '',
        campaignType: '',
        targetingType: '',
        campaignState: '',
        automationlStatus: '',
        campaignName: ''
      };
      this.marketplaceList = [];
    },

    statusFormmat(val) {
      if (val === 'enabled') {
        return '运行中';
      } else if (val === 'paused') {
        return '已暂停';
      }
    },

    getMarketplaceList(storeName) {
      getShopNameList(storeName).then(res => {
        // this.marketplaceList = [{ name: '不限' }, ...this.marketplaceList.sort((a, b) => b.name.localeCompare(a.name))];
        this.marketplaceList = res.data.data.length && ['不限', ...res.data.data.sort((a, b) => b.localeCompare(a))] || [];
        
      });
    },

    queryCampaignPage() {
      this.loading = true;
      queryCampaignPage(Object.assign({
        ...this.page,
        id: this.rowInfo.id,
        ...this.form,
        country: this.form.country === '不限' ? '' : this.form.country,
        storeName: this.form.storeName === '不限' ? '' : this.form.storeName,
        campaignType: this.form.campaignType === '全选' ? '' : this.form.campaignType,
        targetingType: this.form.targetingType === '全选' ? '' : this.form.targetingType,
        campaignState: this.form.campaignState === '运行中和已暂停' ? '' : this.form.campaignState,
        automationlStatus: this.form.automationlStatus === '运行中和已暂停' ? '' : this.form.automationlStatus,
      })).then(res => {
        this.dataSource = res.data.data.records;
        this.total = res.data.data.total;
        this.loading = false;
      }).catch(() => this.loading = false);
    },

    handelShopChange(val) {
      this.form.country = '';
      if (!val) {
        this.marketplaceList = [];
      } else {
        this.getMarketplaceList(val);  
      }
      this.queryCampaignPage();
    },

    handleMarketplace() {
      this.queryCampaignPage();
    },

    handleSizeChange(val) {
      this.page.size = val;
      this.queryCampaignPage(); 
    },

    handleCurrentChange(val) {
      this.page.current = val;
      this.queryCampaignPage();
    },
    
    handleDelete(id) {
      deleteCampaign({
        templateId: this.rowInfo.id,
        campaignId: id,
      }).then(res => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '删除广告活动成功'
          });
          this.queryCampaignPage();
          this.$emit('success');
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  .filter {
    display: flex;
    flex-flow: wrap;
  }
  
  ::v-deep .el-button {
    padding: 0
  }

  .campaign {
    overflow:hidden; 
    text-overflow:ellipsis;
    display:-webkit-box; 
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2; 
  }

  .campaign:hover{
    text-overflow:inherit;
    overflow: visible;
    white-space: pre-line;
    -webkit-line-clamp: 10000;
  }
</style>
