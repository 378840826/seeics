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
              <el-select v-model="formInline.label" @change="labelSelect(formInline.id, formInline.label)">
                <el-option 
                  v-for="item in fieldsPage" 
                  :key="item.label" :label="item.label" 
                  :value="item.value"
                  :disabled="item.disabled"
                  ></el-option>
              </el-select>
              <el-select v-model="formInline.condition" class="condition" @change="select(condition, formInline.id)">
                <el-option v-for="item in condition" :key="item.label" :label="item.label" :value="item.value"/>
              </el-select>
              <span v-if="formInline.condition == '≥且<'" class="span">
                  <el-input v-model="formInline.minVal" min="1" type="number" placeholder="min"/>
                  <el-input v-model="formInline.maxVal" min="1" type="number" placeholder="max" style="marginRight: 0"/>
                  
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
                <span class="span"><el-input type="number" style="marginRight: 0"/></span>
              </span>
              <span v-else class="span"><el-input v-model="formInline.value" min="1" type="number" style="marginRight: 0"/></span>
              <div class="icon"><i class="el-icon-error" @click="deleteBtn(formInline.id)"></i></div>
              <el-button
                v-if="formInline.btn" 
                type="text" 
                :disabled="disabled"
                @click="addFiled(formInline.id)">添加</el-button>  
            </el-col>
            <div v-if="formInline.msg" class="message" :style="{width: screenWidth/4 + 'px'}">最大值必须大于最小值</div>
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
                <el-option 
                  v-for="item in item.fieldsPage" 
                  :key="item.label" :label="item.label" 
                  :value="item.value"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
              <el-select v-model="formInline.condition" class="condition" @change="sonSleect(formInline.condition, formInline.id)">
                <el-option v-for="item in condition" :key="item.label" :label="item.label" :value="item.value"/>
              </el-select>
              <span v-if="formInline.condition === '≥且<'" class="span">
                  <el-input v-model="formInline.minVal"  min="1" type="number"/>
                  <el-input v-model="formInline.maxVal"  min="1" type="number" style="marginRight: 0"/>
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
                <span class="span"><el-input  min="1" type="number" style="marginRight: 0"/></span>
              </span>
              <span v-else class="span"><el-input v-model="formInline.value"  min="1" type="number" style="marginRight: 0"/></span>
              <div class="icon"><i class="el-icon-error" @click="deleteBtn(formInline.id, item.id)"></i></div>
              <el-button
                v-if="formInline.btn" 
                type="text" 
                :disabled="item.disabled"
                @click="addFiled(formInline.id, item.id)">添加</el-button>
            </el-col>
            <div v-if="formInline.msg" class="message" :style="{width: screenWidth/4 + 'px'}">最大值必须大于最小值</div>
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
</template>

