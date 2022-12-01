<template>
  <div>
    <p style="display: flex;line-height: 20px;"><span class="msg">*</span>调价规则：</p>
    <el-collapse
        v-if="form.adjustmentFrequency !== '每天'"
        v-model="activeNames"
        @change="handleChange"
        style="borderTop: none; borderBottom: none">
         <el-collapse-item
            v-for="(item, index) in weekListFormat()"
            :key="item.week"
            :title="item.week"
            :name="item.week"
            class="ditto"
          >
            <el-button
              v-if="index"
              @click="handleDitto(item.week, index)"
              size="mini"
              type="primary"
              class="is-ditto">同上</el-button>
            <justment-tabel
              :ref="'table_' + index"
              :rowData="[]"
              :week="item.week"
              :timeSelect.sync="timeObj[item.week]"
            />
         </el-collapse-item>
      </el-collapse>

      <justment-tabel
        v-else
        ref="table_everyday"
        :timeSelect.sync="timeObj['每天']"
        :rowData="[]"
      />

      <div style="padding: 10px 0">
        <span>日期范围：</span>
        <el-date-picker
          v-model="form.startTime"
          style="width: 150px"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions"
          size="mini">
        </el-date-picker>
        <span style="margin: 0 6px;color: #d9d9d9;width: 12px;">—</span>
        <el-date-picker
          v-model="form.endTime"
          style="width: 150px"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions2"
          size="mini">
        </el-date-picker>
      </div>

      <timeSelection
        :timeSelect.sync="timeObj"
        :echoTimeSelect.sync="echoTimeSelect"
        :executionFrequency.sync="form.adjustmentFrequency"
      />
  </div>
</template>

<script>
import justmentTabel from '../../autoAd/componets/adjustmentTabel.vue';
import { weekList, stateDict } from '@/views/ppc/autoAd/dict';
import { formatS } from '@/views/ppc/autoAd/componets/timeSelection/ulit';
import timeSelection from '@/views/ppc/autoAd/componets/timeSelection/index.vue';

