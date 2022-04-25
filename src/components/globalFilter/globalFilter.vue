<template>
  <div class="filterBox" :style="{width: screenWidth/2 + 'px'}">
    <el-card class="box-card" shadow="never" >
      <div slot="header" class="clearfix">
          <span style="fontSize: 14px; fontWeight: 600; marginRight: 30px">子规则1</span>
        <span style="fontSize: 12px;">规则内指标之间关系为且</span>
        
        <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="remove">操作按钮</el-button> -->
      </div>
      <div>
          <el-row v-for="formInline in formInline" :key="formInline" class="row">
              <el-col class="col">
              <el-select v-model="formInline.label" @change="labelSelect(formInline.id)">
                <el-option v-for="item in fieldsPage" :key="item.label" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-select v-model="formInline.condition" class="condition" @change="select(condition, formInline.id)">
                <el-option v-for="item in condition" :key="item.label" :label="item.label" :value="item.label"/>
              </el-select>
              <span v-if="formInline.condition === '≥且<'" class="span">
                  <el-input v-model="formInline.minVal"/>
                  <el-input v-model="formInline.maxVal" style="marginRight: 0"/>
              </span>
              <span v-else-if="formInline.condition === '环比'" style="marginRight: 0">
                <el-select v-model="formInline.chain">
                  <el-option label="上升" value="上升"></el-option>
                  <el-option label="下降" value="下降"></el-option>
                </el-select>
                <el-select v-model="formInline.vlaueType" class="condition">
                  <el-option label="值" value="值"></el-option>
                  <el-option label="百分比" value="百分比"></el-option>
                </el-select>
                <span v-if="formInline.vlaueType === '百分比'">%</span>
                <span class="span"><el-input style="marginRight: 0"/></span>
              </span>
              <span v-else class="span"><el-input v-model="formInline.value" style="marginRight: 0"/></span>
              <div class="icon"><i class="el-icon-error" @click="deleteBtn(formInline.id)"></i></div>
              <el-button
                v-if="formInline.btn" 
                type="text" 
                :disabled="disabled"
                @click="addFiled(formInline.id)">添加</el-button>
            </el-col>
          </el-row>
      </div>
    </el-card>
    <div v-if="data.length" class="Or">或</div>
    <el-card v-for="item in data" :key="item.id" class="box-card" shadow="never" style="marginTop: 10px">
      <div slot="header" class="clearfix">
          <span style="fontSize: 14px; fontWeight: 600; marginRight: 30px">子规则{{item.key + 1}}</span>
        <span style="fontSize: 12px;">规则内指标之间关系为且</span>
        <el-button style="float: right; padding: 0 0" type="danger" @click="remove(item.key)" icon="el-icon-close"></el-button>
      </div>
      <el-row v-for="formInline in item.formInline" :key="formInline" class="row">
              <el-col class="col">
              <el-select v-model="formInline.label" @change="sonLabelSelect(item.id, formInline.id)">
                <el-option v-for="item in fieldsPage" :key="item.label" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-select v-model="formInline.condition" class="condition" @change="sonSleect(formInline.condition, formInline.id)">
                <el-option v-for="item in condition" :key="item.label" :label="item.label" :value="item.label"/>
              </el-select>
              <span v-if="formInline.condition === '≥且<'" class="span">
                  <el-input v-model="formInline.minVal"/>
                  <el-input v-model="formInline.maxVal" style="marginRight: 0"/>
              </span>
              <span v-else-if="formInline.condition === '环比'" style="marginRight: 0">
                <el-select v-model="formInline.chain">
                  <el-option label="上升" value="上升"></el-option>
                  <el-option label="下降" value="下降"></el-option>
                </el-select>
                <el-select v-model="formInline.vlaueType" class="condition">
                  <el-option label="值" value="值"></el-option>
                  <el-option label="百分比" value="百分比"></el-option>
                </el-select>
                <span v-if="formInline.vlaueType === '百分比'">%</span>
                <span class="span"><el-input style="marginRight: 0"/></span>
              </span>
              <span v-else class="span"><el-input v-model="formInline.value" style="marginRight: 0"/></span>
              <div class="icon"><i class="el-icon-error" @click="deleteBtn(formInline.id, item.id)"></i></div>
              <el-button
                v-if="formInline.btn" 
                type="text" 
                :disabled="item.disabled"
                @click="addFiled(formInline.id, item.id)">添加</el-button>
            </el-col>
        </el-row>
    </el-card>
    <el-button 
      style="width: 100%; margin: 10px 0" 
      @click="add" 
      type="primary" 
      size="mini"
      :disabled="addDisabled"
      >+添加子规则</el-button>
  </div>
