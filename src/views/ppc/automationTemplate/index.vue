<template>
  <basic-container>
    <el-row>
      <el-col :span="16" style="lineHeight: 40px">
        <el-input 
          v-model="templateName"
          clearable
          class="inputclass"
          placeholder="请输入模板名称" 
        />
        <el-button 
          @click="search"
          class="btn" 
          size="mini"
        >搜索</el-button>
        <el-button 
          class="btn" 
          size="mini"
          @click="reset"
        >重置</el-button>
        <el-button 
          class="btn"
          type="primary" 
          size="mini" 
          @click="centerDialogVisible = true; 
            flag = 'add'; 
            ruleIs = true; 
            automaticIs = true;
            isLaunch(formInline.templateType);"
        >创建模板</el-button>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="centerDialogVisible"
      :append-to-body="true"
      width="1150px"
      class="tst"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="hidden"
      center
      top="1vh"
    >
      <div slot="title" style="text-align: left"> {{flag === 'update' ? '编辑模板' : '创建模板'}}</div>
      <!-- <h4>创建搜索词：</h4> -->
      <div class="tabel">
        <span>模板名称：
          <span v-if="!formInline.templateName" style="color: red">*</span>
        </span>
        <span style="width: 50%">
          <el-input
            v-model="formInline.templateName"
            placeholder="请输入模板名称"
            @blur="hanlderName"
          />
          <span 
            v-if="formInline.templateName.length > 50" 
            class="msg">请输入不超过50个字符的名称</span>
          <span 
            v-else-if="templateNameMsg" 
            class="msg">该模板名称已存在</span>
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
            class="msg" style="top: 45px">请输入不超过1000个字符的说明</span>
        </div>
      </div>
      <div class="tabel">
        <span>模板类型：</span>
        <!-- <avue-select
            v-model="formInline.templateType"
            :dic="templateTypeList"
            :clearable="false"
            placeholder="请选择"
            @change="handleType"
          /> -->
          <el-select v-model="formInline.templateType" @change="handleType" :disabled="flag === 'update'">
            <el-option
              v-for="item in templateTypeList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
      </div>
      <h4>规则范围：</h4>
      <div >
          执行频率：
          <el-select v-model="formInline.executionFrequency">
            <el-option
              v-for="item in frequencyOption"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        <!-- <el-popover
          width="200"
          trigger="click"
          v-if="!launch"
        >
        <el-button
          slot="reference"
          size="mini"
          style="marginLeft: 30px">ASIN批量查询</el-button>
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
        </el-popover> -->
      </div>
      <global-filter 
        v-if="ruleIs"
        ref="filters" 
        :fields="launch ? 'launchFileds' : 'tatolFileds'" 
        :filterecho="ruleFiled"
        v-model="saveDisabled"
        dateSelect 
        style="marginTop: 10px"
      />
      <h4>自动化操作：</h4>
      <automatic 
        v-if="automaticIs"
        ref="automatic"
        :echo="tableFiled"
        :templateType="formInline.templateType"
        :deduplication="deduplication"
      />
      <div class="explain">
        <p>操作要点</p>
        <p>1. 您设置的自动化模板可以添加到商品推广（Sponsored Product）、品牌推广（Sponsored Brand）、展示型推广（Sponsored Display）广告。</p>
        <p>2. 在广告管理页面，点击广告活动名称，然后进入“广告自动化”tab页，可以通过各种自动化规则的创建、编辑弹窗应用自动化模板</p>
        <p>3. 在广告自动化页面，点击广告活动名称对应的自动化操作，可以批量添加自动化模板。</p>
        <p>4. 已经添加到广告活动的自动化模板，编辑后若选择“仅保存”，请注意设置一个新的模板名称。</p>
        <p>1. 每个自动化标签最多支持一种自动化操作。</p>
        <p>2.  同一个广告活动下，同类型的广告自动化规则不可重复应用同一个自动化模板。</p>
        <p>规则执行</p>
        <p>1. 广告自动化按照广告所在站点时间执行。</p>
        <p>备注信息</p>
        <p>广告自动化的数据范围排除最近3天，如最近14天，实际指第17-4天。</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="close">取 消</el-button>
        <el-button 
          size="mini" 
          type="primary" 
          @click="save"
          :disabled="saveDisabled"
        >保 存</el-button>
      </span>
    </el-dialog>
    <avue-crud 
      :option="option" 
      v-model="user"
      :data="data" 
      :page.sync="page"
      @size-change="sizeChange"
      @current-change="currentChange"
      @sort-change="sortChange"
      @on-load="getAutomationList"
    >
      <template slot-scope="{row}" slot="scope">
        <div>{{row.scope && strSplit(row.scope)[0] && strSplit(row.scope)[0] || row.scope}}</div>
        <el-tooltip 
        >
          <div slot="content" class="content">
             <div v-for="item in  strSplit(row.scope)" :key="item">{{item}}</div>
          </div>
          <span class="scope">{{row.scope && strSplit(row.scope)[0] && strSplit(row.scope)[1] || ''}}</span>
        </el-tooltip>
      </template>

      <template slot-scope="{row}" slot="advertisingCampaignNums">
        <el-button
          type="text"
          @click="campiagnDialogVisible = true; rowInfo = row">{{row.advertisingCampaignNums}}</el-button>
      </template>

      <template slot-scope="{row}" slot="menu">
        <!-- <el-button type="text" size="mini" @click="remove(row.id)">删除</el-button> -->
        <el-popconfirm
          :title="'您确定删除模板：' + row.templateName"
          @confirm="remove(row.id)"
        >
          <el-button type="text" size="mini" slot="reference">删除</el-button>
        </el-popconfirm>
        <el-button type="text" size="mini" @click="update(row.id)">编辑</el-button>
        <el-button type="text" size="mini" @click="addCampaignBtn(row)">添加广告活动</el-button>
      </template>
    </avue-crud>
    <el-dialog
      v-if="tableDialog"
      :visible.sync="groupVisible"
      :append-to-body="true"
      width="80%"
      class="tst"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
    >
    <div slot="title" style="text-align: left">添加广告活动：</div>
    <p>请选择您要应该模板的广告活动</p>
    <table-dialog 
      :automationRow="automationRow"
      ref="automation"
    />
    <span slot="footer" class="dialog-footer" style="textAlign: center">
        <el-button size="mini" type="primary" @click="addCampaign">确 定</el-button>
        <el-button size="mini" @click="groupVisible = false, tableDialog = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 广告活动 -->
    <campaign-dialog
      v-if="campiagnDialogVisible"
      :visible.sync="campiagnDialogVisible"
      :rowInfo="rowInfo"
      @success="getAutomationList"
    />
  </basic-container>
