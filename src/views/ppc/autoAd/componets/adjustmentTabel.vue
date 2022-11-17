<template>
  <div>
    <el-table
      :data="data"
      border
      :header-cell-style="headerStyle"
    >
      <el-table-column
        prop="timeScope"
        :render-header="timeScope"
      >
        <template slot-scope="scope">
          <el-select
            v-if="scope.row.timeLimit !== '自定义时间范围'"
            :ref="'timeLimit_' + scope.$index"
            v-model="scope.row.timeLimit"
            @change="handleTimeScope($event, scope.$index)"
            size="mini">
            <el-option
              v-for="(key, idx) in timeScopeList"
              :key="key"
              :label="key"
              :value="key"
            />
          </el-select>

          <div v-else-if="scope.row.timeLimit === '自定义时间范围'">
            <el-select
              :ref="'startTime_' + scope.$index"
              v-model="scope.row.startTime"
              size="mini"
              class="selects"
            >
              <el-option
                v-for="(key, idx) in timeList"
                :key="key"
                :label="key"
                :value="key"
                
              />
            </el-select>

            <el-select
              :ref="'endTime_' + scope.$index"
              v-model="scope.row.endTime"
              size="mini"
              class="selects right"
            >
              <el-option
                v-for="(key, idx) in timeList"
                :key="key"
                :label="key"
                :value="key"
                :disabled="Number(scope.row.startTime.split(':').filter(Boolean).length 
                  && scope.row.startTime.split(':')[0] || 0)
                  >= Number(key.split(':').filter(Boolean).length && key.split(':')[0] || 0)"
              />
            </el-select>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="竞价调整"
      >
        <template slot-scope="scope">
          <el-select
            :ref="'bidType_' + scope.$index"
            v-model="scope.row.bidType"
            @change="handleAdjust($event, scope.$index)"
            class="selects"
            size="mini"
          >
            <el-option
              v-for="item in bidAdjustList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>

          <el-select
            v-if="scope.row.bidType !== '固定竞价' && scope.row.bidType !== '广告组默认竞价' && scope.row.bidType"
            v-model="scope.row.rule"
            @change="handleRule(scope.$index)"
            class="selects right"
            size="mini"
          >
            <el-option
              v-for="item in flaotList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <span v-else class="selects right">--</span>
        </template>
      </el-table-column>

      <el-table-column
        label="竞价策略"
      >
        <template slot-scope="scope">

          <div v-if="scope.row.rule">
            <el-input
              :ref="'adjustTheValue_' + scope.$index"
              v-model="scope.row.adjustTheValue"
              @blur="numberChange($event, 'adjustTheValue', scope.$index)"
              placeholder="调整数值"
              class="selects"
              size="mini"
            >
              <div
                slot="prefix"
                @click="focus('input_adjustTheValue' + scope.$index)"
                style="lineHeight: 30px;">{{'$'}}
              </div>
            </el-input>

            <el-input
              :ref="'bidLimitValue_' + scope.$index"
              v-model="scope.row.bidLimitValue"
              @blur="numberChange($event, 'bidLimitValue', scope.$index)"
              :placeholder="placeholderFormat(scope.row.rule)"
              class="selects right"
              size="mini"
            >
              <div
                slot="prefix"
                @click="focus('input_bidLimitValue' + scope.$index)"
                style="lineHeight: 30px;">{{'$'}}
              </div>
            </el-input>
          </div>

          <el-input
            v-else-if="scope.row.bidType === '固定竞价'"
            v-model="scope.row.bid"
            :ref="'bid_' + scope.$index"
            @blur="numberChange($event, 'bid', scope.$index)"
            placeholder="请输入固定竞价"
            class="selects"
            size="mini"
          >
            <div
              slot="prefix"
              @click="focus('input_bid' + scope.$index)"
              style="lineHeight: 30px;">{{'$'}}
            </div>
          </el-input>

          <span v-else-if="scope.row.bidType === '广告组默认竞价' || !scope.row.rule">无需选择竞价</span>

        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="60"
      >
        <template slot-scope="scope">

          <span
            v-if="data.length > 1"
            @click="handleDelete(scope.$index)"
            class="el-icon-close"
            style="marginRight: 10px"
          />

          <span
            v-if="scope.row.add"
            @click="handleAdd(scope.$index, scope.row.addDisabled)"
            
            class="el-icon-circle-plus-outline"
            :style="{color: scope.row.addDisabled ? '#C0C4CC' : '#39f', cursor: scope.row.addDisabled ? 'not-allowed' : 'default'}"
          />

        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import { timeList, timeScopeList, bidAdjustList, flaotList } from '../dict';
