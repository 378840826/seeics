/**
 * 选择字段时重置value
 * @param {Number} id 
 * @param {Array} arr
 * @returns 
 */
export const resetValue = (arr, id) => {
  arr.forEach(item => {
    if (item.id === id) {
      item.value = '';
      item.maxVal = '';
      item.minVal = '';
      item.condition = '&gt;';
    }
  });
  return arr;
};

/**
 * 选中条件清空value值
 * @param {Array} arr 需要操作的数组
 * @param {String} condition 条件
 * @param {Number} id 
 */
export const emptySelect = (arr, condition, id) => {
  let res = [];
  if (condition === '≥且<' || condition === '环比') {
    res = arr.map(item => {
      if (item.id === id) {
        item.value = '';
        item.maxVal = '';
        item.minVal = '';
      } 
      return item;
    });
  } else {
    res = arr.map(item => {
      if (item.id === id) {
        item.value = '';
        item.maxVal = '';
        item.minVal = '';
      } 
      return item;
    });
  }
  return res;
};

/**
 * 字段添加
 * @param {Array} arr
 * @param {Number} id 每个规则中最大的id
 * @param {String} label 没有被选中过的字段
 * @returns 
 */
export const addFiled = (arr, label) => {
  const res = arr;
  res.push({
    id: new Date().getTime(),
    label: label,
    condition: '&gt;',
    chain: '上升',
    vlaueType: '值',
    value: '',
    maxVal: '',
    minVal: '',
    btn: true,
  });
  delete res[res.length - 2].btn;
  return res;
};
import { fields } from './filed';
export const filterFiled = (value) => {
  let res = '';
  fields['tatolFileds'].map(item => {
    if (item.value === value) {
      res = item.label;
    }
  });
  return res;
};
/**
 * 拼接字段
 * @param {Array} Array 规则数组
 * @param {any} day
 * @returns 
 */

export const filterField = (Array, day) => {
  const arr = JSON.parse(JSON.stringify(Array));
  for (let i = 0; i < arr.length; i ++) {
    for (const key in arr[i]) {
      if (arr[i][key] === '') {
        delete arr[i][key];
      }
    }
  }
  
  const obj = day ? { 
    item: [],
    ...day
  } : { item: [] };
  arr.map(item => {
    let flag;
    if (item.label === 'acos' || item.label === 'ctr' || item.label === '转化率') {
      flag = true;
    }
    if (item.condition === '≥且<' && (item.minVal && item.maxVal) && item.label) {
      const params = {
        id: item.id,
        subruleName: item.label,
        symbol: item.condition,
        maximum: item.maxVal,
        minimum: item.minVal,
        statement: `and ${item.label}&gt;=${flag ? Number(item.minVal) / 100 : item.minVal} and ${item.label}&lt;${flag ? Number(item.maxVal) / 100 : item.maxVal}`,
      };
      const fullName = {
        fullName: `${filterFiled(item.label)}&gt;=${item.minVal}${filterFiled(item.label)}&lt;${item.maxVal}`
      };
      obj.item.push(day ? Object.assign(params, fullName) : params);
    } else if (item.value && item.label) {
      const params = {
        id: item.id,
        subruleName: item.label,
        symbol: item.condition,
        value: item.value,
        statement: `and ${item.label}${item.condition}${flag ? Number(item.value) / 100 : item.value}`,
      };
      const fullName = {
        fullName: `${filterFiled(item.label)}${item.condition}${item.value}`
      };
      obj.item.push(day ? Object.assign(params, fullName) : params);
    }
  });
  return obj;
};

//判断正整数
export const integer = (str) => {
  for (const key in str) {
    if (str[key] === '.') {
      return true;
    }
  }
  return false;
};