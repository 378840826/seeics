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