</template>reset

<script>
import { filterField, emptySelect, resetValue, addFiled} from './util'
export default {
  name: 'globalFilter',
  props: {
    filterecho: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      data: [
        // {
        //   id: 1,
        //   key: 1,
        //   formInline: [
        //     {
        //       id: 55,
        //       label: 'search_result_page_no',
        //       condition: '>',
        //       chain: '上升',
        //       vlaueType: '值',
        //       value: '',
        //       maxVal: '',
        //       minVal: '',
        //     },
        //     {
        //       id: 66,
        //       label: 'search_result_page_no',
        //       condition: '>',
        //       chain: '上升',
        //       vlaueType: '值',
        //       value: '',
        //       maxVal: '',
        //       minVal: '',
        //     },
        //     {
        //       id: 77,
        //       label: 'search_result_page_no',
        //       condition: '>',
        //       chain: '上升',
        //       vlaueType: '值',
        //       value: '',
        //       maxVal: '',
        //       minVal: '',
        //       btn: true,
        //     }]
        // }
      ],
      formInline: [
        {
          id: 11,
          label: 'search_result_page_no',
          condition: '>',
          chain: '上升',
          vlaueType: '值',
          value: '',
          maxVal: '',
          minVal: '',
          btn: true,
        },
        // {
        //   id: 22,
        //   label: 'search_result_page_no',
        //   condition: '>',
        //   chain: '上升',
        //   vlaueType: '值',
        //   value: '',
        //   maxVal: '',
        //   minVal: '',
        // },
        // {
        //   id: 33,
        //   label: 'search_result_page_no',
        //   condition: '>',
        //   chain: '上升',
        //   vlaueType: '值',
        //   value: '',
        //   maxVal: '',
        //   minVal: '',
        //   btn: true,
        // },
      ],
      condition: [
        {
          label: '≥且<'
        },
        {
          label: '>'
        },
        {
          label: '≥'
        },
        {
          label: '<'
        },
        {
          label: '≤'
        },
        // {
        //   label: '环比'
        // },
      ],
      fields: [
        {
          label: 'ABA排名'
        },
        {
          label: '自然排名',
          value: 'search_result_page_no'
        },
        {
          label: '自然排名页码',
          value: 'search_result_page'
        },
        {
          label: '广告排名',
          value: 'advertise_result_page_no'
        },
        {
          label: '广告排名页码',
          value: 'advertise_result_page'
        },
        {
          label: '销售额'
        },
        {
          label: '订单量'
        },
        {
          label: 'Impressions'
        },
        {
          label: 'Clicks'
        },
        {
          label: 'CPC'
        },
        {
          label: 'CPA'
        },
        {
          label: 'Spend'
        },
        {
          label: 'CTR'
        },
        {
          label: 'ACoS'
        },
        {
          label: 'RoAS'
        },
        {
          label: '转化率'
        },
      ],
      totalFields: [],
      fieldsPage: [],
      disabled: true,
      addDisabled: true,
      screenWidth: document.body.clientWidth,
    };
  },
  mounted() {
    this.totalFields = Array.from(this.fields);
    this.fieldsPage = this.totalFields.splice(1, 4);
    console.log(this.filterecho)
    
  },
  updated() {
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    };
  },
  methods: {
    getFileld() {
      const obj = filterField(this.formInline);
      const res = [];
      if (Object.keys(obj).length !== 0) {
        res.push(obj);
      }
      this.data.map(item => {
        const arr = filterField(item.formInline);
        if (Object.keys(arr).length !== 0) {
          res.push(arr);
        }
      });
      return res;
    },
    labelSelect(id) {
      this.formInline = resetValue(this.formInline, id);
    },
    sonLabelSelect(dataId, id) {
      this.data[dataId - 1].formInline = resetValue(this.data[dataId - 1].formInline, id);
    },
    select(condition, id) {
      this.formInline = emptySelect(this.formInline, condition, id);
    },
    sonSleect(condition, id) {
      this.data.forEach(item => {
        item.formInline = emptySelect(item.formInline, condition, id);
      });
    },
    addFiled(id, dataId) {
      if (dataId) {
        const maxId = this.data[dataId - 1].formInline[this.data[dataId - 1].formInline.length - 1].id; //获取最后一位id
        if (this.data[dataId - 1].formInline.length < 4) {
          addFiled(this.data[dataId - 1].formInline, maxId);
        }
        return;
      }
      if (this.formInline.length < 4) {
        addFiled(this.formInline, id);
      }
    },
    deleteBtn(id, dataId) {
      if (dataId) {
        if (this.data[dataId - 1].formInline.length === 1) {
          return;
        }
        this.data[dataId - 1].formInline = this.data[dataId - 1].formInline.filter(item => item.id !== id);
        this.data[dataId - 1].formInline.forEach(item => {
          if (item.id > id) {
            item.id -= 11;
          }
        });
        Object.assign(this.data[dataId - 1].formInline[this.data[dataId - 1].formInline.length - 1], { btn: true });
        return;
      }
      if (this.formInline.length === 1) {
        return;
      }
      this.formInline = this.formInline.filter(item => item.id !== id);
      this.formInline.forEach(item => {
        if (item.id > id) {
          item.id -= 11;
        }
      });
      Object.assign(this.formInline[this.formInline.length - 1], { btn: true });
    },
    add() {
      const maxId = this.data.length && this.data[this.data.length - 1].formInline[this.data[this.data.length - 1].formInline.length - 1].id || 44;
      const arr = [];
      for (let i = 0; i < 1; i ++) {
        arr.push({
          id: maxId + 11,
          label: 'search_result_page_no',
          condition: '>',
          chain: '上升',
          vlaueType: '值',
          value: '',
          maxVal: '',
          minVal: '',
          btn: true
        });
      }
      const res = [];
      let num = maxId;
      for (let i = 0; i < arr.length; i ++) {
        res.push(num += 11);
      }
      if (this.data.length < 4) {
        this.data.push({
          id: this.data.length + 1,
          key: this.data.length + 1,
          formInline: arr
        });
      } else {
        this.$message({
          type: 'warning',
          message: '最多可以添加5个条件'
        });
      }
    },
    remove(key) {
      this.data = this.data.filter(item => item.key !== key);
      this.data.forEach(item => {
        if (item.key > key) {
          item.key -= 1;
          item.id -= 1;
        }
      });
    }
  },
  watch: {
    formInline: {
      handler(val) {
        if (val.length < 4) {
          const arr = [];
          for (let i = 0; i < val.length; i ++) {
            if (val[i].value || val[i].maxVal && val[i].minVal) {
              arr.push(val[i]);
            }
          }
          this.disabled = val.length > arr.length;
        } else {
          this.disabled = true;
          const idx = val.length - 1;
          if (val[idx].value || val[idx].maxVal && val[idx].minVal) {
              this.addDisabled = false
          }
        }
      },
      deep: true,
      immediate: true,
    },
    data: {
      handler(val) {
        this.data.forEach((item) => {
          const arr = [];
          if (item.formInline.length < 4) {
            this.addDisabled = true;
            for (let i = 0; i < item.formInline.length; i ++) {
              if (item.formInline[i].value || item.formInline[i].maxVal && item.formInline[i].minVal) {
                arr.push(item.formInline[i]);
              }
            }
            if (item.formInline.length === arr.length) {
              item.disabled = false;
            } else {
              item.disabled = true;
            }
          } else {
            item.disabled = true;
            if (item.formInline.length === 4) {
              this.addDisabled = true;
              for (const key in item.formInline[3]) {
                if (key === 'value' && item.formInline[3][key] || key === 'maxVal' && 'minVal' && item.formInline[3][key]) {
                  this.addDisabled = false;
                } 
              }
            }
          }
        });
        this.data;
      },
      deep: true,
      immediate: true,
    },
  }
};
</script>

