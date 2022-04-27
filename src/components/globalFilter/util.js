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
      item.condition = '>';
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
 * @returns 
 */
export const addFiled = (arr) => {
  const res = arr;
  res.push({
    id: new Date().getTime(),
    label: '',
    condition: '>',
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

/**
 * 拼接字段
 * @param {Array} Array 规则数组
 * @returns 
 */
export const filterField = (Array) => {
  const arr = JSON.parse(JSON.stringify(Array));
  for (let i = 0; i < arr.length; i ++) {
    for (const key in arr[i]) {
      if (arr[i][key] === '') {
        delete arr[i][key];
      }
    }
  }
  const obj = { item: [] };
  arr.map(item => {
    if (item.condition === '≥且<' && (item.minVal && item.maxVal)) {
      // obj = {
      //   ...obj,
      //   [item.label]: `and ${item.label}<${item.maxVal}and ${item.label}>${item.minVal}`
      // };
      obj.item.push({
        id: item.id,
        subruleName: item.label,
        symbol: item.condition,
        maximum: item.maxVal,
        minimum: item.minVal,
        statement: `and ${item.label}>${item.minVal} and ${item.label}<${item.maxVal}`
      });
    } else if (item.value) {
      // obj = {
      //   ...obj,
      //   [item.label]: `and ${item.label}${item.condition}${item.value}`
      // };
      obj.item.push({
        id: item.id,
        subruleName: item.label,
        symbol: item.condition,
        value: item.value,
        statement: `and ${item.label}${item.condition}${item.value}`
      });
    }
  });
  // console.log(obj)
  return obj;
};