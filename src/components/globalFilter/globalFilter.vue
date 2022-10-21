<template>
  <div class="filterBox" style="width: 100%">
    <el-card class="box-card" shadow="never" >
      <div slot="header" class="clearfix">
        <span style="fontSize: 14px; fontWeight: 600; marginRight: 30px">子规则1</span>
        <span style="fontSize: 12px;">规则内指标之间关系为且</span>
      </div>
      <div>
          <div v-if="dateSelect">
            过去
            <el-select 
              class="condition"
              style="marginLeft: 10px"
              v-model="dayVal"
            >
             <el-option v-for="item in day" :key="item.value" :value="item.value" :label="item.value"/>
            </el-select>天的
            <el-select 
              class="condition" 
              style="marginLeft: 10px"
              v-model='dailyVal'
            >
              <el-option v-for="item in daily" :key="item.label" :value="item.label" :label="item.label"/>
            </el-select>
          </div>
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
                  <el-input 
                    v-model="formInline.minVal" 
                    min="1" 
                    type="number" 
                    placeholder="min"
                  >
                    <span v-if="formInline.percentage" slot="append">%</span>
                  </el-input>
                  <el-input 
                    v-model="formInline.maxVal" 
                    min="1" 
                    type="number" 
                    placeholder="max" 
                    style="marginRight: 0"
                  >
                    <span v-if="formInline.percentage" slot="append">%</span>
                  </el-input>
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
              <span v-else class="span">
                <el-input 
                  v-model="formInline.value" 
                  min="1" 
                  type="number" 
                  style="marginRight: 0"
                >
                  <span v-if="formInline.percentage" slot="append">%</span>
                </el-input>
              </span>
              <div class="icon">
                <i class="el-icon-error" @click="deleteBtn(formInline.id)"></i>
              </div>
              <el-button
                v-if="formInline.btn" 
                type="text" 
                :disabled="disabled"
                @click="addFiled(formInline.id)">添加</el-button>  
            </el-col>
            <div v-if="formInline.msg" class="message" :style="{width: screenWidth/4 + 'px'}">最大值必须大于最小值</div>
            <div v-else-if="formInline.integer" class="integer" :style="{width: screenWidth/4 + 'px'}">请输入正整数</div>
            <div v-else-if="formInline.reg" class="integer" :style="{width: screenWidth/4 + 'px'}">只支持两位小数</div>
          </el-row>
      </div>
    </el-card>
    <div  v-for="item in data" :key="item.id">

      <div class="ruleOr">
        <el-select v-model="item.relation">
          <el-option value="且" style="padding: 0 20px">且</el-option>
          <el-option value="或" style="padding: 0 20px">或</el-option>
        </el-select>
      </div>

      <!-- <div v-else class="Or">或</div> -->

      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
            <span style="fontSize: 14px; fontWeight: 600; marginRight: 30px">子规则{{item.key + 1}}</span>
          <span style="fontSize: 12px;">规则内指标之间关系为且</span>
          <el-button 
            style="float: right; padding: 0 0" 
            type="danger" 
            @click="remove(item.key)" 
            icon="el-icon-close"
          ></el-button>
        </div>
        <div v-if="dateSelect">
            过去
            <el-select 
              class="condition"
              style="marginLeft: 10px"
              v-model="item.days"
            >
             <el-option v-for="item in day" :key="item.value" :value="item.value" :label="item.value"/>
            </el-select>天的
            <el-select 
              class="condition" 
              style="marginLeft: 10px"
              v-model='item.calculation'
            >
              <el-option v-for="item in daily" :key="item.label" :value="item.label" :label="item.label"/>
            </el-select>
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
                <el-select 
                  v-model="formInline.condition" 
                  class="condition" 
                  @change="sonSleect(formInline.condition, formInline.id)"
                >
                  <el-option v-for="item in condition" :key="item.label" :label="item.label" :value="item.value"/>
                </el-select>
                <span v-if="formInline.condition === '≥且<'" class="span">
                    <el-input 
                      v-model="formInline.minVal"  
                      min="1" 
                      type="number"
                    >
                      <span v-if="formInline.percentage" slot="append">%</span>
                    </el-input>
                    <el-input 
                      v-model="formInline.maxVal"  
                      min="1" 
                      type="number" 
                      style="marginRight: 0"
                    >
                      <span v-if="formInline.percentage" slot="append">%</span>
                    </el-input>
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
                <span v-else class="span">
                  <el-input 
                    v-model="formInline.value" 
                    min="1" 
                    type="number" 
                    style="marginRight: 0"
                  >
                    <span v-if="formInline.percentage" slot="append">%</span>
                  </el-input>
                </span>
                <div class="icon">
                  <i class="el-icon-error" @click="deleteBtn(formInline.id, item.id)"></i>
                </div>
                <el-button
                  v-if="formInline.btn" 
                  type="text" 
                  :disabled="item.disabled"
                  @click="addFiled(formInline.id, item.id)">添加</el-button>
              </el-col>
              <div v-if="formInline.msg" class="message" :style="{width: screenWidth/4 + 'px'}">最大值必须大于最小值</div>
              <div v-else-if="formInline.integer" class="integer" :style="{width: screenWidth/4 + 'px'}">请输入正整数</div>
              <div v-else-if="formInline.reg" class="integer" :style="{width: screenWidth/4 + 'px'}">只支持两位小数</div>
          </el-row>
      </el-card>
    </div>
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
import { filterField, emptySelect, resetValue, addFiled, integer } from './util';
import { fields } from './filed';
export default {
  name: 'globalFilter',
  props: {
    filterecho: { //字段回显
      type: Array,
      default: []
    },
    fields: {
      type: String,
      default: 'tatolFileds'
    },
    dateSelect: { //过去天数下拉框 
      type: Boolean,
      default: false
    }
  },
  model: { //双向绑定提交按钮是否禁用
    prop: 'value',
    event: 'change'
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
      fieldsPage: JSON.parse(JSON.stringify(fields[this.fields])),
      disabled: true,
      addDisabled: true,
      screenWidth: document.body.clientWidth,
      ruleLen: 1, //规则1条件长度
      integerList: [], //非整数存放
      percentageList: [], //百分比后缀存放
      dayVal: '7',
      dailyVal: '总计',
      day: [
        {
          value: '7'
        },
        {
          value: '14'
        },
        {
          value: '21'
        },
        {
          value: '30'
        },
        {
          value: '60'
        },
        {
          value: '90'
        },
      ],
      daily: [
        {
          label: '总计'
        },
        {
          label: '日均'
        }
      ]
    };
  },
  created() {
    this.integerList = fields[this.fields].map(item => {
      if (!item.integer) {
        return item.value;
      }
    }).filter(Boolean);
    this.percentageList = fields[this.fields].map(item => {
      if (item.percentage) {
        return item.value;
      }
    }).filter(Boolean);
  },
  mounted() {
    this.formInline[0].label = this.fields === 'launchFileds' ? 'ad_sales' : 'search_result_page_no';
    //回显
    this.filterecho.length && this.filterecho[0].item.length < 1 && this.$emit('change', true);
    this.filterecho.length && this.filterecho[0].item.length 
      ? this.echoFileld(this.filterecho) 
      : this.addDisabled = true;
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    };
  },
  methods: {
    echoFileld(echo) {
      this.dayVal = this.dateSelect && echo[0].days;
      this.dailyVal = this.dateSelect && echo[0].calculation;
      this.formInline = echo[0].item.map(item => {
        let obj = {};
        obj = {
          id: item.id,
          label: item.subruleName,
          condition: item.symbol,
          value: item.value,
          maxVal: item.maximum,
          minVal: item.minimum
        };
        return obj;
      });
      this.formInline[this.formInline.length - 1].btn = true;
      echo.map((item, idx) => {
        if (idx !== 0) {
          this.data.push({
            id: idx,
            key: idx,
            days: this.dateSelect && item.days,
            calculation: this.dateSelect && item.calculation,
            ruleLen: 0,
            relation: item.relation,
            formInline: item.item.map(s => {
              let obj = {};
              obj = {
                id: s.id,
                label: s.subruleName,
                condition: s.symbol,
                value: s.value,
                maxVal: s.maximum,
                minVal: s.minimum
              };
              return obj;
            }),
            fieldsPage: JSON.parse(JSON.stringify(fields[this.fields])),
          });
          this.data[idx - 1].formInline[this.data[idx - 1].formInline.length - 1].btn = true;
        }
      });
    },
    // 默认选中非禁用字段
    labelFilter(arr) {
      const arrs = arr.filter(item => !item.disabled);
      return arrs[0] && arrs[0].value || '';
    },
    //获取字段结构函数
    getFiled() {
      const obj = filterField(this.formInline, this.dateSelect ? { days: this.dayVal, calculation: this.dailyVal, relation: '' } : null);
      const res = [];
      if (Object.keys(obj).length !== 0) {
        res.push(obj);
      }
      this.data.map(item => {
        const arr = filterField(item.formInline, this.dateSelect && { days: item.days, calculation: item.calculation, relation: item.relation } || { relation: item.relation });
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
          this.data[dataId - 1].ruleLen ++;
          addFiled(this.data[dataId - 1].formInline, this.labelFilter(this.data[dataId - 1].fieldsPage));
        }
        
        return;
      }  
      if (this.fieldsPage.length > this.ruleLen) {
        this.ruleLen ++;
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
        this.data[dataId - 1].ruleLen --;
        return;
      }
      if (this.formInline.length === 1) {
        return;
      }
      this.ruleLen --;
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
          days: '7',
          calculation: '总计',
          relation: '且'
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
            // 空值校验
            if (val[i].value && val[i].label || val[i].label && val[i].maxVal && val[i].minVal) {
              arr.push(val[i]);
              this.$emit('change', false);
              this.addDisabled = false;
            } else {
              this.$emit('change', true);
              this.addDisabled = true;
            }
            // 大小校验
            if (Number(val[i].minVal) > Number(val[i].maxVal)) {
              this.$emit('change', true);
              this.addDisabled = true;
              this.disabled = true;
              val[i].msg = true;
            } else {
              this.$emit('change', false);
              this.addDisabled = false;
              this.disabled = false;
              val[i].msg = false;
              val[i].integer = false;
            }
            // 正整数判断
            if (!this.integerList.includes(val[i].label) && (Number(val[i].minVal) < 0 
              || integer(val[i].minVal) 
              || Number(val[i].maxVal) < 0 
              || integer(val[i].maxVal) 
              || Number(val[i].value) < 0 
              || integer(val[i].value))) {
              this.$emit('change', true);
              this.addDisabled = true;
              this.disabled = true;
              val[i].integer = true;
            } else {
              //判断小数点后面两位数
              const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/;
              if (!reg.test(Number(val[i].value))
                || !reg.test(Number(val[i].minVal))
                || !reg.test(Number(val[i].maxVal))
              ) {
                val[i].reg = true;
              } else {
                val[i].reg = false;
              }
            }
            //遍历数据添加百分比标识
            val[i].percentage = this.percentageList.includes(val[i].label);
          }
          this.disabled = this.fieldsPage.length === val.length ? this.fieldsPage.length === val.length : val.length > arr.length;
          this.$emit('change', val.length > arr.length);
          this.addDisabled = val.length > arr.length;
          if (val.filter(item => item.msg).length) {
            this.$emit('change', true);
            this.addDisabled = true;
            this.disabled = true;
          } else if (val.filter(item => item.integer).length) {
            this.$emit('change', true);
            this.addDisabled = true;
            this.disabled = true;
          } else if (val.filter(item => item.reg).length) {
            this.$emit('change', true);
            this.addDisabled = true;
            this.disabled = true;
          }
          // 选中过的字段禁用
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
        const res = [];
        this.data.forEach((item) => {
          const arr = [];
          const arrs = [];
          if (item.formInline.length) {
            // this.addDisabled = true;
            for (let i = 0; i < item.formInline.length; i ++) {
              if (item.formInline[i].label) {
                arrs.push(item.formInline[i].label);
              }
              // 空值校验
              if (item.formInline[i].value && item.formInline[i].label || item.formInline[i].label && item.formInline[i].maxVal && item.formInline[i].minVal) {
                arr.push(item.formInline[i]);
                this.$emit('change', false);
                this.addDisabled = false;
              } else {
                this.$emit('change', true);
                this.addDisabled = true;
              }
              // 大小校验
              if (Number(item.formInline[i].minVal) > Number(item.formInline[i].maxVal)) {
                this.$emit('change', false);
                item.formInline[i].msg = true;
                this.addDisabled = true;
                return res.push(true);
                // eslint-disable-next-line no-else-return
              } else {
                this.$emit('change', true);
                item.formInline[i].msg = false;
                item.formInline[i].integer = false;
                this.addDisabled = false;
              }
              // 正整数判断
              if (!this.integerList.includes(item.formInline[i].label) && (Number(item.formInline[i].minVal) < 0 
                || integer(item.formInline[i].minVal) 
                || Number(item.formInline[i].maxVal) < 0 
                || integer(item.formInline[i].maxVal)  
                || Number(item.formInline[i].value) < 0 
                || integer(item.formInline[i].value)) ) {
                this.$emit('change', false);
                item.formInline[i].integer = true;
                item.disabled = true;
                this.addDisabled = true;
                return res.push(true);
                // eslint-disable-next-line no-else-return
              } else {
                //判断小数点后面两位数
                const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/;
                if (!reg.test(Number(item.formInline[i].value))
                  || !reg.test(Number(item.formInline[i].minVal))
                  || !reg.test(Number(item.formInline[i].maxVal))
                ) {
                  item.formInline[i].reg = true;
                  item.disabled = true;
                  return res.push(true);
                  // eslint-disable-next-line no-else-return
                } else {
                  item.formInline[i].reg = false;
                  item.disabled = true;
                }
              }
              //遍历数据添加百分比标识
              item.formInline[i].percentage = this.percentageList.includes(item.formInline[i].label);
            }
            if (item.formInline.length === arr.length) {
              this.$emit('change', false);
              item.disabled = false;
            } else {
              this.$emit('change', true);
              item.disabled = true;
            }
            if (item.formInline.length === this.fieldsPage.length) {
              item.disabled = true;
            }
            // 选中过的字段禁用
            item.fieldsPage.forEach(item => {
              if ([...arrs].includes(item.value)) {
                item.disabled = true;
              } else {
                item.disabled = false;
              }
              return item;
            });
            
            res.push(item.formInline.length > arr.length);
          }
        });
        this.$emit('change', res.filter(item => item)[0]);
        this.addDisabled = res.filter(item => item)[0];
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
            // display: inline-block;
            width: 130px;
            margin-right: 10px;
        }
       ::v-deep .el-input-group__append, .el-input-group__prepend {
          padding: 0 0
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

    .ruleOr {
      margin: 5px 0;
      ::v-deep .el-input__inner  {
        position: relative;
        font-size: 14px;
        display: inline-block;
        width: 70px;
        padding: 0 15px;
        height: 30px;  
      }
    }
  }
  .box-card {
    width: 100%;
    background-color: #f2f2f2;
  }
  .Or {
    border: 1px #ccc solid;
    padding: 0;
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
  .integer {
    max-width: 305px;
    color: red;
    text-align: end;
    font-size: 10px;
  }
</style>