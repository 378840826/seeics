<template>
  <el-dialog
  :visible.sync="dialogVisible"
  :append-to-body="true"
  width="50%"
  center
  :show-close="false"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
  :before-close="handleClose">
    <div slot="title" class="title"><span>{{title}}</span></div>
    <el-form :label-position="labelPosition" ref="form" label-width="115px" :model="formLabelAlign">
        <el-row>
          <el-col :span="10">
            <el-form-item label="广告自动化类型" >
              <avue-select
                v-model="formLabelAlign.adType"
                :clearable="false"
                :dic="[{label: '搜索词', value: '搜索词'}]"
                placeholder="请选择"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="batch === 'batchTemplate'">
          <el-row 
            v-for="(item, index) in formLabelAlign.data" 
            :key="index">
            <el-col :span="10">
              <el-form-item 
                label="自动化模板" 
                :prop="'data.' + index + '.automationTemplateId'"
                :rules="[
                  { required: true, message: '请选择模板'}
                ]">
                <avue-select
                  v-model="item.automationTemplateId"
                  :clearable="false"
                  :dic="templateList"
                  @change="selectName($event,index)"
                  placeholder="请选择"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item 
                label="标签名称"
                :prop="'data.' + index +'.templateName'"
                :rules="[
                  { required: true, message: '标签名称不能为空'},
                  { max: 50, message: '长度最多 50 个字符', trigger: 'change' }
                ]"
              >
                <el-input v-model="item.templateName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
            <span 
              v-if="formLabelAlign.data.length !== 1"
              class="el-icon-circle-close"
              style="fontSize: 20px; marginTop: 10px; color: #F56C6C"
              @click="remove(index)"
            />
            <span 
              v-if="item.add"
              class="el-icon-circle-plus-outline"
              style="fontSize: 20px; marginTop: 10px; color: #409EFF"
              @click="add"
            />
            </el-col>
          </el-row>
          <div class="explain">
            <p>1.  每个广告活动可以有多个投放、搜索词自动化标签或广告位自动化规则，选择模板后对应活动下均会新增一个自动化标签或广告位自动化规则。您可以批量设置多个模板新增多个自动化标签或广告位自动化规则，单次最多可添加10个。</p>
            <p>2. 同一个自动化模板，不可被重复应用到同个广告活动的同类型广告自动化规则下。</p>
            <p>3. 模板添加成功后，将在站点时间第二天00:00开始执行自动化操作或统计自动化标签，之后按执行频率定期执行。</p>
            <p>4. 您可以在任意时间调整规则或模板的运行状态。</p>
          </div>
        </div>
        <div v-if="batch === 'batchStatus'">
          <el-row>
            <el-col :span="10">
              <el-form-item 
                label="目标状态"
                prop="status"
              >
                <avue-select
                  v-model="formLabelAlign.status"
                  :clearable="false"
                  :dic="[{label: '运行中', value: 'runing'},{label: '已暂停', value: 'stop'}]"
                  placeholder="请选择"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="explain">
            <p>1. 您确认批量进行当前调整后，操作将会立即执行，但可能因为接口或网络原因有10分钟左右的延迟。</p>
            <p>2. 从暂停状态改为运行中，操作成功后，将在站点时间第二天00:00开始执行自动化操作或统计自动化标签，之后按执行频率定期执行。</p>
            <p>3. 暂停或归档成功后，立即停止自动化操作。暂停或归档自动化标签，立即停止统计自动化标签，若标签带有自动化操作，点击任意“确认”按钮后该操作即不执行。</p>
            <p>4. 您可以在任意时间调整状态，但请注意“已归档”状态不可以被调整。</p>
          </div>
        </div>
     </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button 
          size="mini" 
          @click="dialogVisible = false; $emit('change', false)"
        >取 消</el-button>
        <el-button 
          type="primary" 
          size="mini" 
          @click="saveBtn('form')"
        >确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  getAutomationList,
  batchStatus,
  batchTemplate
} from '@/api/ppc/autoAd';
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    batch: {
      type: String,
      default: 'batchTemplate'
    },
    tableSelected: {
      type: Array,
      default: new Array()
    },
    marketplace: {
      type: String,
      default: ''
    },
    getTableData: {
      type: Function
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      adType: '搜索词',
      templateList: [],
      formLabelAlign: {
        adType: '搜索词',
        status: 'runing',
        data: [{
          automationTemplateId: '',
          templateName: '',
          add: true
        }],
      }
    };
  },
  mounted() {
    if (this.batch === 'batchTemplate') {
      getAutomationList().then(res => {
        if (res.data.code === 200) {
          this.templateList = res.data.data.map(item => {
            return {
              label: item.templateName,
              value: item.id
            };
          });
          
          //默认选中第一个
          this.formLabelAlign.data[0].automationTemplateId = this.templateList[0].value;
        }
      });
    }
  },
  watch: {
    'formLabelAlign.data': {
      handler(val) {
        const templateId = [];
        val.forEach(item => {
          if (item.automationTemplateId) {
            templateId.push(item.automationTemplateId);
          }
          this.templateList && this.templateList.forEach(item => {
            if ([...templateId].includes(item.value)) {
              item.disabled = true;
            } else {
              item.disabled = false;
            }
          });
        });
      },
      deep: true
    }
  },
  methods: {
    // 默认选择第一个
    labelFilter(arr) {
      const arrs = arr.filter(item => !item.disabled);
      return arrs[0] && arrs[0].value || '';
    },
    selectName(value, index) {
      this.formLabelAlign.data[index].templateName = this.templateList.map(item => {
        if (item.value === value) {
          return item.label;
        }
      }).join('');
    },
    add() {
      this.$refs['form'].validate( valid => {
        if (this.formLabelAlign.data.length > 10) {
          this.$message({
            type: 'warning',
            message: '批量设置模板最多可以添加10个！'
          });
          return;
        }
        if (valid) {
          this.formLabelAlign.data.push({
            automationTemplateId: this.labelFilter(this.templateList),
            templateName: '',
            add: true
          });
          delete this.formLabelAlign.data[this.formLabelAlign.data.length - 2].add;
        } else {
          return false;
        }
      });
    },
    remove(index) {
      if (this.formLabelAlign.data.length === 1) {
        return;
      }
      this.formLabelAlign.data.splice(index, 1);
      this.formLabelAlign.data[this.formLabelAlign.data.length - 1].add = true;
    },
    saveBtn() {
      
      if (this.batch === 'batchStatus') {
        const params = {
          campaignIdList: this.tableSelected,
          status: this.formLabelAlign.status,
        };
        batchStatus(params).then(res => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '批量设置状态成功'
            });
            this.$emit('change', false);
            this.getTableData();
          }
        });
      } else {
        this.$refs['form'].validate( valid => {
          if (valid) {
            const params = {
              campaignIdList: this.tableSelected,
              batchTemplateList: this.formLabelAlign.data.map(item => {
                return {
                  automationTemplateId: item.automationTemplateId,
                  templateName: item.templateName
                };
              }),
              marketplace: this.marketplace
            };
            batchTemplate(params).then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: '批量设置模板成功'
                });
                this.$emit('change', false);
                this.getTableData();
              }
            });
          } else {
            return false;
          }
        });
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
  ::v-deep .el-input__icon {
    line-height: 30px;
  }
  .explain {
    margin-top: 20px;
      p {
          font-size: 12px;
          margin: 0;
      }
  }
  .title {
    text-align: start;
  }
</style>