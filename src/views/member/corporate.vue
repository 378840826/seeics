<template>
  <basic-container>
    <div>
      <el-select v-model="value" filterable placeholder="请输入企业会员账号">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

       <el-popover
            placement="bottom-start"  
            width="800"
            trigger="click">
            <div>
              <range-input
                v-for="item in filterList"
                :key="item.value"
                :label="item.label + '：'"
                :valueFilter="strToMoneyStr"
                v-model="form.filter[item.value]"
              />
              

            </div>
            <el-button slot="reference">高级筛选</el-button>
        </el-popover>

      <el-select v-model="form.status">
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <el-button>未支付</el-button>

      <el-date-picker
        v-model="form.dateRange"
        type="daterange"
        value-format="yyyy-MM-dd"
        align="right"
        unlink-panels
        :clearable="false"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="getTableData()"
        :picker-options="pickerOptions"
        size="min"
        class="date_picker"
      />
    </div>
  </basic-container>
</template>

<script>

import { getHeader } from '@/api/member/corporate';
import { getDateRangeForKey } from '@/util/date';
import RangeInput from '@/views/ppc/searchTerm/components/RangeInput.vue';
import { strToMoneyStr } from '@/util/numberString';

// 日期选择器配置
const pickerOptions = {
  // 限制可选日期为最近 60 天
  disabledDate: (time) => {
    const nowDate = (new Date()).getTime();
    const durationTime = 60 * 24 * 3600 * 1000;
    const twoMonths = nowDate - durationTime;
    return time.getTime() > Date.now() || time.getTime() < twoMonths;
  },
  // 快捷选项
  shortcuts: [
    {
      text: '今日',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey(1));
      }
    }, {
      text: '昨日',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey('yesterday'));
      }
    }, {
      text: '上周',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey('lastWeek'));
      }
    }, {
      text: '上月',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey('lastMonth'));
      }
    }, {
      text: '最近7天',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey(7));
      }
    }, {
      text: '最近30天',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey(30));
      }
    }, {
      text: '最近60天',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey(60));
      }
    },
  ],
};

export default {
  name: 'corporate',
  components: {
    RangeInput
  },
  data() {
    return {
      pickerOptions,
      form: {
        status: '状态',
        dateRange: getDateRangeForKey(30),
        filter: {
          levelPrice: { min: '', max: '' }
        }
      },
      options: [],
      filterList: [
        {
          label: '购买价格',
          value: 'levelPrice'
        }
      ],
      statusList: [
        {
          label: '有效',
          value: '有效'
        },
        {
          label: '状态',
          value: '状态'
        },
        {
          label: '失效',
          value: '失效'
        },
        {
          label: '不限',
          value: '不限'
        },
      ]
    };
  },

  mounted() {
    getHeader().then(res => {
      res.data.map(item => {
        this.form.filter = {
          ...this.form.filter,
          [item.functionVarName]: { min: '', max: '' }
        };
        this.filterList.push({
          value: item.functionVarName,
          label: item.functionName
        });
      });
    });
  },

  watch: {
    form: {
      handler(val) {
        console.log(val);
      },
      deep: true
    }
  },

  methods: {
    strToMoneyStr,
  }
};
</script>

<style lang="scss" scoped>

</style>
