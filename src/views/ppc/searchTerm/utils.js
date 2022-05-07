import dayjs from 'dayjs';
import func from '@/util/func';

const quarterOfYear = require('dayjs/plugin/quarterOfYear');
dayjs.extend(quarterOfYear);

export const storeKey = 'DateRangePicker-searchTerm';
export const defaultDateRangeKey = '30';
export const format = 'YYYY-MM-DD';
export const invalidVals = [null, undefined, ''];

// 高级筛选的 key => name
export const rangeFilterKeyToNameDict = {
  aba: 'ABA排名',
  salesVolume: '销售额',
  spend: 'Spend',
  clicks: 'Clicks',
  conversion: '转化率',
  orderNum: '订单量',
  acos: 'ACoS',
  ctr: 'CTR',
  cpc: 'CPC',
  roas: 'RoAS',
  cpa: 'CPA',
  impressions: 'Impressions',
};

// 全部筛选条件的 key => name
export const filterKeyToNameDict = {
  ...rangeFilterKeyToNameDict,
  launchKeyword: '投放词',
  searchKeyword: '搜索词',
  deliveryStatus: '投放状态',
  asinMskuKeyword: '批量查询',
  cycleType: '周期',
  campaignNameList: '广告活动',
  groupNameList: '广告组',
};

export const deliveryStatusDict = { '1': '已投放', '0': '未投放' };

// 列表筛选条件的顺序
export const filterSort = [
  'cycleType', 'launchKeyword', 'searchKeyword', 'deliveryStatus',
  'asinMskuKeyword', 'campaignNameList', 'groupNameList',
  ...Object.keys(rangeFilterKeyToNameDict),
];

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

// 筛选参数转换为 xxMin xxMax 模式, 并检查 min <= max
export function changeFilterType(filterData) {
  const resultObj = {};
  const keys = Object.keys(filterData);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    // 检查高级筛选的 min max 大小
    // min max 都不为空才需要检查
    if (!invalidVals.includes(filterData[key].min) && !invalidVals.includes(filterData[key].max)) {
      if (filterData[key].min > filterData[key].max) {
        return {
          status: 'error',
          msg: `${rangeFilterKeyToNameDict[key]} 最大值必须大于最小值`,
        };
      }
    }
    if (!invalidVals.includes(filterData[key].min)) {
      resultObj[`${key}Min`] = filterData[key].min;
    }
    if (!invalidVals.includes(filterData[key].max)) {
      resultObj[`${key}Max`] = filterData[key].max;
    }
  }
  return resultObj;
}

// 筛选参数 xxMin xxMax 转换为 xx: { min: x, max: x } 模式，非范围数据不转换
export function changeFilterTypeToObj(filterMinMaxData) {
  const filterConditionVoKeys = Object.keys(filterMinMaxData);
  const rangeKeys = ['Min', 'Max'];
  const result = {};
  filterConditionVoKeys.forEach(key => {
    const rangeKey = key.slice(key.length - 3, key.length);
    if (rangeKeys.includes(rangeKey)) {
      const k = key.slice(0, -3);
      result[k] = { min: filterMinMaxData[`${k}Min`], max: filterMinMaxData[`${k}Max`] };
    } else {
      result[key] = filterMinMaxData[key];
    }
  });
  return result;
}

// 筛选条件显示
export function getFilterConditionVoShow(filterCondition) {
  // 筛选出有有效值的数据（接口会返回无效值）
  const filterConditionValid = {};
  const allKey = Object.keys(filterCondition);
  for (let i = 0; i < allKey.length; i++) {
    const k = allKey[i];
    const v = filterCondition[k];
    if (invalidVals.includes(v)) {
      continue;
    }
    if (func.getDataType(v) === 'Array' && v.length === 0) {
      continue;
    }
    filterConditionValid[k] = v;
  }
  // 范围数据转为 { min: x, max: x } 结构
  const filterConditionObj = changeFilterTypeToObj(filterConditionValid);
  const keys = Object.keys(filterConditionObj);
  // 按要求排序
  keys.sort((a, b) => {
    return filterSort.indexOf(a) - filterSort.indexOf(b);
  });
  const result = {};
  keys.map(key => {
    const value = filterConditionObj[key];
    const valueType = func.getDataType(value);
    if (valueType === 'Object') {
      result[key] = `${value.min || '空'} - ${value.max || '空'}`;
    } else {
      result[key] = value;
    }
  });
  result.cycleType = `最近${result.cycleType}天`;
  if (!invalidVals.includes(result.deliveryStatus)) {
    result.deliveryStatus = deliveryStatusDict[result.deliveryStatus];
  }
  return result;
}

// 筛选条件的广告活动广告组数组显示
export function getFilterConditionVoArrShow(array) {
  if (array.length < 2) {
    return array[0];
  }
  return `${array[0]}、+${array.length - 1}`;
}

// 模拟 a 标签下载
export const downloadATag = (blobUrl, fileName) => {
  const a = document.createElement('a');
  a.download = `${fileName}`;
  a.href = blobUrl;
  a.click();
};

// 失焦时触发 input 事件（用于临时解决广告活动、广告组的 avue-select 的搜索匹配 bug）
export const addBlurTriggerInputEvent = (selector) => {
  const nodeList = window.document.querySelectorAll(selector);
  for (let i = 0; i < nodeList.length; i++) {
    const dom = nodeList[i];
    dom.addEventListener('blur', function () {
      setTimeout(() => {
        dom.value = ' ';
        const event = new InputEvent('input');
        dom.dispatchEvent(event);
      }, 0);
    });
  }
};
