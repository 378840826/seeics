<!-- 日期范围选择器 -->
<template>
  <el-date-picker
    v-model="value"
    type="daterange"
    value-format="yyyy-MM-dd"
    align="right"
    unlink-panels
    :clearable="false"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    @change="handleChange"
    :picker-options="options"
    size="mini"
    class="date_picker"
  />
</template>

<script>
import { getDateRangeForKey } from '@/util/date';

const options = {
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
  name: 'DatePicker',

  props: {
    defaultValue: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      options,
      value: this.defaultValue,
    };
  },

  methods: {
    // 点击搜索
    handleChange() {
      console.log('日期change', this.value );
      this.$emit('change', this.value);
    },
  },
};
</script>

<style scoped lang="scss">
.date_picker {
  width: 240px;
}
</style>
