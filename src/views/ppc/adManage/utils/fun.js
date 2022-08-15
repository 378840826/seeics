// 解析左侧广告树的 key
export function parseTreeKey(key) {
  if ([null, undefined].includes(key)) {
    return {};
  }
  const paramsArr = key.split('-');
  return {
    camState: paramsArr[0],
    camId: paramsArr[1],
    groupId: paramsArr[2],
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
export function getCommonColOption(currency) {
  return [
    {
      label: '销售额',
      prop: 'sales',
      formatter: (_, value) => getValueLocaleString({ value, isFraction: true, prefix: currency }),
      width: 110,
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
