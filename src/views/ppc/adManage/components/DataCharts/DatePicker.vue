<!-- 数据分析-日期范围选择器 -->
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
    popper-class="_adManage-DataCharts-date_picker-popper"
  />
</template>

<script>
import { getDateRangeForKey } from '@/util/date';

const options = {
  // 未来日期不可选
  disabledDate: (time) => {
    return time.getTime() > Date.now();
  },
  // 快捷选项
  shortcuts: [
    {
      text: '本周',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey('thisWeek'));
      }
    }, {
      text: '上周',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey('lastWeek'));
      }
    }, {
      text: '本月',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey('thisMonth'));
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
    }, {
      text: '最近90天',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey(90));
      }
    }, {
      text: '最近180天',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey(180));
      }
    }, {
      text: '最近365天',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey(365));
      }
    }, {
      text: '今年',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey('thisYear'));
      }
    }, {
      text: '去年',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey('lastYear'));
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
    handleChange() {
      this.$emit('change', this.value);
    },
  },
};
</script>

<style scoped lang="scss">
.date_picker {
  width: 220px;
}
</style>

<style lang="scss">
._adManage-DataCharts-date_picker-popper {
  .el-picker-panel__body {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
</style>
