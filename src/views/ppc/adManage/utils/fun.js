import dayjs from 'dayjs';
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

// 解析左侧广告树的 key
export function parseTreeKey(key) {
  if ([null, undefined].includes(key)) {
    return {};
  }
  const paramsArr = key.split('-');
  return {
    campaignState: paramsArr[0],
    campaignId: paramsArr[1],
    groupId: paramsArr[2],
    groupType: paramsArr[3],
  };
}

/**
 * 格式化数值显示
 * 金额货币，百分比，数字，每 3 位加逗号
 * @param value 值
 * @param prefix 前缀
 * @param suffix 后缀
 * @param isFraction 是否精确到 0.01
 * @returns 
 */
export function getValueLocaleString(params) {
  const { value, prefix, suffix, isFraction } = params;
  // 值为空时的替代
  const empty = '—';
  // 空
  if ([null, undefined, '', NaN].includes(value)) {
    return empty;
  }
  // 整数
  if (!prefix && !suffix && !isFraction) {
    const floatVlaue = Number(value).toLocaleString();
    return floatVlaue;
  }
  // 小数
  const v = Number(value).toLocaleString(
    undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }
  );
  return `${prefix || ''}${v || empty}${suffix || ''}`;
}

// 获取 销售额 订单量 impressions clicks 等通用的、不可交互的列配置
export function getCommonColOptionAvue(currency) {
  return [
    {
      label: '销售额',
      prop: 'sales',
      formatter: (_, value) => getValueLocaleString({ value, isFraction: true, prefix: currency }),
      width: 120,
    }, {
      label: '订单量',
      prop: 'orderNum',
      formatter: (_, value) => getValueLocaleString({ value }),
      width: 80,
    }, {
      label: 'CPC',
      prop: 'cpc',
      formatter: (_, value) => getValueLocaleString({ value, isFraction: true, prefix: currency }),
      width: 80,
    }, {
      label: 'CPA',
      prop: 'cpa',
      formatter: (_, value) => getValueLocaleString({ value, isFraction: true, prefix: currency }),
      width: 80,
    }, {
      label: 'Spend',
      prop: 'spend',
      formatter: (_, value) => getValueLocaleString({ value, isFraction: true, prefix: currency }),
      width: 90,
    }, {
      label: 'ACoS',
      prop: 'acos',
      formatter: (_, value) => getValueLocaleString({ value, isFraction: true, suffix: '%' }),
      width: 80,
    }, {
      label: 'RoAS',
      prop: 'roas',
      formatter: (_, value) => getValueLocaleString({ value, isFraction: true, }),
      width: 80,
    }, {
      label: 'Impressions',
      prop: 'impressions',
      formatter: (_, value) => getValueLocaleString({ value }),
      width: 100,
    }, {
      label: 'Clicks',
      prop: 'clicks',
      formatter: (_, value) => getValueLocaleString({ value }),
      width: 80,
    }, {
      label: 'CTR',
      prop: 'ctr',
      formatter: (_, value) => getValueLocaleString({ value, isFraction: true, suffix: '%' }),
      width: 80,
    }, {
      label: '转化率',
      prop: 'conversionsRate',
      formatter: (_, value) => getValueLocaleString({ value, isFraction: true, suffix: '%' }),
      width: 80,
    },
  ];
}

// 获取 销售额 订单量 impressions clicks 等通用的、不可交互的列配置
export function getCommonColOption(currency) {
  return [
    {
      label: '销售额',
      prop: 'sales',
      formatter: (value) => getValueLocaleString({ value, isFraction: true, prefix: currency }),
      width: 110,
    }, {
      label: '订单量',
      prop: 'orderNum',
      formatter: (value) => getValueLocaleString({ value }),
      width: 80,
    }, {
      label: 'CPC',
      prop: 'cpc',
      formatter: (value) => getValueLocaleString({ value, isFraction: true, prefix: currency }),
      width: 80,
    }, {
      label: 'CPA',
      prop: 'cpa',
      formatter: (value) => getValueLocaleString({ value, isFraction: true, prefix: currency }),
      width: 80,
    }, {
      label: 'Spend',
      prop: 'spend',
      formatter: (value) => getValueLocaleString({ value, isFraction: true, prefix: currency }),
      width: 90,
    }, {
      label: 'ACoS',
      prop: 'acos',
      formatter: (value) => getValueLocaleString({ value, isFraction: true, suffix: '%' }),
      width: 80,
    }, {
      label: 'RoAS',
      prop: 'roas',
      formatter: (value) => getValueLocaleString({ value, isFraction: true, }),
      width: 80,
    }, {
      label: 'Impressions',
      prop: 'impressions',
      formatter: (value) => getValueLocaleString({ value }),
      width: 100,
    }, {
      label: 'Clicks',
      prop: 'clicks',
      formatter: (value) => getValueLocaleString({ value }),
      width: 80,
    }, {
      label: 'CTR',
      prop: 'ctr',
      formatter: (value) => getValueLocaleString({ value, isFraction: true, suffix: '%' }),
      width: 80,
    }, {
      label: '转化率',
      prop: 'conversionsRate',
      formatter: (value) => getValueLocaleString({ value, isFraction: true, suffix: '%' }),
      width: 80,
    },
  ];
}

// 获取合计数据
export function getFormatTotal(total, currency) {
  return {
    sales: getValueLocaleString({ value: total.sales, isFraction: true, prefix: currency }),
    orderNum: getValueLocaleString({ value: total.orderNum }),
    impressions: getValueLocaleString({ value: total.impressions }),
    clicks: getValueLocaleString({ value: total.clicks }),
    spend: getValueLocaleString({ value: total.spend, isFraction: true, prefix: currency }),
    acos: getValueLocaleString({ value: total.acos, isFraction: true, suffix: '%' }),
    roas: getValueLocaleString({ value: total.roas, isFraction: true, }),
    ctr: getValueLocaleString({ value: total.ctr, isFraction: true, suffix: '%' }),
    cpc: getValueLocaleString({ value: total.cpc, isFraction: true, prefix: currency }),
    cpa: getValueLocaleString({ value: total.cpa, isFraction: true, prefix: currency }),
    conversionsRate: getValueLocaleString({ value: total.conversionsRate, isFraction: true, suffix: '%' }),
  };
}

// el-table 的排序参数转换为后端接口所需的格式
export function formatTableSortParams(elSortParams) {
  const { prop, order } = elSortParams;
  if (!order) {
    return;
  }
  const dict = {
    ascending: true,
    descending: false,
  };
  return {
    // 未排序时，取消 order 参数
    order: prop,
    asc: dict[order],
  };
}

// 获取站点当前时间
export function getMarketplaceTime(timezone, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(new Date()).tz(timezone).format(format);
}