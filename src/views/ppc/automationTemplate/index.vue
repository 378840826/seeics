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
            automaticIs = true"
        >创建模板</el-button>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="centerDialogVisible"
      :append-to-body="true"
      width="50%"
      class="tst"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="hidden"
      center
    >
      <span>创建搜索词：</span>
      <div class="tabel">
        <span>模板名称：
          <span v-if="!formInline.templateName" style="color: red">*</span>
        </span>
        <span style="width: 50%">
          <el-input
            v-model="formInline.templateName"
            placeholder="请输入规则名称"
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
            class="msg">请输入不超过1000个字符的说明</span>
        </div>
      </div>
      <div class="tabel">
        <span>模板类型：</span>
        <avue-select
            v-model="formInline.templateType"
            :dic="templateTypeList"
            placeholder="请选择"
          />
      </div>
      <h3>规则范围：</h3>
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
      <global-filter 
        v-if="ruleIs"
        ref="filters" 
        fields="tatolFileds" 
        :filterecho="ruleFiled"
        v-model="saveDisabled"
        dateSelect 
        style="marginTop: 10px"
      />
      <automatic 
        v-if="automaticIs"
        ref="automatic"
        :echo="tableFiled"
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
          popper-class="tooltip"
          
        >
          <div slot="content">
             <div v-for="item in  strSplit(row.scope)" :key="item" style="maxWidth: 150PX">{{item}}</div>
          </div>
          <span class="scope">{{row.scope && strSplit(row.scope)[0] && strSplit(row.scope)[1] || ''}}</span>
        </el-tooltip>
      </template>
      <template slot-scope="{row}" slot="menu">
        <el-button type="text" size="mini" @click="remove(row.id)">删除</el-button>
        <el-button type="text" size="mini" @click="update(row.id)">编辑</el-button>
        <!-- <el-button type="text" size="mini" @click="addCampaignBtn(row.id)">添加广告活动</el-button> -->
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
    <h4>添加广告活动：</h4>
    <p>请选择您要应该模板的广告活动</p>
    <table-dialog 
      :automationTemplateId="automationTemplateId"
      ref="automation"
    />
    <span slot="footer" class="dialog-footer" style="textAlign: center">
        <el-button size="mini" type="primary" @click="addCampaign">确 定</el-button>
        <el-button size="mini" @click="groupVisible = false, tableDialog = false">取 消</el-button>
      </span>
    </el-dialog>
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
  removeTemplate
} from '@/api/ppc/automation';
export default {
  name: 'automaticTeplate',
  components: {
    globalFilter,
    Automatic,
    tableDialog
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
            width: 150,
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
        executionFrequency: '7', //执行频率
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
      }]
    };
  },
  methods: {
    empty() {
      this.formInline.templateName = '';
      this.formInline.templateIllustrate = '';
      this.asinMskuKeyword = '';
    },
    strSplit(str) {
      return str.split('n').filter(Boolean);
    },
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
    save() {
      if (!this.formInline.templateName) {
        this.$message({
          type: 'error',
          message: '请输入模板名称'
        });
        return;
      }
      if (this.formInline.templateName.length > 50) {
        this.$message({
          type: 'error',
          message: '模板名称不能超过50个字符'
        });
        return;
      }
      if (this.formInline.templateIllustrate.length > 1000) {
        this.$message({
          type: 'error',
          message: '模板说明不能超过1000个字符'
        });
        return;
      }
      const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/;
      const automatic = this.$refs.automatic.getFiled();
      if (!reg.test(Number(automatic.bid))) {
        this.$message({
          type: 'error',
          message: '固定竞价支持填入小数点后两位小数'
        });
        return;
      }
      const params = {
        ...this.formInline,
        ...automatic,
        roleList: this.$refs.filters.getFiled()
      };
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
      this.centerDialogVisible = false;
    },
    hidden() {
      this.ruleIs = false;
      this.automaticIs = false;
    },
    async update(id) {
      this.flag = 'update';
      this.updateId = id;
      
      await detailTemplate(id).then(res => {
        if (res.data.code === 200) {
          const result = res.data && res.data.data;
          this.ruleFiled = result.roleList;
          this.tableFiled = {
            automatedOperation: result.automatedOperation,
            bidType: result.bidType,
            matchType: result.matchType,
            bid: result.bid
          };
          this.formInline = {
            ...this.formInline,
            executionFrequency: result.executionFrequency,
            templateIllustrate: result.templateIllustrate,
            templateName: result.templateName,
            templateType: result.templateType
          };
          this.asinMskuKeyword = result.asinList.join('\n');
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
    addCampaign() {
      addCampaign(this.$refs.automation.getFiled()).then(res => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '添加广告活动成功'
          });
          this.groupVisible = false;
          this.tableDialog = false;
          this.automationTemplateId = '';
        }
      });
    },
    addCampaignBtn(id) {
      this.tableDialog = true;
      if (id) {
        this.groupVisible = true;
        this.automationTemplateId = id;
      }
    },
    remove(id) {
      removeTemplate(id).then(res => {
        if (res.data.code === 200) {
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
    margin-top: 15px;
    line-height: 30px;
    .msg {
      color: red;
      font-size: 8px;
    }
  }
  .explain {
    margin-top: 20px;
    p {
      font-size: 12px;
      margin: 0;
    }
  }
  ::v-deep .el-dialog__header {
    padding: 0 0 0 0;
  }
  ::v-deep .dialog-footer {
    text-align: center;
    padding: 0 0 0 0;
  }
  .scope {
    display: inline-block;
    max-width: 140px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  ::v-deep .el-input__icon {
    line-height: 30px;
  }
  .tooltip {
    // width: 150px !important;
    color: aqua !important;
  }
</style>
