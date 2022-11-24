
import {} from '../../dict';
export const format = () => {
  const arr = [];
  for (let i = 0; i < 24; i ++) {
    arr.push(i);
  }
  return arr;
};

export const timeData = () => {
  const arr = [];
  for (let i = 0; i < 7; i ++) {
    arr.push({
      week: weekNumberToChinese(i),
      select: format()
    });
  }
  return arr;
};

export function weekNumberToChinese(val) {
  switch (val) {
  case 0: 
    return '星期一';
  case 1: 
    return '星期二';
  case 2: 
    return '星期三';
  case 3: 
    return '星期四';
  case 4: 
    return '星期五';
  case 5: 
    return '星期六';
  case 6: 
    return '星期日';
  default:
    return '';
  }
}

export function weekTransition(val) {
  switch (val) {
  case 'mon':
    return 0;
  case 'tues':
    return 1;
  case 'wed':
    return 2;
  case 'thur':
    return 3;
  case 'fri':
    return 4;
  case 'sat':
    return 5;
  case 'sun':
    return 6;
  default: 
    return -1;
  }
}

export function timeFormat(val) {
  switch (val) {
  case 1:
    return '01';
  case 2:
    return '02';
  case 3:
    return '03';
  case 4:
    return '04';
  case 5:
    return '05';
  case 6:
    return '06';
  case 7:
    return '07';
  case 8:
    return '08';
  case 9:
    return '09';
  default:
    return '00';
  }
}

export function selectData(arr) {
  let obj = {};
  let row = 0;
  for (let i = 0; i < arr.length; i ++) {

    if (arr[i].row === row) {
      obj = {
        ...obj,
        [arr[i].row]: [...obj[arr[i].row], arr[i].idx],
      };
    //   console.log(obj)
    } else {
      row = arr[i].row;
      obj = {
        ...obj,
        [arr[i].row]: [arr[i].idx],
      };
    }
  }

  const arrs = [];

  Object.keys(obj).forEach(item => {
    obj[item] = coherent(obj[item]);
    for (let i = 0; i < obj[item].length; i ++) {
      if (typeof obj[item][i] === 'string') {
        // console.log()
        const time = obj[item][i].split('-');
        arrs.push({
          week: item,
          endTime: `${time[1] < 10 ? timeFormat(Number(time[1])) : time[1]}:00`,
          startTime: `${time[0] < 10 ? timeFormat(Number(time[0])) : time[0]}:00`,
        });
      } else {
        arrs.push({
          week: item,
          endTime: `${obj[item][i] + 1 < 10 ? timeFormat(obj[item][i] + 1) : obj[item][i] + 1}:00`,
          startTime: `${obj[item][i] < 10 ? timeFormat(obj[item][i]) : obj[item][i]}:00`,
        });
      }
    }
  });
  
  return arrs;
}

export function coherent (arr) {
  let start = '';
  const newArr = [];
  arr.forEach((item, index) => {
    if (item + 1 === arr[index + 1] && item - 1 !== arr[index - 1]) {
      start = item;
    } else if (item - 1 === arr[index - 1] && item + 1 !== arr[index + 1]) {
      newArr.push(`${start}-${item}`);
    } else if (item - 1 !== arr[index - 1] && item + 1 !== arr[index + 1]) {
      newArr.push(item);
    }
  });
  return newArr;
//   console.log(ars)
}