export default {
  components: { justmentTabel, timeSelection },
  
  props: {
    rowData: {
      type: Object,
      default: new Object
    },
    form: {
      type: Object,
      default: new Object
    },
    echo: {
      type: Object,
    }
  },
  
  data() {
    return {
      timeObj: {
        星期一: [],
        星期二: [],
        星期三: [],
        星期四: [],
        星期五: [],
        星期六: [],
        星期天: [],
        每天: [],
      },
    };
  },

  watch: {
    'form.adjustmentFrequency': {
      handler(val) {
        Object.keys(this.timeObj).forEach(item => {
          this.timeObj[item] = [];
        });
      },
      deep: true,
    }
  },

  mounted() {
    this.echo && this.echo.length && this.echoField();
   
  },

  methods: {
    formatS,
    weekListFormat() {
      if (this.form.adjustmentFrequency === '每周') {
        return weekList;
      } else if (this.form.adjustmentFrequency === '工作日') {
        return weekList.filter(item => item.type !== 'weekend');
      // eslint-disable-next-line no-else-return
      } else {
        return weekList.filter(item => item.type === 'weekend');
      }
    },
    
    handleDitto(val, idx) {

      const ditto = this.$refs[`table_${idx - 1}`][0].getField().map(item => {
        return {
          ...item,
          id: '',
        };
      });
      this.$refs[`table_${idx}`][0].ditto(ditto);
    },

    getField() {
      let params = [];
      if (this.form.adjustmentFrequency === '每天') {
        params = this.$refs['table_everyday'].getField();
      } else if (this.form.adjustmentFrequency === '每周') {
        params = [];
        for (let i = 0; i < 7; i ++) {
          params = params.concat(this.$refs[`table_${i}`][0].getField());
        }
      } else if (this.form.adjustmentFrequency === '工作日') {
        params = [];
        for (let i = 0; i < 5; i ++) {
          params = params.concat(this.$refs[`table_${i}`][0].getField());
        }
      } else if (this.form.adjustmentFrequency === '周末') {
        params = [];
        for (let i = 0; i < 2; i ++) {
          params = params.concat(this.$refs[`table_${i}`][0].getField());
        }
      }

      const msg = [];
      const map = new Map();
      const repetition = {};
      const repetitionMsg = new Map();

      params.map(item => {
        if (!item.timeLimit) {
          msg.push(true);
        } else if (item.timeLimit === '自定义时间范围' && (!item.startTime || !item.endTime)) {
          msg.push(true);
        } else if (!item.bidType || item.bidType === '固定竞价' && !item.bid) {
          msg.push(true);
        } else if (item.rule && (!item.adjustTheValue || !item.bidLimitValue)) {
          msg.push(true);
        }

        if (item.week) {
          map.set(item, item.week);
        } else {
          map.set(item, '每天');
        }
      });

      const extract = params.filter(item => { //列表其中没填完信息校验

        if (item.timeLimit || item.bidType || item.rule) {
          if (item.timeLimit === '自定义时间范围' && (!item.startTime || !item.endTime) || !item.bidType) {
            return item;
          } else if (item.bidType && (!item.startTime || !item.endTime)) {
            return item;
          } else if (item.bidType === '固定竞价' && !item.bid) {
            return item;
          } else if (item.rule && (!item.adjustTheValue || !item.bidLimitValue)) {
            return item;
          }
        }
      });

      for (const [key, val] of map) {

        if (val === '星期一') {
          const arr = formatS(key.startTime, key.endTime);
          arr.splice(arr.length - 1, arr[arr.length - 1] === '23:00' ? 0 : 1);
          repetition[val] = [...repetition[val] || '', ...arr];
        } else if (val === '星期二') {
          const arr = formatS(key.startTime, key.endTime);
          arr.splice(arr.length - 1, arr[arr.length - 1] === '23:00' ? 0 : 1);
          repetition[val] = [...repetition[val] || '', ...arr];
        } else if (val === '星期三') {
          const arr = formatS(key.startTime, key.endTime);
          arr.splice(arr.length - 1, arr[arr.length - 1] === '23:00' ? 0 : 1);
          repetition[val] = [...repetition[val] || '', ...arr];
        } else if (val === '星期四') {
          const arr = formatS(key.startTime, key.endTime);
          arr.splice(arr.length - 1, arr[arr.length - 1] === '23:00' ? 0 : 1);
          repetition[val] = [...repetition[val] || '', ...arr];
        } else if (val === '星期五') {
          const arr = formatS(key.startTime, key.endTime);
          arr.splice(arr.length - 1, arr[arr.length - 1] === '23:00' ? 0 : 1);
          repetition[val] = [...repetition[val] || '', ...arr];
        } else if (val === '星期六') {
          const arr = formatS(key.startTime, key.endTime);
          arr.splice(arr.length - 1, arr[arr.length - 1] === '23:00' ? 0 : 1);
          repetition[val] = [...repetition[val] || '', ...arr];
        } else if (val === '星期天') {
          const arr = formatS(key.startTime, key.endTime);
          arr.splice(arr.length - 1, arr[arr.length - 1] === '23:00' ? 0 : 1);
          repetition[val] = [...repetition[val] || '', ...arr];
        } else if (val === '每天') {
          const arr = formatS(key.startTime, key.endTime);
          arr.splice(arr.length - 1, arr[arr.length - 1] === '23:00' ? 0 : 1);
          repetition[val] = [...repetition[val] || '', ...arr];
        }
      }
      
      for (const key in repetition) {
        repetition[key].map(item => {
          if (repetitionMsg.has(`${item}${key}`)) {
            repetitionMsg.set(`${item}${key}`, repetitionMsg.get(`${item}${key}`) + 1);
          } else {
            repetitionMsg.set(`${item}${key}`, 1);
          }

        });
      }
      
      const res = [];
      for (const [key, val] of repetitionMsg) {
        if (val > 1) {
          res.push(key);
        }
      }

      if (res.length) {
        this.$message({
          type: 'error',
          message: '调价规则时间范围不能重叠'
        });
        return [];
      }

      if (extract.length) {
        this.$message({
          type: 'error',
          message: '请将规则条件填写完整'
        });
        return [];
      }

      if (msg.length === params.length) {
        this.$message({
          type: 'error',
          message: '调价规则至少填入一条'
        });
        return [];
      }

      return params;

    },

    echoField() {
      const week1 = [];
      const week2 = [];
      const week3 = [];
      const week4 = [];
      const week5 = [];
      const week6 = [];
      const week7 = [];
      const everyDay = [];
      this.echo.map(item => {
        if (item.week === '星期一') {
          week1.push(item);
        } else if (item.week === '星期二') {
          week2.push(item);
        } else if (item.week === '星期二') {
          week2.push(item);
        } else if (item.week === '星期三') {
          week3.push(item);
        } else if (item.week === '星期四') {
          week4.push(item);
        } else if (item.week === '星期五') {
          week5.push(item);
        } else if (item.week === '星期六') {
          week6.push(item);
        } else if (item.week === '星期天') {
          week7.push(item);
        } else {
          everyDay.push(item);
        }
      });
      
      if (this.form.adjustmentFrequency === '每天') {
        this.$refs['table_everyday'].echoField(everyDay);
      } else if (this.form.adjustmentFrequency === '每周') {
        this.$refs[`table_${0}`][0].echoField(week1);
        this.$refs[`table_${1}`][0].echoField(week2);
        this.$refs[`table_${2}`][0].echoField(week3);
        this.$refs[`table_${3}`][0].echoField(week4);
        this.$refs[`table_${4}`][0].echoField(week5);
        this.$refs[`table_${5}`][0].echoField(week6);
        this.$refs[`table_${6}`][0].echoField(week7);
      } else if (this.form.adjustmentFrequency === '工作日') {
        this.$refs[`table_${0}`][0].echoField(week1);
        this.$refs[`table_${1}`][0].echoField(week2);
        this.$refs[`table_${2}`][0].echoField(week3);
        this.$refs[`table_${3}`][0].echoField(week4);
        this.$refs[`table_${4}`][0].echoField(week5);
      } else if (this.form.adjustmentFrequency === '周末') {
        this.$refs[`table_${0}`][0].echoField(week6);
        this.$refs[`table_${1}`][0].echoField(week7);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .label-width {
    width: 250px;
  }

  .collapse {
    padding: 12px 0 0;
    height: 26px;
  }

  ::v-deep .el-collapse-item__header {
    width: 250px;
    background: rgba(51,153,255,.6);
    color: #fff;
    border: none;
    height: 26px;
    border-radius: 2px;
    margin-bottom: 10px;
    padding: 0px 0px 0px 10px;
  }

  ::v-deep .el-collapse-item__wrap {
    border: none;
  }

  .ditto {
    position: relative;
  }

  .is-ditto {
    position: absolute;
    top: 0;
    left: 270px;
  }

  .msg {
    color: #ff4d4f;
    font-size: 20px;
    // font-family: SimSun,sans-serif;
    content: "*";
    display: block;
    widows: 10px;
    padding-right: 4px;
  }
</style>
