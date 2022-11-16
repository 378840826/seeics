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
        popper-class="_auto_ad-store-select-popper"
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
        @change="v => handleChangeMarketplace(v)"
        class="select-marketplace"
        popper-class="_auto_ad-store-select-popper"
      >
        <el-option
          v-for="item in filterOptions.marketplaceList"
          :key="item"
          :label="item"
          :value="item"
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
        :size="componentsSize"
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

        <el-table-column prop="adjustmentTemplateVoList" label="分时调价" width="120">
          <template slot-scope="scope">6</template>
        </el-table-column>
        
        <el-table-column prop="automationTemplateVoList" label="搜索词">
          <template slot-scope="scope">
            <div 
              v-for="(item, index) in scope.row.automationTemplateVoList.length && scope.row.automationTemplateVoList" 
              :key="item"
              style=""
            >
              <el-dropdown @command="templateStutes">
              <span
                :class="item.campaignStatus !== 'stop' ? 'el-icon-video-play' : 'el-icon-video-pause'"
                :style="{color: item.campaignStatus !== 'stop' ? '#58bc58' : 'red'}"
              />
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
              <el-button 
                type="text" 
                @click="templateDetail(item.id, scope.row)" 
                size="mini" 
                style="margin: 5px 5px; padding: 0">
                  {{ item.templateName }}
                  <span 
                    style="margin: 5px 5px; padding: 0">
                    {{ item.automatedOperation ? item.automatedOperation : '无' }}
                  </span>
                </el-button>
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

        <el-table-column prop="" label="投放">
           <template slot-scope="scope">
             <div 
              v-for="(item, index) in scope.row.putTemplateVoList.length && scope.row.putTemplateVoList" 
              :key="item"
              style=""
            >
              <el-dropdown @command="templateStutes">
              <span
                :class="item.campaignStatus !== 'stop' ? 'el-icon-video-play' : 'el-icon-video-pause'"
                :style="{color: item.campaignStatus !== 'stop' ? '#58bc58' : 'red'}"
              />
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
              <el-button 
                type="text" 
                @click="templateDetail(item.id, scope.row, true)" 
                size="mini" 
                style="margin: 5px 5px; padding: 0">
                  {{ item.templateName }}
                  <span 
                    style="margin: 5px 5px; padding: 0">
                    {{ item.automatedOperation ? item.automatedOperation : '无' }}
                  </span>
                </el-button>
              <el-button
                v-if="index === scope.row.putTemplateVoList.length - 1"
                @click="handleTemplate(scope.row, true)" 
                class="el-icon-circle-plus-outline"
                style="fontSize: 14px; padding: 0; marginLeft: 0px"
                type="text"
              />
            </div>
            <span
              v-if="!scope.row.putTemplateVoList.length"
              @click="handleTemplate(scope.row, true)" 
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
      width="1200px"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
      destroy-on-close
      top="1vh"
      custom-class="dialog"
    > 
      <h4>{{dialogName}}：</h4>
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
        <el-button type="text" style="padding: 0" @click="$router.push('/ppc/automation-template')">去设置</el-button>
      </div>
      <h4>规则范围： </h4>
      <div v-if="!launchFlag" class="tabel">
        搜索词来源：
        <div style="width: 400px">

        <!-- <el-radio
          v-model="radio"
          @change="handleRadio" 
          :label="1"
          :disabled="isRadio">
            <el-popover
              width="200"
              trigger="click"
            >
            <el-button 
              slot="reference" 
              size="mini" 
              :disabled="radio === 2 ? true : false"
            >ASIN批量查询</el-button>
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
          </el-radio> -->
          
          <!-- <el-radio 
            v-model="radio"
            @change="handleRadio"
            :label="2"
            style="marginTop: 5px"
          > -->
          广告组：
            <el-select
              v-model="adGroupVal"
              ref="selectIt"
              multiple
              allow-create
              default-first-option
              collapse-tags
              closable
              class="select"
              popper-class="seeics-st-select"
              placeholder="请选择广告组"
              @focus="groupVisible = true; $refs.selectIt.blur()"
              @change="handleChangeGroup"
            >
              <el-option
                v-for="item in adGroupOption"
                :key="item.groupId"
                :label="item.groupName"
                :value="item.groupId">
              </el-option>
            </el-select>
          <!-- </el-radio> -->
        </div>
        <div style="marginLeft: 30px">
          <div>搜索词筛选结果处理：</div>
          <span>
             <el-radio-group v-model="searchWord" style="marginTop: 5px">
                <el-radio :label="1" :disabled="isRadio">关键词</el-radio>
                <el-radio :label="2" :disabled="isRadio">商品</el-radio>
                <el-radio :label="3" :disabled="isRadio">不限</el-radio>
              </el-radio-group>
          </span>
        </div>
          
      </div>
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
        </div>
      </div>
      <global-filter
        dateSelect
        v-if="ruleIs"
        ref="rule"
        :filterecho="ruleFiled"
        :fields="launchFlag ? 'launchFileds' : 'tatolFileds'"
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
        :launch="launchFlag"
        v-model="btnDisabled"
        :adGroupOption.sync="adGroupOption"
        :radio.sync="radio"
        :groupVisible.sync="groupVisible"
        :isGroupTabel.sync="isGroupTabel"
        :isRadio.sync="isRadio"
        :templateId.sync="templateId"
        :deduplication.sync="deduplication"
        :searchWord.sync="searchWord"
        @verifyClose="verifyClose"
      />
      <span slot="footer" class="dialog-footer">
        <el-button 
          size="mini" 
          @click="dialogCreateVisible = false;
            ruleIs = false;
            automationIs = false;
            updateBtn = false;
            radio = 1;
            adGroupOption = [];
            adGroupVal = [];
            campaignCheckedAll = false;
            templateId = '';
            autoMationTemplate = '';
            echoAtuomation = {};
            isRadio = false;"
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
        <!-- <el-button 
          size="mini" 
          type="primary" 
          @click="manualDelivery"
        >手动投放</el-button> -->
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
      :marketplace="form.marketplace"
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
    <el-dialog
      v-if="isGroupTabel"
      :visible.sync="groupVisible"
      :append-to-body="true"
      width="800px"
      class="tst"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
    >
    <h4>添加广告组：</h4>
    <p>请选择您要应该模板的广告组</p>
    <table-dialog 
      ref="adGroup"
      :adStoreId="adGroupPage.storeId"
      :templateId="templateId"
      :echoGroupList.sync="adGroupOption"
    />
    <span slot="footer" class="dialog-footer" style="textAlign: center">
        <el-button size="mini" type="primary" @click="hanldeAdGroup">确 定</el-button>
        <el-button size="mini" 
          @click="groupVisible = false;
          $refs.autoMation.handleAuto();
          $refs.adGroup.close();
        ">取 消</el-button>
      </span>
    </el-dialog>

    <adjustment-dialog
      :dialogVisible="true"
      :rowData="rowData"
    />
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
  templateStatus,
} from '@/api/ppc/autoAd';
import {
  stateExtendDict,
  campaignTypeDict,
  targetingTypeDict,
  formatTableSortParams,
} from '../util';
import { setStore, getStore } from '@/util/store';
import autoMation from './componets/automation.vue';
import globalFilter from '@/components/globalFilter/globalFilter.vue';
import dialogStatu from './componets/dialog.vue';
import tableDialog from './componets/tableDialog.vue';
import adjustmentDialog from './componets/adjustmentDialog.vue';