</template>

<script>
import globalFilter from '@/components/globalFilter/globalFilter.vue';
import Automatic from './components/automatic.vue';
import tableDialog from './components/tableDialog.vue';
import { 
  createTemplate,
  detailTemplate,
  getTemplatePage,
  updateTemplate,
  addCampaign,
  removeTemplate,
  repeatName
} from '@/api/ppc/automation';
import campaignDialog from './components/campaign.vue';

export default {
  name: 'automaticTeplate',
  components: {
    globalFilter,
    Automatic,
    tableDialog,
    campaignDialog
  },
  data() {
    return {
      data: [],
      option: {
        emptyText: '没有找到相关模板，请重新查询',
        addBtn: false,
        border: true,
        columnBtn: false,
        refreshBtn: false,
        saveBtn: false,
        updateBtn: false,
        cancelBtn: false,
        delBtn: false,
        menu: false,
        editBtn: false,
        align: 'center',
        menuAlign: 'left',
        rowKey: 'id',
        tip: false,
        height: 'calc(100vh - 290px)',
        column: [
          {
            label: '模板名称',
            prop: 'templateName',
            // width: 200,
            //slot:true
          },
          {
            label: '模板类型',
            prop: 'templateType',
            sortable: true, //排序
            // width: 283,
          },
          {
            label: '规则或范围',
            prop: 'scope',
            width: 280,
            slot: true,            
          },
          {
            label: '广告活动数量',
            prop: 'advertisingCampaignNums',
            // width:700,
            slot: true,            
          },
          {
            label: '创建账号',
            prop: 'createUserName',
            minWidth: 128,
            slot: true,            
          },
          {
            label: '创建时间',
            prop: 'createTime',
            minWidth: 130,
            slot: true,            
          },
          {
            label: '更新时间',
            prop: 'updateTime',
            minWidth: 130,
            slot: true,            
          },
          {
            label: '更新人账号',
            prop: 'updateUserName',
            minWidth: 128,
            slot: true,            
          },
          {
            label: '操作',
            prop: 'menu',
            align: 'center',
            width: 130,
            fixed: 'right'
          },
        ],
      },
      page: {
        total: 0,
        currentPage: 1,
        layout: 'total, sizes, prev, pager, next, jumper',
        pageSize: 20,
        pageSizes: [20, 50, 100],
      },
      centerDialogVisible: false,
      groupVisible: false,
      formInline: {
        templateName: '', //规则名称
        templateIllustrate: '', // 模板说明
        executionFrequency: '30', //执行频率
        asinList: [], //ASIN集合
        templateType: '搜索词',
      },
      templateName: '',
      asinMskuKeyword: '',
      ruleFiled: [],
      tableFiled: {},
      ruleIs: false,
      automaticIs: false,
      flag: 'add',
      updateId: '',
      automationTemplateId: '',
      tableDialog: false,
      saveDisabled: true,
      frequencyOption: [
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
      templateTypeList: [{
        label: '搜索词',
        value: '搜索词'
      }, {
        label: '投放',
        value: '投放'
      }],
      templateNameMsg: false, //模板名称校验
      launch: false, //监听是否投放
      campiagnDialogVisible: false,
      rowInfo: {},
      deduplication: true,
    };
  },
  methods: {
    isLaunch(val) {
      if (val === '投放') {
        this.launch = true;
      } else if (val === '搜索词') {
        this.launch = false;
      }
    },
    handleType(val) { //监听模板变化
      this.$refs.automatic.wathcType(val);
      this.isLaunch(val);
      this.ruleIs = this.ruleIs ? false : true;
      this.$nextTick(() => {
        this.ruleIs = this.ruleIs ? false : true;
      });
    },
    empty() {
      this.formInline.templateName = '';
      this.formInline.templateIllustrate = '';
      this.asinMskuKeyword = '';
      this.formInline.templateType = '搜索词';
    },
    strSplit(str) {
      return str.split('n').filter(Boolean);
    },
    // 获取模板列表
    getAutomationList() {
      getTemplatePage({
        current: this.page.currentPage, 
        size: this.page.pageSize, 
        templateName: this.templateName 
      }).then(res => {
        if (res.data.code === 200) {
          this.data = res.data.data.records;
          this.page.total = res.data.data.total;
          this.page.currentPage = res.data.data.current;
        }
      });
    },
    search() {
      this.getAutomationList();
    },
    reset() {
      this.templateName = '';
      this.getAutomationList();
    },
    // 模板名称发请求校验
    hanlderName(e) {
      repeatName(e.target.value).then(res => {
        if (res.data.success) {
          this.saveDisabled = false;
          this.templateNameMsg = false;
        } else {
          this.saveDisabled = true;
          this.templateNameMsg = true;
        }
      });
    },
    // 模板校验
    templateMsg() {
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
      // const automatic = this.$refs.automatic.getFiled();
      // if (!this.formInline.asinList.filter(Boolean).length && !this.launch && automatic.automatedOperation !== '创建广告组') {
      //   this.$message({
      //     type: 'error',
      //     message: 'ASIN不能为空'
      //   });
      //   return true;
      // }
    },
    // 
    deliveryMsg() {
      const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/;
      const automatic = this.$refs.automatic.getFiled();

      if (automatic.automatedOperation === '创建广告活动') {
        if (this.$refs.automatic.budgetMsg()) {
          return true;
        } else if (!automatic.createAdvertisingCampaignDTO.startTime) {
          this.$message({
            type: 'error',
            message: '请选择日期范围开始时间'
          });
          return true;
        } else if (automatic.createAdvertisingCampaignDTO.frontPage > 900) {
          this.$message({
            type: 'error',
            message: '搜索结果顶部大于900%'
          });
          return true;
        } else if (automatic.createAdvertisingCampaignDTO.productPage > 900) {
          this.$message({
            type: 'error',
            message: '商品页面大于900%'
          });
          return true;
        }
      }

      if (!reg.test(Number(automatic.bid))) {
        this.$message({
          type: 'error',
          message: '固定竞价支持填入小数点后两位小数'
        });
        return true;
      }
      if (automatic.bidType === '固定竞价' && !automatic.bid) {
        this.$message({
          type: 'error',
          message: '请输入固定竞价'
        });
        return true;
      }
      if ((automatic.rule === '上浮(%)' 
          || automatic.rule === '下调(%)'
          || automatic.rule === '下调(绝对值)'
          || automatic.rule === '上浮(绝对值)')
          && !automatic.adjustTheValue) {
        this.$message({
          type: 'error',
          message: '请输入调整数值'
        });
        return true;
      }
      if ((automatic.rule === '上浮(%)'
          || automatic.rule === '上浮(绝对值)')
          && !automatic.bidLimitValue) {
        this.$message({
          type: 'error',
          message: '请输入竞价最大值'
        });
        return true;
      }
      if ((automatic.rule === '下调(%)'
          || automatic.rule === '下调(绝对值)')
          && !automatic.bidLimitValue) {
        this.$message({
          type: 'error',
          message: '请输入竞价最小值'
        });
        return true;
      }
    },
    // 创建模板
    save() {
      if (this.templateMsg()) {
        return;
      }
      if (this.deliveryMsg()) {
        return;
      }

      const automatic = this.$refs.automatic.getFiled();
      const params = {
        ...this.formInline,
        asinList: automatic.automatedOperation === '创建广告组' ? [] : this.formInline.asinList.filter(Boolean),
        ...automatic,
        ruleType: 1,
        excludeTerms: 0,
        roleList: this.$refs.filters.getFiled(),
        deduplication: (this.$refs.automatic.automatedOperation === '创建广告活动' || this.$refs.automatic.automatedOperation === '创建广告组') && this.$refs.automatic.form.deduplication ? 1 : 0 || 0
      };

      if (!params.roleList[0].item.length) {
        this.$message({
          type: 'error',
          message: '请输入子规则中对应的数值'
        });
        return;
      }
      if (this.flag === 'add') {
        createTemplate(params).then(res => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '创建模板成功'
            });
            this.empty();
            this.getAutomationList();
            this.centerDialogVisible = false;
          }
        });
      } else if (this.flag === 'update') {
        updateTemplate(Object.assign(params, { id: this.updateId })).then(res => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '修改模板成功'
            });
            this.empty();
            this.getAutomationList();
            this.ruleFiled = [];
            this.tableFiled = {};
            this.centerDialogVisible = false;
          }
        });
      }
      
    },
    close() {
      if (this.flag === 'update') {
        this.ruleFiled = [];
        this.tableFiled = {};
        this.empty();
      }
      this.formInline.templateType = '搜索词';
      this.centerDialogVisible = false;
      this.templateNameMsg = false;
    },
    hidden() {
      this.ruleIs = false;
      this.automaticIs = false;
    },
    // 编辑模板
    async update(id) {
      this.flag = 'update';
      this.updateId = id;
      this.templateNameMsg = false;
      
      await detailTemplate(id).then(res => {
        if (res.data.code === 200) {
          const result = res.data && res.data.data;
          this.ruleFiled = result.roleList;
          this.tableFiled = {
            automatedOperation: result.automatedOperation,
            bidType: result.bidType,
            matchType: result.matchType,
            bid: result.bid,
            rule: result.rule,
            adjustTheValue: result.adjustTheValue,
            bidLimitValue: result.bidLimitValue,
            createAdvertisingCampaignDTO: result.createAdvertisingCampaignDTO,
            customText: result.customText
          };
          this.formInline = {
            ...this.formInline,
            executionFrequency: result.executionFrequency,
            templateIllustrate: result.templateIllustrate,
            templateName: result.templateName,
            templateType: result.templateType,
            asinList: result.asinList
          };
          this.deduplication = result.deduplication ? true : false;
          this.asinMskuKeyword = result.asinList.join('\n');
          this.isLaunch(this.formInline.templateType);
        }
      }).catch(res => {
        this.$message({
          type: 'error',
          message: res
        });
        this.ruleIs = true;
        this.automaticIs = true;
        this.centerDialogVisible = true;
      });
      this.ruleIs = true;
      this.automaticIs = true;
      this.centerDialogVisible = true;
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
    // 保存添加广告活动
    addCampaign() {
      const params = this.$refs.automation.getFiled();
      if (!params.detailDtoList.length) {
        this.$message({
          type: 'error',
          message: '请勾选广告活动'
        });
        return;
      }
      addCampaign(this.$refs.automation.getFiled()).then(res => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '添加广告活动成功'
          });
          this.groupVisible = false;
          this.tableDialog = false;
          this.automationTemplateId = '';
          this.getAutomationList();
        }
      });
    },
    // 添加广告活动按钮
    addCampaignBtn(row) {
      this.tableDialog = true;
      if (row) {
        this.groupVisible = true;
        this.automationRow = row;
      }
    },
    remove(id) {
      removeTemplate(id).then(res => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.getAutomationList();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  ::v-deep .avue-crud__menu {
    min-height: 0px;
  }
  ::v-deep .el-input__inner {
    line-height: 30px;
    height: 30px;   
  }
  .inputclass {
    line-height: 38px;
    width: 40%;
  }
  .btn {
    margin-left: 40px;
  }
  .tabel {
    display: flex;
    position: relative;
    margin-top: 15px;
    line-height: 30px;
    .msg {
      position: absolute;
      color: red;
      font-size: 8px;
      top: 21px;
      left: 80px;
    }
  }
  .explain {
    margin-top: 20px;
    p {
      font-size: 12px;
      margin: 0;
    }
  }
  ::v-deep .el-dialog__body{
    padding: 0px 25px 30px;
  }
  ::v-deep .dialog-footer {
    text-align: center;
    padding: 0 0 0 0;
  }
  .scope {
    display: inline-block;
    max-width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .content {
    width: 200px; 
    max-height: 200px;
    overflow-y: scroll;

  }
  ::v-deep .el-input__icon {
    line-height: 30px;
  }
</style>
