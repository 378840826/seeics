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
        @click="handleBacthBtn('batchTemplate')"
        :size="componentsSize"
        :disabled="!tableSelected.length"
      >批量设置模板</el-button>
      <el-button
        @click="handleBacthBtn('batchStatus')"
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
        
        <el-table-column prop="automationTemplateVoList" label="搜索词">
          <template slot-scope="scope">
            <div 
              v-for="(item, index) in scope.row.automationTemplateVoList.length && scope.row.automationTemplateVoList" 
              :key="item"
              style=""
            >
              <el-dropdown @command="templateStutes">
              <span :class="item.campaignStatus !== 'stop' ? 'el-icon-video-play' : 'el-icon-video-pause'" :style="{color: item.campaignStatus !== 'stop' ? '#58bc58' : 'red'}"/>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item 
                    v-for="i in templateStateList" 
                    @click="statu"
                    :key="i.value" 
                    :command="status(i.value, scope.row, item.id)"
                    :value="i.value"
                    :class="{'selected':item.campaignStatus === i.value}">{{i.label}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button type="text" @click="templateDetail(item.id, scope.row)" size="mini" style="margin: 5px 5px; padding: 0">{{ item.templateName }}</el-button>
              <el-button
                v-if="index === scope.row.automationTemplateVoList.length - 1"
                @click="handleTemplate(scope.row)" 
                class="el-icon-circle-plus-outline"
                style="fontSize: 14px; padding: 0; marginLeft: 0px"
                type="text"
              />
            </div>
            <span
              v-if="!scope.row.automationTemplateVoList.length"
              @click="handleTemplate(scope.row)" 
              class="el-icon-edit"
              style="fontSize: 14px"
              type="text"
            />
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
    
    <el-dialog
      :visible="dialogCreateVisible"
      :append-to-body="true"
      width="50%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
      destroy-on-close
      top="1vh"
      custom-class="dialog"
    > 
      <h4>创建搜索词：</h4>
      <div class="tabel">
        <span>广告活动：</span>
        <span style="width: 50%">
          <el-input
            v-model="formInline.campaign"
            placeholder="请输入规则名称"
            :disabled="true"
          />
        </span>
      </div>
      <div class="tabel">
        <span>模板类型：</span>
        <span style="width: 40%">
          <el-input
            v-model="formInline.templateType"
            placeholder="搜索词"
            :disabled="true"
          />
        </span>
      </div>
      <div class="tabel">
        <span>模板名称：
          <span v-if="!formInline.templateName" style="color: red">*</span>
        </span>
        <span style="width: 50%">
          <el-input
            v-model="formInline.templateName"
            placeholder="请输入模板名称"
          />
          <span 
            v-if="formInline.templateName.length > 50" 
            class="msg">请输入不超过50个字符的名称</span>
        </span>
      </div>
      <div class="tabel">
        <span>模板说明：</span>
        <div style="width: 70%">
          <el-input 
            v-model="formInline.templateIllustrate" 
            type="textarea"
            placeholder="模板说明最多支持1000个字符；"
          />
          <span 
            v-if="formInline.templateIllustrate.length > 1000" 
            class="msg">请输入不超过1000个字符的名称</span>
        </div>
      </div>
      <div class="tabel">
        <span>模板状态：</span>
        <avue-select
            v-model="formInline.templateState"
            :dic="templateStateList"
            :clearable="false"
            placeholder="请选择"
          />
      </div>
      <div class="tabel">
        <span>自动化模板：</span>
        <avue-select
          v-model="autoMationTemplate"
          :dic="automationList"
          @change="handlerRule"
          :clearable="false"
          placeholder="请选择自动化模板"
        />
        <el-button type="text" style="marginLeft: 30px; padding: 0" @click="$router.push('/ppc/automation-template')">去设置</el-button>
      </div>
      <h4>规则范围：</h4>
      <div>
        <div class="tabel">
          执行频率：
          <el-select v-model="formInline.executionFrequency">
            <el-option
              v-for="item in executionFrequencyList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
          <el-popover
            width="200"
            trigger="click"
          >
          <el-button slot="reference" size="mini" style="marginLeft: 30px">ASIN批量查询</el-button>
            <div>
              <el-input
                class="asin-textarea"
                v-model="asinMskuKeyword"
                placeholder="支持ASIN批量查询，搜索ASIN，找到ASIN相关的关键词；最多20个ASIN，换行间隔；"
                type="textarea"
                :rows="10"
                @input="handleTextAreaInput"
              />
            </div>
          </el-popover>
        </div>
        
      </div>
      <global-filter
        dateSelect
        v-if="ruleIs"
        ref="rule"
        :filterecho="ruleFiled"
        style="marginTop: 15px"
        v-model="btnDisabled"
      />
      <h4>自动化操作：</h4>
      <auto-mation
        v-if="automationIs"
        ref="autoMation"
        :rowData="rowData"
        :campaign="formInline.campaign"
        :echo="echoAtuomation"
      />
      <span slot="footer" class="dialog-footer">
        <el-button 
          size="mini" 
          @click="dialogCreateVisible = false;
            ruleIs = false;
            automationIs = false;
            updateBtn = false"
          >取 消</el-button>
        <el-button 
          size="mini" 
          type="primary" 
          @click="createAndSaves"
          :disabled="btnDisabled"
        >{{updateBtn ? '确认并保存模板' : '创建并保存模板'}}</el-button>
        <el-button 
          size="mini" 
          type="primary" 
          @click="createTemplate"
          :disabled="btnDisabled"
        >{{updateBtn ? '确 认' : '创 建'}}</el-button>
        <el-button 
          size="mini" 
          type="primary" 
          @click="manualDelivery"
        >手动投放</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible="msgDialog"
      :append-to-body="true"
      :show-close="false"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
    >
      <div v-for="item in msgData" :key="item.camId">
        <span>{{ item.keywordText }}：</span>
        <span>投放{{ item.state === 'fail' ? '失败' : '成功' }}</span>
        <span v-if="item.state === 'fail'">，失败原因：{{ item.failMsg }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button 
          size="mini" 
          type="primary" 
          @click="msgDialog = false"
          >OK</el-button>
      </span>
    </el-dialog>
    <dialog-statu
      v-if="dialogVisible"
      :dialogVisible="dialogVisible"
      :title="batch === 'batchTemplate' ? '批量设置模板' : '批量设置模板状态'"
      :batch="batch"
      v-model="dialogVisible"
      :tableSelected="tableSelected"
      :marketplace="marketplace"
      :getTableData="getTableData"
    />
    <el-dialog
      title="提示"
      :visible="noShopDialog"
      :append-to-body="true"
      :show-close="false"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
      center
    >
      <p>目前没有广告数据，请先在【我的店铺】完成绑定店铺和广告授权；</p>
      <span slot="footer" class="dialog-footer">
        <el-button 
          size="mini" 
          type="primary" 
          @click="noShopDialog = false; $router.push('/ppc/shop')"
          >好 的</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  queryShopNameList,
  queryMarketplaceList,
  queryCampaignList,
  getAutomationList,
  getAutomationDetail,
  manualDelivery,
  createAndSave,
  createTemplate,
  templateDetail,
  templateUpdate,
  templateStatus
} from '@/api/ppc/autoAd';
import {
  stateExtendDict,
  campaignTypeDict,
  targetingTypeDict,
  formatTableSortParams,
} from '../util';
import autoMation from './componets/automation.vue';
import globalFilter from '@/components/globalFilter/globalFilter.vue';
import dialogStatu from './componets/dialog.vue';
export default {
  name: 'ShopList',

  components: {
    autoMation,
    globalFilter,
    dialogStatu
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
      dialogVisible: false,
      batch: '',
      marketplace: '',
      templateForm: {
        type: '搜索词自动化标签',
        itemList: [
          { template: '', label: '' },
        ],
      },
      // 创建模板参数
      dialogCreateVisible: false,
      rowData: {},
      automationIs: false,
      ruleIs: false,
      asinMskuKeyword: '',
      formInline: {
        campaign: '',
        templateType: '搜索词',
        templateName: '', //模板名称
        templateIllustrate: '', // 模板说明
        executionFrequency: '30', //执行频率
        asinList: [], //ASIN集合
        templateState: 'runing',
      },
      templateState: 'runing',
      ruleFiled: [], //规则回显
      updateBtn: false, //
      templateStateList: [
        {
          value: 'runing',
          label: '运行'
        },
        {
          value: 'stop',
          label: '暂停'
        }
      ],
      executionFrequencyList: [
        {
          label: '每7天',
          value: '7'
        },
        {
          label: '每14天',
          value: '14'
        },
        {
          label: '每21天',
          value: '21'
        },
        {
          label: '每30天',
          value: '30'
        },
      ],
      autoMationTemplate: '',
      automationList: [
        {
          value: '',
          label: '无'
        }
      ],
      msgDialog: false,
      msgData: [],
      btnDisabled: false, //弹窗按钮限制
      noShopDialog: false, // 没绑定店铺弹窗
    };
  },

  computed: {
  },

  created() {
    // 店铺名称
    queryShopNameList().then(res => {
      this.tableLoading = true;
      if (!res.data.data.length) {
        this.tableLoading = false;
        this.noShopDialog = true;
      }
      const list = res.data.data.sort((a, b) => a.localeCompare(b));
      this.filterOptions.shopNameList = list;
      this.form.shopName = list[0];
      // 用第一个店铺名称来请求站点列表和表格数据
      if (Array.isArray(list) && list.length) {
        this.getMarketplaceListAndTableData(list[0]);
      }
    });
    getAutomationList().then(res => {
      if (res.data.code === 200) {
        res.data.data.map(item => {
          this.automationList.push({
            value: item.id,
            label: item.templateName
          });
        });
      }
    });
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
        // 处理排序数据
        const mList = mRes.data.data.sort((a, b) => b.name.localeCompare(a.name));
        this.filterOptions.marketplaceList = mList;
        this.form.marketplace = mList[0].name;
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
        marketplace: this.filterOptions.marketplaceList[0].name,
        campaignTypeList: [],
        targetingTypeList: [],
        state: '',
      };
      this.getTableData();
    },

    // 表格行选中
    handleSelectionChange(val) {
      this.tableSelected = val.map(item => item.campaignId);
      this.marketplace = val[0].marketplace;
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

    // 批量设置弹窗
    handleBacthBtn(name) {
      this.dialogVisible = true;
      this.batch = name;
      this.$emit('toDialog');
    },

    // 批量设置模板状态
    handleBatchState() {
      console.log('handleClickBatchTemplateState', this.tableSelected);
    },

    handleClickLog(row) {
      console.log('点击日志', row);
      this.$message.info('功能即将开放');
    },

    // 添加模板按钮
    handleTemplate(row) {
      this.dialogCreateVisible = true; 
      this.rowData = row;
      this.ruleIs = true;
      this.automationIs = true;
      this.formInline.campaign = row.name;
      this.formInline.templateState = 'runing';
      this.autoMationTemplate = '';
      this.formInline.asinList = [];
    },
    // 批量搜索输入框输入
    handleTextAreaInput(value) {
      const maxLines = 20;
      let valueArr = value.split(/\r\n|\r|\n/);
      // 超过行数时截取
      if (valueArr.length > maxLines) {
        valueArr = valueArr.slice(0, maxLines);
        value = valueArr.join('\n');
        this.asinMskuKeyword = value;
      }
      this.formInline.asinList = valueArr;
    },
    // 回显自动模板规则
    handlerRule(id) {
      if (id) {
        getAutomationDetail(id).then(res => {
          if (res.data.code === 200) {
            const data = res.data.data;
            this.ruleFiled = data.roleList;
            this.formInline.executionFrequency = data.executionFrequency;
            this.formInline.templateName = data.templateName;
            this.formInline.templateIllustrate = data.templateIllustrate;
            this.asinMskuKeyword = data.asinList.join('\n');
            this.formInline.asinList = data.asinList;
            this.ruleIs = this.ruleIs ? false : true;
            this.$nextTick(() => {
              this.ruleIs = this.ruleIs ? false : true;
            });
          }
        });
      } else {
        this.ruleFiled = [];
        this.formInline.executionFrequency = '30';
        this.formInline.templateName = '';
        this.formInline.templateIllustrate = '';
        this.asinMskuKeyword = '';
        this.ruleIs = this.ruleIs ? false : true;
        this.$nextTick(() => {
          this.ruleIs = this.ruleIs ? false : true;
        });
      }
    },
    // 投放统一校验
    deliveryMsg () {
      const params = this.$refs.autoMation.getFiled();
      // 判断竞价策略
      const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/;
      
      let flag = true;
      let msg = true;
      let ad = true;
      params.adCampaignInfos.map(item => {
        if (!item.adGroupId) {
          ad = false;
        }
        if (item.bid && !reg.test(item.bid)) {
          flag = false;
        }
        if (item.bidType === '固定竞价' && !item.bid) {
          msg = false;
        }
      });
      if (!ad) {
        this.$message({
          type: 'error',
          message: '请输选择广告组'
        });
        return true;
      }
      if (!flag) {
        this.$message({
          type: 'error',
          message: '固定竞价支持两位小数'
        });
        return true;
      }
      if (!msg) {
        this.$message({
          type: 'error',
          message: '请输入固定竞价'
        });
        return true;
      } 
    },
    // 子规则统一校验
    ruleMsg() {
      if (!this.formInline.templateName) {
        this.$message({
          type: 'error',
          message: '请输入模板名称'
        });
        return true;
      }
      if (this.formInline.templateName.length > 50) {
        this.$message({
          type: 'error',
          message: '模板名称不能超过50个字符'
        });
        return true;
      }
      if (this.formInline.templateIllustrate.length > 1000) {
        this.$message({
          type: 'error',
          message: '模板说明不能超过1000个字符'
        });
        return true;
      }
      if (!this.formInline.asinList.filter(Boolean).length) {
        this.$message({
          type: 'error',
          message: 'ASIN不能为空'
        });
        return true;
      }
      const roleList = this.$refs.rule.getFiled();
      if (!roleList[0].item.length) {
        this.$message({
          type: 'error',
          message: '请输入子规则中对应的数值'
        });
        return true;
      }
    },
    // 手动投放
    manualDelivery() {
      const params = this.$refs.autoMation.getFiled();
      if (this.deliveryMsg()) {
        return;
      }
      manualDelivery(params)
        .then(res => {
          if (res.data.code === 200) {
            this.msgDialog = true;
            this.msgData = res.data.data;
            this.dialogCreateVisible = false;
            this.ruleIs = false;
            this.automationIs = false;
          }
        });
    },
    // 创建并保存模板
    createAndSaves() {
      // return
      const params = {
        templateName: this.formInline.templateName,
        templateType: this.formInline.templateType,
        templateIllustrate: this.formInline.templateIllustrate,
        executionFrequency: this.formInline.executionFrequency,
        roleList: this.$refs.rule.getFiled(),
        asinList: this.formInline.asinList.filter(Boolean),
        automationTemplateId: this.autoMationTemplate,
        status: this.formInline.templateState
      };
      if (this.ruleMsg()) {
        return;
      }
      if (this.deliveryMsg()) {
        return;
      }
      createAndSave({ ...params, ...this.$refs.autoMation.getFiled() }).then(res => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: `${this.updateBtn ? '确认' : '创建'}并保存模板成功`
          });
          this.dialogCreateVisible = false;
          this.ruleIs = false;
          this.automationIs = false;
          this.getTableData();
        }
      });
    },
    createTemplate() {
      // return
      const params = {
        templateName: this.formInline.templateName,
        templateType: this.formInline.templateType,
        templateIllustrate: this.formInline.templateIllustrate,
        executionFrequency: this.formInline.executionFrequency,
        roleList: this.$refs.rule.getFiled(),
        asinList: this.formInline.asinList.filter(Boolean),
        automationTemplateId: this.autoMationTemplate,
        status: this.formInline.templateState
      };
      if (this.ruleMsg()) {
        return;
      }
      if (this.deliveryMsg()) {
        return;
      }
      if (this.updateBtn) {
        templateUpdate({ ...params, ...this.$refs.autoMation.getFiled() }).then(res => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '编辑模板成功'
            });
            this.dialogCreateVisible = false;
            this.ruleIs = false;
            this.automationIs = false;
            this.getTableData();
          }
        });
        return;
      }
      createTemplate({ ...params, ...this.$refs.autoMation.getFiled() }).then(res => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '添加模板成功'
          });
          this.dialogCreateVisible = false;
          this.ruleIs = false;
          this.automationIs = false;
          this.getTableData();
        }
      });
    },

    status(name, row, id) {
      return {
        'status': name,
        'campaignId': row.campaignId,
        'automationTemplateId': id
      };
    },
    
    templateStutes(params) {
      templateStatus(params).then(res => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '设置模板状态成功'
          });
          this.getTableData();
        }
      });
    },

    // 模板详情
    templateDetail(id, row) {
      this.dialogCreateVisible = true; 
      this.rowData = row;
      this.ruleIs = true;
      this.automationIs = true;
      this.formInline.campaign = row.name;
      this.updateBtn = true;
      templateDetail({ id, campaignId: row.campaignId }).then(res => {
        if (res.data.code === 200) {
          const data = res.data.data;
          this.ruleFiled = data.roleList;
          this.formInline.executionFrequency = data.executionFrequency;
          this.formInline.templateName = data.templateName;
          this.formInline.templateIllustrate = data.templateIllustrate;
          this.formInline.templateState = data.status;
          this.asinMskuKeyword = data.asinList.join('\n');
          this.formInline.asinList = data.asinList;
          this.echoAtuomation = data;
          this.ruleIs = this.ruleIs ? false : true;
          this.$nextTick(() => {
            this.ruleIs = this.ruleIs ? false : true;
          });
          this.automationIs = this.automationIs ? false : true;
          this.$nextTick(() => {
            this.automationIs = this.automationIs ? false : true;
          });
        }
      });
    },

  }
};
</script>

<style lang="scss" scoped>
  @import "./index.scss";

  .tabel {
    display: flex;
    margin-top: 15px;
    line-height: 30px;
    .msg {
      color: red;
      font-size: 8px;
    }
    ::v-deep .el-input__inner {
      line-height: 30px;
      height: 30px;   
    }
    ::v-deep .el-input__icon {
      line-height: 30px;
    }
  }
  .selected{
    color:#409EFF;
  }
</style>