export default {

  props: {
    rowData: {
      type: Object,
      default: new Object
    },
    echoField: {
      type: Array,
    },
    week: {
      type: String,
      require: true
    },
  },
  
  data() {
    return {
      timeList,
      bidAdjustList,
      flaotList,
      timeScopeList: ['自定义时间范围', ...timeScopeList],
      headerStyle: {
        color: '#232f3f',
        fontSize: '12px',
        backgroundColor: '#fafafa',
      },
      data: [
        {
          startTime: '',
          endTime: '',
          timeLimit: '',
          rule: '',
          adjustTheValue: '',
          bidLimitValue: '',
          currency: '',
          bid: '',
          bidType: '',
          add: true,
          week: this.week,
          addDisabled: true,
        }
      ],
      value: ''
    };
  },

  watch: {
    data: {
      handler(val) {
        const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/;
        val.forEach((item, idx) => {
          console.log(item)
          if (item.bidType === '固定竞价' && !item.bid
              || !item.bidType
              || item.rule === '上浮(%)' && (!item.bidLimitValue || !item.adjustTheValue)
              || item.rule === '下调(%)' && (!item.bidLimitValue || !item.adjustTheValue)
              || item.rule === '下调(绝对值)' && (!item.bidLimitValue || !item.adjustTheValue)
              || item.rule === '上浮(绝对值)' && (!item.bidLimitValue || !item.adjustTheValue)
              || item.timeLimit === '自定义时间范围' && (!item.startTime || !item.endTime)
          ) {
            item.addDisabled = true;
          } else {
            // item.addDisabled = false;
            if (!reg.test(Number(item.bid))
              || !reg.test(Number(item.bidLimitValue))
              || !reg.test(Number(item.adjustTheValue))) {

              item.addDisabled = true;
            
            } else {
              
              item.addDisabled = false;
            }
          }
          // 空值高亮
          if (item.timeLimit && item.timeLimit !== '自定义时间范围') {
            this.$refs[`timeLimit_${idx}`].$children[0].$refs.input.style.borderColor = ''
          } 
          if (item.timeLimit === '自定义时间范围' && item.startTime) {
            this.$refs[`startTime_${idx}`].$children[0].$refs.input.style.borderColor = ''
          }
          if (item.timeLimit === '自定义时间范围' && item.endTime) {
            this.$refs[`endTime_${idx}`].$children[0].$refs.input.style.borderColor = ''
          }
          if (item.bidType) {
            this.$refs[`bidType_${idx}`].$children[0].$refs.input.style.borderColor = ''
          }
          if (item.bidType === '固定竞价' && item.bid) {
            console.log(this.$refs[`bid_${idx}`])
            this.$refs[`bid_${idx}`].$refs.input.style.borderColor = ''
          }
          if (item.rule && item.adjustTheValue) {
            this.$refs[`adjustTheValue_${idx}`].$refs.input.style.borderColor = ''
          }
          if (item.rule && item.bidLimitValue) {
            this.$refs[`bidLimitValue_${idx}`].$refs.input.style.borderColor = ''
          }
        });
      },
      deep: true
    }
  },

  mounted() {
    console.log(this.data)
  },

  methods: {
    timeScope() {
      return <div><span style="padding: 1px 3px;font-weight: 600;background: rgba(51,153,255,.2);border-radius: 1px;">站点当地时间</span>范围</div>;
    },

    handleTimeScope(val, index) {
      if (val !== '自定义时间范围') {
        this.data[index].startTime = this.data[index].timeLimit.split('，')[1].split('-')[0].trim();
        this.data[index].endTime = this.data[index].timeLimit.split('，')[1].split('-')[1].trim();
      } else {
        this.data[index].startTime = '';
        this.data[index].endTime = '';
      }
    },

    placeholderFormat(val) {
      if (!val) {
        return '';
      } else if (val === '上浮(%)' || val === '上浮(绝对值)') {
        return '竞价最大值';
      } else if (val === '下调(%)' || val === '下调(绝对值)') {
        return '竞价最小值';
      }
    },

    handleAdjust(val, idx) {
      this.data[idx].rule = '';
      this.data[idx].bid = '';
      this.data[idx].adjustTheValue = '';
      this.data[idx].bidLimitValue = '';
    },

    handleRule(idx) {
      this.data[idx].bid = '';
      this.data[idx].adjustTheValue = '';
      this.data[idx].bidLimitValue = '';
    },

    focus(name) {
      this.$refs[name].focus();
    },

    numberChange (val, name, index) { // name字段名，index索引
      // 校验正数，带两位小数
      const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      val.target.style.borderColor = '';
      // this.$emit('change', false);
      if (isNaN(val.target.value)) { 
        val.target.value = parseFloat(val.target.value) ;
      } 
      // 修改超出两位小数值
      if (val.target.value.indexOf('.') > 0){
        val.target.value = val.target.value.slice(0, val.target.value.indexOf('.') + 3);
        this.data[index][name] = val.target.value;
      }
      if (this.rowData.marketplace === 'JP') { //日本站
        if (val.target.value > 100000) {
          val.target.style.borderColor = 'red';
          this.$message({
            type: 'error',
            message: '值不能超过100000'
          });
          val.target.value = '';
          // this.$emit('change', true);
        } else if (name === 'adjustTheValue' && Number(val.target.value) <= 0) {
          val.target.style.borderColor = 'red';
          this.$message({
            type: 'error',
            message: `值不能低于0`
          });
          val.target.value = '';
        } else if (name !== 'adjustTheValue' && val.target.value < 2) {
          val.target.style.borderColor = 'red';
          this.$message({
            type: 'error',
            message: `值不能低于2`
          });
          val.target.value = '';
        }
      } else {
        if (val.target.value > 1000) {
          val.target.style.borderColor = 'red';
          this.$message({
            type: 'error',
            message: '值不能超过1000'
          });
          val.target.value = '';
          // this.$emit('change', true);
        } else if (name === 'adjustTheValue' && Number(val.target.value) <= 0) {
          val.target.style.borderColor = 'red';
          this.$message({
            type: 'error',
            message: `值不能低于0`
          });
          val.target.value = '';
        } else if (name !== 'adjustTheValue' && val.target.value < 0.02) {
          val.target.style.borderColor = 'red';
          this.$message({
            type: 'error',
            message: `值不能低于0.02`
          });
          val.target.value = '';
        }
      }
      if (!reg.test(val.target.value)) {
        val.target.value = '';
        this.data[index][name] = '';
      }
    },

    handleAdd(idx, flag) {
      if (flag) {
        console.log(666)
        return;
      }
      if (this.data.length <= 24) {
        this.data.push(
          {
            startTime: '',
            endTime: '',
            timeLimit: '',
            rule: '',
            adjustTheValue: '',
            bidLimitValue: '',
            currency: '',
            bid: '',
            bidType: '',
            week: this.week,
            add: true,
            addDisabled: false,
          }
        );
        this.data[this.data.length - 2].add = false;

      }
    },

    handleDelete(idx) {
      this.data.splice(idx, 1);
      this.data[this.data.length - 1].add = true;
    },

    getField() {
      // 空值高亮
      this.data.map((item, idx) => {
        if (!item.timeLimit) {
          this.$refs[`timeLimit_${idx}`].$children[0].$refs.input.style.borderColor = 'red'
        } 
        if (item.timeLimit === '自定义时间范围' && !item.startTime) {
          this.$refs[`startTime_${idx}`].$children[0].$refs.input.style.borderColor = 'red'
        }
        if (item.timeLimit === '自定义时间范围' && !item.endTime) {
          this.$refs[`endTime_${idx}`].$children[0].$refs.input.style.borderColor = 'red'
        }
        if (!item.bidType) {
          this.$refs[`bidType_${idx}`].$children[0].$refs.input.style.borderColor = 'red'
        }
        if (item.bidType === '固定竞价' && !item.bid) {
          console.log(this.$refs[`bid_${idx}`])
          this.$refs[`bid_${idx}`].$refs.input.style.borderColor = 'red'
        }
        if (item.rule && !item.adjustTheValue) {
          this.$refs[`adjustTheValue_${idx}`].$refs.input.style.borderColor = 'red'
        }
        if (item.rule && !item.bidLimitValue) {
          this.$refs[`bidLimitValue_${idx}`].$refs.input.style.borderColor = 'red'
        }
      })
      
      return this.data;
    },

    ditto(val) {
      this.data = val.map(item => {
        return {
          ...item,
          week: this.week,
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  .selects {
    width: 140px;

    &.right {
      margin-left: 10px;
    }
  }
</style>