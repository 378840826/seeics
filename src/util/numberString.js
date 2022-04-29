// 字符串格式化为 正整数 字符串（不包含 0）
export const strToPositiveIntStr = function (value) {
  console.log('value', value);
  // 删除非数字字符, 再用 Number 转为数字去掉前导的 0。如果为 NaN，返回空字符串
  const newValue = Number(value.replace(/[^0-9]/g, ''));
  return newValue ? String(newValue) : '';
};

// 字符串格式化为 两位小数 的字符串（金额）
export const strToMoneyStr = function (value) {
  // 删除数字和小数点以外的字符
  let newValue = value.replace(/[^\d.]/g, '');
  // 只保留第一个小数点
  // newValue = newValue.replace(/\.{2,}/g, '.');
  newValue = newValue.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
  // 只保留两位小数
  newValue = newValue.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
  // 去掉整数部分前导的 0
  if (newValue.indexOf('.') < 0 && newValue !== '') {
    newValue = String(parseFloat(newValue));
  }
  // 第一位不能为小数点
  if (newValue.indexOf('.') === 0) {
    newValue = '0.';
  }
  return newValue;
};

// 字符串格式化为 4 位小数 的字符串
export const strTo4Str = function (value) {
  // 删除数字和小数点以外的字符
  let newValue = value.replace(/[^\d.]/g, '');
  // 只保留第一个小数点
  // newValue = newValue.replace(/\.{2,}/g, '.');
  newValue = newValue.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
  // 保留 4 位小数
  newValue = newValue.replace(/^(-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3');
  // 去掉整数部分前导的 0
  if (newValue.indexOf('.') < 0 && newValue !== '') {
    newValue = String(parseFloat(newValue));
  }
  // 第一位不能为小数点
  if (newValue.indexOf('.') === 0) {
    newValue = '0.';
  }
  return newValue;
};