// 用于 localStorage 中保存选中店铺的 key
const currentShopNameKey = 'app-autoAd-currentShopName';
const currentShopMarketplaceKey = 'app-autoAd-currentShopMarketplace';

export default {
  name: 'autoAd',

  components: {
    autoMation,
    globalFilter,
    dialogStatu,
    tableDialog,
    adjustmentDialog,
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
      templateForm: {
        type: '搜索词自动化标签',
        itemList: [
          { template: '', label: '' },
        ],
      },
      // 创建模板参数
      dialogName: '',
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
      adGroupVal: [],
      adGroupOption: [], //广告组分页
      campaignCheckedAll: false,
      groupVisible: false,
      isGroupTabel: true,
      templateId: '',
      radio: 2,
      searchWord: 1,
      echoAdgroupList: [],
      adGroupPage: {
        current: 1,
        size: 100,
        total: 0,
        storeId: ''
      },
      time: null,
      templateStateList: [
        {
          value: 'runing',
          label: '运行'
        },
        {
          value: 'stop',
          label: '暂停',
        },
        // {
        //   value: 'stop',
        //   label: '归档',
        // }
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
      automationList: [],
      msgDialog: false,
      msgData: [],
      btnDisabled: false, //弹窗按钮限制
      noShopDialog: false, // 没绑定店铺弹窗
      launchFlag: false, //投放弹窗判断
      isRadio: false,
      // 模板去重
      deduplication: true,
    };
  },

  computed: {
  },
  // watch: {
  //   'adGroupVal': {
  //     handler(val) {
  //       this.adGroupOption = this.adGroupOption.filter(item => [...val].includes(item.groupId));
  //     },
  //     deep: true
  //   }
  // },
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
      // 查询 localStorage 中的店铺选中数据
      const localStorageCurrentShopName = getStore({ name: currentShopNameKey });
      if (localStorageCurrentShopName) {
        this.form.shopName = localStorageCurrentShopName;
      } else {
        this.form.shopName = list[0];
        // 保存在 localStorage
        setStore({ name: currentShopNameKey, content: list[0] });
      }
      // 用第一个店铺名称（或localStorage存储的店铺名称）来请求站点列表和表格数据
      if (Array.isArray(list) && list.length) {
        this.getMarketplaceListAndTableData(this.form.shopName);
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
      if (!queryParams.shopName || !queryParams.marketplace) {
        this.$message.warning('缺少店铺或站点');
        this.tableLoading = false;
        return;
      }
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
      queryMarketplaceList({ info: shopName }).then(mRes => {
        // 处理排序数据
        const mList = mRes.data.data.sort((a, b) => b.localeCompare(a));
        this.filterOptions.marketplaceList = mList;
        // 查询 localStorage 中的店铺选中数据
        const localStorageCurrentShopMarketplace = getStore({ name: currentShopMarketplaceKey });
        if (localStorageCurrentShopMarketplace) {
          this.form.marketplace = localStorageCurrentShopMarketplace;
        } else {
          this.form.marketplace = mList[0];
          // 保存在 localStorage
          setStore({ name: currentShopMarketplaceKey, content: mList[0] });
        }
        // 获取列表
        this.getTableData();
      });
    },

    // 切换店铺名称
    handleChangeShopName(shopName) {
      // 用新的 shopName 请求站点列表和表格数据
      this.getMarketplaceListAndTableData(shopName);
      // 保存在 localStorage
      setStore({ name: currentShopNameKey, content: shopName });
    },

    // 切换站点
    handleChangeMarketplace(val) {
      this.getTableData();
      // 保存在 localStorage
      setStore({ name: currentShopMarketplaceKey, content: val });
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
      this.$message.info('功能即将开放，请先前往 "广告-调整日志" 查看广告日志');
    },

    hanldeAdGroup() {
      this.adGroupOption = this.$refs.adGroup.getList();
      this.adGroupVal = this.$refs.adGroup.getFiled();
      this.groupVisible = false;
    },

    verifyClose() {
      this.$refs.adGroup.verifyClose();
      this.adGroupVal = this.$refs.adGroup.getFiled();
      this.adGroupOption = this.$refs.adGroup.getList();
    },

    hanldeCosle() {
      this.$refs.adGroup.close();
    },

    handleChangeGroup(value) {
      this.adGroupOption = this.adGroupOption.filter(item => value.includes(item.groupId)) || [];
    },

    handleRadio(val) {
      if (val === 2) {
        this.groupVisible = true; this.$refs.selectIt.blur();
      }
    },

    // 获取自动化模板
    getAutomationList(param) {
      getAutomationList({ templateType: param }).then(res => {
        if (res.data.code === 200) {
          const obj = [{
            value: '',
            label: '无'
          }];
          this.automationList = [...obj, ...res.data.data.map(item => {
            return {
              value: item.id,
              label: item.templateName
            };
          })];
        }
      });
    },

    // 添加模板按钮
    handleTemplate(row, launch) {
      if (launch) {
        this.launchFlag = true;
        this.formInline.templateType = '投放';
        this.dialogName = '创建投放';
      } else {
        this.launchFlag = false;
        this.formInline.templateType = '搜索词';
        this.dialogName = '创建搜索词';
      }
      this.getAutomationList(this.formInline.templateType);
      this.dialogCreateVisible = true; 
      this.rowData = row;
      this.ruleIs = true;
      this.automationIs = true;
      this.formInline.campaign = row.name;
      this.formInline.templateState = 'runing';
      this.autoMationTemplate = '';
      this.formInline.asinList = [];
      this.adGroupPage.storeId = row.adStoreId;
      this.isGroupTabel = this.isGroupTabel ? false : true;
      this.$nextTick(() => {
        this.isGroupTabel = this.isGroupTabel ? false : true;
      });
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
      let cpcValue = true;
      let minCpcMost = true;
      let maxCpcMost = true;

      if (params.automatedOperation === '创建广告活动') {
        if (this.$refs.autoMation.budgetMsg()) {
          return true;
        } else if (!params.createAdvertisingCampaignDTO.startTime) {
          this.$message({
            type: 'error',
            message: '请选择日期范围开始时间'
          });
          return true;
        } else if (!params.createAdvertisingCampaignDTO.frontPage) {
          this.$message({
            type: 'error',
            message: '搜索结果顶部不能为空'
          });
          return true;
        } else if (params.createAdvertisingCampaignDTO.frontPage > 900) {
          this.$message({
            type: 'error',
            message: '搜索结果顶部大于900%'
          });
          return true;
        } else if (!params.createAdvertisingCampaignDTO.productPage) {
          this.$message({
            type: 'error',
            message: '商品页面不能为空'
          });
          return true;
        } else if (params.createAdvertisingCampaignDTO.productPage > 900) {
          this.$message({
            type: 'error',
            message: '商品页面大于900%'
          });
          return true;
        }
      }

      params.adCampaignInfos && params.adCampaignInfos.map(item => {
        if (!item.adGroupId) {
          ad = false;
        }
        if (item.bid && !reg.test(item.bid)) {
          flag = false;
        }
        if (item.bidType === '固定竞价' && !item.bid) {
          msg = false;
        }
        if ((item.rule === '上浮(%)' 
          || item.rule === '下调(%)'
          || item.rule === '下调(绝对值)'
          || item.rule === '上浮(绝对值)')
          && !item.adjustTheValue) {
          cpcValue = false;
        }
        if ((item.rule === '下调(%)'
          || item.rule === '下调(绝对值)')
          && !item.bidLimitValue) {
          minCpcMost = false;
        }
        if ((item.rule === '上浮(%)'
          || item.rule === '上浮(绝对值)')
          && !item.bidLimitValue) {
          maxCpcMost = false;
        }
      });
      if (!this.launchFlag && params.automatedOperation !== '创建广告组' && !ad) {
        this.$message({
          type: 'error',
          message: '请选择广告组'
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
      if (!cpcValue) {
        this.$message({
          type: 'error',
          message: '请输入调整数值'
        });
        return true;
      }
      if (!minCpcMost) {
        this.$message({
          type: 'error',
          message: '请输入竞价最小值'
        });
        return true;
      }
      if (!maxCpcMost) {
        this.$message({
          type: 'error',
          message: '请输入竞价最大值'
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
      // if (this.radio === 1 && !this.formInline.asinList.filter(Boolean).length && !this.launchFlag) {
      //   this.$message({
      //     type: 'error',
      //     message: 'ASIN不能为空'
      //   });
      //   return true;
      // }
      if ((this.$refs.autoMation.getFiled().automatedOperation === '创建广告组' || this.$refs.autoMation.getFiled().automatedOperation === '创建广告活动') && this.radio === 2 && !this.adGroupOption.length) {
        this.$message({
          type: 'error',
          message: '请选择广告组'
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
        asinList: this.radio === 1 ? this.formInline.asinList.filter(Boolean) : [],
        automationTemplateId: this.autoMationTemplate,
        status: this.formInline.templateState,
        ruleType: this.radio,
        excludeTerms: this.$refs.autoMation.automatedOperation === '创建广告活动' ? 1 : this.searchWord,
        groupIdList: this.radio === 2 ? this.adGroupOption : [],
        deduplication: (this.$refs.autoMation.automatedOperation === '创建广告活动' || this.$refs.autoMation.automatedOperation === '创建广告组') && this.searchWord !== 2 && this.$refs.autoMation.form.deduplication ? 1 : 0 || 0
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
          this.templateId = '';
          this.autoMationTemplate = '';
          this.adGroupOption = [];
          this.adGroupVal = [];
          this.echoAtuomation = {};
          this.isRadio = false;
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
        asinList: this.radio === 1 ? this.formInline.asinList.filter(Boolean) : [],
        automationTemplateId: this.autoMationTemplate,
        status: this.formInline.templateState,
        ruleType: this.radio,
        excludeTerms: this.$refs.autoMation.automatedOperation === '创建广告活动' ? 1 : this.searchWord,
        groupIdList: this.radio === 2 ? this.adGroupOption : [],
        deduplication: (this.$refs.autoMation.automatedOperation === '创建广告活动' || this.$refs.autoMation.automatedOperation === '创建广告组') && this.searchWord !== 2 && this.$refs.autoMation.form.deduplication ? 1 : 0 || 0
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
            this.templateId = '';
            this.autoMationTemplate = '';
            this.adGroupOption = [];
            this.adGroupVal = [];
            this.echoAtuomation = {};
            this.isRadio = false;
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
          this.autoMationTemplate = '';
          this.templateId = '';
          this.adGroupOption = [];
          this.adGroupVal = [];
          this.echoAtuomation = {};
          this.isRadio = false;
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
    templateDetail(id, row, launch) {
      if (launch) {
        this.launchFlag = true;
        this.dialogName = '编辑投放';
      } else {
        this.launchFlag = false;
        this.dialogName = '编辑搜索词';
      }
      this.dialogCreateVisible = true; 
      this.rowData = row;
      this.ruleIs = true;
      this.automationIs = true;
      this.formInline.campaign = row.name;
      this.updateBtn = true;
      this.adGroupPage.storeId = row.adStoreId;
      this.templateId = id;
      templateDetail({ id, campaignId: row.campaignId }).then(res => {
        if (res.data.code === 200) {
          const data = res.data.data;
          this.ruleFiled = data.roleList;
          this.formInline.executionFrequency = data.executionFrequency;
          this.formInline.templateName = data.templateName;
          this.formInline.templateIllustrate = data.templateIllustrate;
          this.formInline.templateState = data.status;
          this.asinMskuKeyword = data.asinList && data.asinList.join('\n') || [];
          this.formInline.asinList = data.asinList;
          this.echoAtuomation = data;
          this.adGroupOption = data.groupIdList;
          this.formInline.templateType = data.templateType;
          this.deduplication = data.deduplication ? true : false;
          this.getAutomationList(this.formInline.templateType);
          data.groupIdList && data.groupIdList.map(item => {
            this.adGroupVal.push(item.groupId);
          });
          this.searchWord = this.isRadio ? 3 : data.excludeTerms;
          this.radio = 2;
          this.isGroupTabel = this.isGroupTabel ? false : true;
          this.$nextTick(() => {
            this.isGroupTabel = this.isGroupTabel ? false : true;
          });
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

<style lang="scss">
._auto_ad-store-select-popper {
  .el-select-dropdown__wrap {
    height: auto;
    max-height: 520px;
  }
}
</style>

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
  .seeics-st-select.el-select-dropdown.el-popper.is-multiple {
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
  // 广告活动和广告组选择器
  .select {
    width: 200px;

    ::v-deep {
      .el-tag {
        display: inline-flex;
        align-items: baseline;
        line-height: 22px;
        height: 24px;
      }

      .el-select__tags-text {
        max-width: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .el-input__inner {
        // height: auto !important;
        width: 300px;
      }
      .el-input {
        position: relative;
        font-size: 14px;
        display: inline-block;
        width: 300px;
      }
    }
  }
</style>