<script>
import { filterField, emptySelect, resetValue, addFiled} from './util';
import { fields } from './filed';
export default {
  name: 'globalFilter',
  props: {
    filterecho: {
      type: Array,
      default: []
    },
    fields: {
      type: String,
      default: 'tatolFileds'
    } ,
    
  },
  model: {
    prop: "value",
    event: "change"
  },
  data() {
    return {
      data: [],
      formInline: [
        {
          id: new Date().getTime(),
          label: 'search_result_page_no',
          condition: '&gt;',
          chain: '上升',
          vlaueType: '值',
          value: '',
          maxVal: '',
          minVal: '',
          btn: true,
        },
      ],
      condition: [
        {
          label: '≥且<',
          value: '≥且<',
        },
        {
          label: '>',
          value: '&gt;'
        },
        {
          label: '≥',
          value: '&gt;='
        },
        {
          label: '<',
          value: '&lt;'
        },
        {
          label: '≤',
          value: '&lt;='
        },
        // {
        //   label: '环比'
        // },
      ],
     
      totalFields: [],
      fieldsPage: JSON.parse(JSON.stringify(fields[this.fields])),
      disabled: true,
      addDisabled: true,
      screenWidth: document.body.clientWidth,
      ruleLen: 1, //规则1条件长度
    };
  },
  mounted() {
    //回显
    this.filterecho.length && this.filterecho[0].item.length && this.emptyFileld(this.filterecho);
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    };
    
  },
  updated() {

  },
  methods: {
    emptyFileld(empty) {
      this.formInline = empty[0].item.map(item => {
        let obj = {};
        obj = {
            id: item.id,
            label: item.subruleName,
            condition: item.symbol,
            value: item.value,
            maxVal: item.maximum,
            minVal: item.minimum
          }
        return obj;
      });
      this.formInline[this.formInline.length - 1].btn = true;
      empty.map((item, idx) => {
        if (idx !== 0) {
          this.data.push({
            id: idx,
            key: idx,
            ruleLen: idx,
            formInline: item.item.map(s => {
              let obj = {};
              obj = {
                id: s.id,
                label: s.subruleName,
                condition: s.symbol,
                value: s.value,
                maxVal: s.maximum,
                minVal: s.minimum
              }
              return obj
            }),
            fieldsPage: JSON.parse(JSON.stringify(fields[this.fields])),
          });
          this.data[idx - 1].formInline[this.data[idx - 1].formInline.length - 1].btn = true;
        }
      });
    },
    labelFilter(arr) {
      let arrs = arr.filter(item => !item.disabled)
      return arrs[0] && arrs[0].value || '';
    },
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

    labelSelect(id, val) {
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
        if (this.data[dataId - 1].formInline.length > this.data[dataId - 1].ruleLen ) {
          this.data[dataId - 1].ruleLen ++
          addFiled(this.data[dataId - 1].formInline, this.labelFilter(this.data[dataId - 1].fieldsPage));
        }
        
        return;
      }  
      if (this.fieldsPage.length > this.ruleLen) {
        this.ruleLen ++
        addFiled(this.formInline, this.labelFilter(this.fieldsPage));
      }
    },
    deleteBtn(id, dataId) {
      if (dataId) {
        if (this.data[dataId - 1].formInline.length === 1) {
          return;
        }
        this.data[dataId - 1].formInline = this.data[dataId - 1].formInline.filter(item => item.id !== id);
        Object.assign(this.data[dataId - 1].formInline[this.data[dataId - 1].formInline.length - 1], { btn: true });
        this.data[dataId - 1].ruleLen --
        return;
      }
      if (this.formInline.length === 1) {
        return;
      }
      this.ruleLen --
      this.formInline = this.formInline.filter(item => item.id !== id);
      Object.assign(this.formInline[this.formInline.length - 1], { btn: true });
    },
    add() {
      const arr = [];
      for (let i = 0; i < 1; i ++) {
        arr.push({
          id: new Date().getTime(),
          label: this.fieldsPage[0].value || '',
          condition: '&gt;',
          chain: '上升',
          vlaueType: '值',
          value: '',
          maxVal: '',
          minVal: '',
          btn: true
        });
      }
      if (this.data.length < 4) {
        this.data.push({
          id: this.data.length + 1,
          key: this.data.length + 1,
          ruleLen: 0,
          formInline: arr,
          fieldsPage: JSON.parse(JSON.stringify(fields[this.fields])),
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
        if (this.fieldsPage.length) {
          const arr = [];
          const arrs = [];
          for (let i = 0; i < val.length; i ++) {
            if (val[i].label) {
              arrs.push(val[i].label);
            }
            if (val[i].value && val[i].label || val[i].label && val[i].maxVal && val[i].minVal) {
              arr.push(val[i]);
              this.$emit("change", false);
              this.addDisabled = false;
            } else {
              this.$emit("change", true);
              this.addDisabled = true;
            }
            if (Number(val[i].minVal) > Number(val[i].maxVal)) {
              val[i].msg = true;
            } else {
              val[i].msg = false;
            }
          }
          this.disabled = this.fieldsPage.length === val.length ? this.fieldsPage.length === val.length : val.length > arr.length;
          this.addDisabled = val.length > arr.length;
          this.$emit("change", val.length > arr.length);
          this.fieldsPage.forEach(item => {
            if ([...arrs].includes(item.value)) {
              item.disabled = true;
            } else {
              item.disabled = false;
            }
          });
        } 
      },
      deep: true,
      immediate: true,
    },
    data: {
      handler(val) {
        this.data.forEach((item) => {
          const arr = [];
          const arrs = [];
          if (item.formInline.length) {
            this.addDisabled = true;
            for (let i = 0; i < item.formInline.length; i ++) {
              if (item.formInline[i].label) {
                arrs.push(item.formInline[i].label);
              }
              if (item.formInline[i].value && item.formInline[i].label || item.formInline[i].label && item.formInline[i].maxVal && item.formInline[i].minVal) {
                arr.push(item.formInline[i]);
                this.$emit("change", false);
                this.addDisabled = false;
              } else {
                this.$emit("change", true);
                this.addDisabled = true;
              }
               if (Number(item.formInline[i].minVal) > Number(item.formInline[i].maxVal)) {
                  item.formInline[i].msg = true;
                } else {
                  item.formInline[i].msg = false;
                }
            }
            if (item.formInline.length === arr.length) {
              item.disabled = false;
            } else {
              item.disabled = true;
            }
            if (item.formInline.length === this.fieldsPage.length) {
              item.disabled = true;
            }
            item.fieldsPage.forEach(item => {
              if ([...arrs].includes(item.value)) {
                item.disabled = true;
              } else {
                item.disabled = false;
              }
              return item;
            });
            this.$emit("change", item.formInline.length > arr.length);
            this.addDisabled = item.formInline.length > arr.length;
          }
        });
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
    .el-input::-webkit-outer-spin-button,
    .el-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    ::v-deep .el-input__icon {
      line-height: 30px;
    }
    ::v-deep .el-select {
      margin-right: 10px;
    }
    .row {
      // margin-top: 10px
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
  .message {
    max-width: 495px;
    color: red;
    text-align: end;
    font-size: 10px;
  }
</style>