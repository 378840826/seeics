<!-- 日期范围选择器 -->
<template>
  <div class="container">

    <!-- 日历选择器 -->
    <el-date-picker
      ref="refElDatePicker"
      class="date_picker"
      size="small"
      :popper-class="popperClass"
      :key="elDatePickerTypeSelected"
      @input="handleElDatePickerChange"
      :type="elDatePickerType"
      :picker-options="{ firstDayOfWeek: 1 }"
    />

    <!-- 下拉框 -->
    <el-dropdown
      trigger="click"
      class="date_dropdown"
      @command="handleSelect"
    >
      <span class="el-dropdown-link dates-show">
        {{ dates[0] }}
        <i class="el-icon-sort-down el-icon--right"></i>
        {{ dates[1] }}
        <i class="el-icon-date"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="item in dropdownOptions"
          :key="item.label"
          :command="item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

  </div>
</template>

<script>
import dayjs from 'dayjs';
import { getStore } from '@/util/store';
import {
  defaultDateRangeKey,
  storeKey,
  getDateRangeDay,
  getDateRange,
  getUnitDateRange,
  format,
} from '../utils';

export default {
  name: 'DateRangePicker',

  created() {
    const storeDates = getStore(storeKey);
    console.log('storeDates', storeDates);
    if (storeDates) {
      this.dates = [storeDates.start, storeDates.end];
    }
  },

  data() {
    return {
      dropdownOptions,
      dates: getDateRangeDay(defaultDateRangeKey),
      // 从下拉框选中的 type，区别于 elDatePickerType 
      elDatePickerTypeSelected: 'week',
    };
  },
  
  computed: {
    // 实际需要的 type (按季选择需要用按月选择来伪装)
    elDatePickerType() {
      if (this.elDatePickerTypeSelected === 'quarter') {
        return 'month';
      }
      return this.elDatePickerTypeSelected;
    },

    // 日期选择器弹出框的 class
    popperClass() {
      return this.elDatePickerTypeSelected === 'quarter' ? 'date_range_picker-quarter' : '';
    },
  },

  watch: {
    elDatePickerTypeSelected(a) {
      console.log('elDatePickerTypeSelected', a, this.popperClass);
    },
  },

  methods: {
    handleSelect(command) {
      const { type, value } = command;
      if (type === 'immediate') {
        this.dates = getDateRange(value);
      } else {
        this.elDatePickerTypeSelected = value;
        // 打开日历
        setTimeout(() => {
          this.$refs.refElDatePicker.focus();
        }, 0);
      }
    },

    // 按周，月，季，自定义选择时需要处理日期
    handleElDatePickerChange(date) {
      if (this.elDatePickerTypeSelected === 'quarter') {
        // 按季选择是用月选择器伪装的，需要特殊处理日期
        const quarter = date.getMonth() + 1;
        this.dates = getUnitDateRange(dayjs(date).quarter(quarter), 'quarter');
      } else if (this.elDatePickerTypeSelected === 'daterange') {
        this.dates = [dayjs(date[0]).format(format), dayjs(date[1]).format(format)];
      } else {
        this.dates = getUnitDateRange(date, this.elDatePickerTypeSelected);
      }
    },
  },
};

const dropdownOptions = [
  {
    label: '按周选择',
    value: {
      type: 'calendar',
      value: 'week',
    },
  }, {
    label: '按月选择',
    value: {
      type: 'calendar',
      value: 'month',
    },
  }, {
    label: '按季选择',
    value: {
      type: 'calendar',
      value: 'quarter',
    },
  }, {
    label: '上周',
    value: {
      type: 'immediate',
      value: 'lastWeek',
    },
  }, {
    label: '上月',
    value: {
      type: 'immediate',
      value: 'lastMonth',
    },
  }, {
    label: '最近7日',
    value: {
      type: 'immediate',
      value: '7',
    },
  }, {
    label: '最近30日',
    value: {
      type: 'immediate',
      value: '30',
    },
  }, {
    label: '最近60日',
    value: {
      type: 'immediate',
      value: '60',
    },
  }, {
    label: '最近90日',
    value: {
      type: 'immediate',
      value: '90',
    },
  }, {
    label: '最近365日',
    value: {
      type: 'immediate',
      value: '365',
    },
  }, {
    label: '今年',
    value: {
      type: 'immediate',
      value: 'thisYear',
    },
  }, {
    label: '去年',
    value: {
      type: 'immediate',
      value: 'lastYear',
    },
  }, {
    label: '自定义',
    value: {
      type: 'calendar',
      value: 'daterange',
    },
  },
];

</script>

<style scoped lang="scss">
::v-deep {
  .date_picker {
    width: 100%;
    position: absolute;
    top: 0;
    opacity: 0;
  }

  .date_dropdown {
    width: 100%;
  }
}

.container {
  width: 280px;
  background-color: #fff;
  position: relative;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
}

.dates-show {
  display: flex;
  align-items: center;
  height: 30px;
  padding: 0 16px 0 13px;
  justify-content: space-between;
}

.el-icon--right {
  transform: rotate(270deg) rotateY(180deg);
}
</style>

<style lang="scss">
// 月份选择器伪装成季度选择器
.date_range_picker-quarter {
  .el-month-table {
    // 除了第一行，其他全隐藏
    tr ~ tr {
      display: none;
      opacity: 0;
    }

    // 第一行修改显示
    tr:first-child {
      td {
        position: relative;

        &:hover {
          color: #409EFF;
        }
        // 隐藏原本的月份
        div {
          display: none;
        }
      }

      // 设置伪元素
      td:nth-child(1)::after {
        content: 'Q1';
      }
      td:nth-child(2)::after {
        content: 'Q2';
      }
      td:nth-child(3)::after {
        content: 'Q3';
      }
      td:nth-child(4)::after {
        content: 'Q4';
      }
    }
  }
}
</style>