<style lang="scss" scoped>
  .filterBox {
    .condition {
      ::v-deep .el-input__inner  {
        position: relative;
        font-size: 14px;
        display: inline-block;
        width: 80px;
        padding: 0 15px;
        height: 30px;
      }
    }
    .span {
      ::v-deep .el-input {
            position: relative;
            font-size: 14px;
            display: inline-block;
            width: 130px;
            margin-right: 10px;
        }
    }
    ::v-deep .el-input__inner  {
        position: relative;
        font-size: 14px;
        display: inline-block;
        width: 130px;
        padding: 0 15px;
        height: 30px;
    }
   ::v-deep .el-input__icon {
       line-height: 30px;
   }
   ::v-deep .el-select {
      margin-right: 10px;
    }
    .row {
      margin-top: 10px
    }
    .col {
      display: -webkit-inline-box
    }
   .icon {
      display: -webkit-inline-box;
      width: 16px;
      height: 30px;
      position: relative;
      .el-icon-error {
        font-size: 16px;
        color: red;
        position: absolute;
        left: -8px;
        top: 4px;
      }
    }
  }
  .box-card {
    width: 100%;
    background-color: #f2f2f2;
  }
  .Or {
    border: 1px #ccc solid;
    padding: 5px;
    border-radius: 10px;
    text-align: center;
    width: 50px;
    margin: 5px;
  }
</style>