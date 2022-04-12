import dayjs from 'dayjs';
const quarterOfYear = require('dayjs/plugin/quarterOfYear');
dayjs.extend(quarterOfYear);

export const storeKey = 'DateRangePicker-searchTerm';
export const defaultDateRangeKey = '30';
export const format = 'YYYY-MM-DD';

// 获取最近 n 天的日期范围
export function getDateRangeDay(n) {
  return [dayjs().subtract(n, 'day').format(format), dayjs().format(format)];
}

// 获取日期所属周，月，季的日期范围
export function getUnitDateRange(date, type = 'week') {
  const d = dayjs(date);
  let result = [];
  if (type === 'week') {
    result = [
      d.startOf('week').add(1, 'days').format(format),
      d.endOf('week').add(1, 'days').format(format),
    ];
  } else {
    console.log('type', type, d.startOf(type).format(format));
    result = [
      d.startOf(type).format(format),
      d.endOf(type).format(format),
    ];
  }
  return result;
}

// 根据 key 获取日期范围
export function getDateRange(key) {
  let dates = [];
  const myDayjs = dayjs();
  switch (key) {
  case 'lastWeek':
    dates = [
      myDayjs.subtract(1, 'weeks').startOf('week').add(1, 'days').format(format),
      myDayjs.subtract(1, 'weeks').endOf('week').add(1, 'days').format(format),
    ];
    break;
  case 'lastMonth':
    dates = [
      myDayjs.subtract(1, 'months').startOf('month').format(format),
      myDayjs.subtract(1, 'months').endOf('month').format(format),
    ];
    break;
  case 'thisYear':
    dates = [
      myDayjs.startOf('year').format(format),
      myDayjs.endOf('year').format(format),
    ];
    break;
  case 'lastYear':
    dates = [
      dayjs().subtract(1, 'years').startOf('year').format(format),
      dayjs().subtract(1, 'years').endOf('year').format(format),
    ];
    break;
  default:
    dates = getDateRangeDay(key);
    break;
  }
  return dates;
}
