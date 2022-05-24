<template>
  <basic-container>
    <el-row>
      <el-col :span="12" style="lineHeight: 40px">
        <el-input 
          v-model="formInline.templateName"
          clearable
          class="inputclass"
          placeholder="请输入需要分析的关键词" 
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
        <el-button type="primary" size="mini" @click="centerDialogVisible = true; flag = 'add'; ruleIs = true; automaticIs = true">创建模板</el-button>
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
    >
      <span>创建搜索词：</span>
      <div class="tabel">
        <span>规则名称：</span>
        <span style="width: 50%">
          <el-input
            v-model="formInline.templateName"
            placeholder="请输入规则名称"
          />
        </span>
      </div>
      <div class="tabel">
        <span>规则说明：</span>
        <div style="width: 70%">
          <el-input 
            v-model="formInline.templateIllustrate" 
            type="textarea"
            placeholder="模板说明最多支持1000个字符；"
          />
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
      <div style="display: flex; justify-content: space-between;">
        <div>
          执行频率
          <el-select v-model="formInline.executionFrequency">
            <el-option
              v-for="item in frequencyOption"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </div>
        <el-popover
          placement="bottom-end"
          width="200"
          trigger="click"
        >
        <el-button slot="reference" size="mini" style="marginRight: 0">ASIN批量查询</el-button>
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
        <el-button size="mini" type="primary" @click="save">确 定</el-button>
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
          :content="row.scope && strSplit(row.scope)[0] && strSplit(row.scope)[1]"
        >
          <span class="scope">{{row.scope && strSplit(row.scope)[0] && strSplit(row.scope)[1] || ''}}</span>
        </el-tooltip>
      </template>
      <template slot-scope="{row}" slot="menu">
        <el-button type="text" size="mini" @click="update(row.id)">编辑</el-button>
        <el-button type="text" size="mini" @click="addCampaign(row.id)">添加广告活动</el-button>
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
        <el-button size="mini" @click="groupVisible = false, tableDialog = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addCampaigns">确 定</el-button>
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
  addCampaign
} from '@/api/ppc/automatic';
export default {
  name: 'automaticTeplate',
  components: {
    globalFilter,
    Automatic,
    tableDialog
  },
  data() {
    return {
      data: [
        {
          id: 666,
          scope: '5454'
        }
      ],
      option: {
        emptyText: '没有找到相关商品，请重新查询',
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
            width: 230,
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
      asinMskuKeyword: '',
      ruleFiled: [],
      tableFiled: {},
      ruleIs: false,
      automaticIs: false,
      flag: 'add',
      updateId: '',
      automationTemplateId: '',
      tableDialog: false,
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
    strSplit(str) {
      return str.split('n');
    },
    getAutomationList() {
      getTemplatePage({
        current: this.page.currentPage, 
        size: this.page.pageSize, 
        templateName: this.formInline.templateName 
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
      this.formInline.templateName = '';
      this.getAutomationList();
    },
    save() {
      const automatic = this.$refs.automatic.getFiled();
      const params = {
        ...this.formInline,
        ...automatic,
        roleList: this.$refs.filters.getFileld()
      };
      if (this.flag === 'add') {
        createTemplate(params).then(res => {
          if (res.data.code === 200) {
            this.getAutomationList();
            this.centerDialogVisible = false;
          }
        });
      } else if (this.flag === 'update') {
        updateTemplate(Object.assign(params, { id: this.updateId })).then(res => {
          if (res.data.code === 200) {
            this.formInline.templateName = '';
            this.getAutomationList();
            this.centerDialogVisible = false;
          }
        });
      }
      
    },
    close() {
      if (this.flag === 'update') {
        this.ruleIs = false;
        this.automaticIs = false;
        this.ruleFiled = [];
        this.tableFiled = {};
        this.formInline = {
          ...this.formInline,
          templateIllustrate: '',
          templateName: '',
        };
      }
      this.centerDialogVisible = false;
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
    addCampaigns() {
      addCampaign(this.$refs.automation.getFiled()).then(res => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '添加广告活动成功'
          });
          this.groupVisible = false;
          this.automationTemplateId = '';
        }
      });
    },
    addCampaign(id) {
      this.tableDialog = true;
      if (id) {
        this.groupVisible = true;
        this.automationTemplateId = id;
      } else {
        // console.log(this.$refs.automation.getFiled())
      }
    }
  }
};
</script>

<style lang="scss" scoped>
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
    margin-top: 30px;
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
//  .inputclass[data-v-61329832] {
//     line-height: 38px;
//     width: 40%;
//   }
  ::v-deep .el-input__icon {
    line-height: 30px;
  }
</style>
