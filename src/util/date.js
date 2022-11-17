import dayjs from 'dayjs';

export const calcDate = (date1, date2) => {
  const date3 = date2 - date1;

  const days = Math.floor(date3 / (24 * 3600 * 1000));

  const leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
  const hours = Math.floor(leave1 / (3600 * 1000));

  const leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
  const minutes = Math.floor(leave2 / (60 * 1000));

  const leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
  const seconds = Math.round(date3 / 1000);
  return {
    leave1,
    leave2,
    leave3,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
};

/**
 * 日期格式化
 */
export function dateFormat(date, format) {
  format = format || 'yyyy-MM-dd hh:mm:ss';
  if (date !== 'Invalid Date') {
    const o = {
      'M+': date.getMonth() + 1, //month
      'd+': date.getDate(), //day
      'h+': date.getHours(), //hour
      'm+': date.getMinutes(), //minute
      's+': date.getSeconds(), //second
      'q+': Math.floor((date.getMonth() + 3) / 3), //quarter
      'S': date.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1,
        (`${date.getFullYear() }`).substr(4 - RegExp.$1.length)); 
    }
    for (const k in o) {
      if (new RegExp(`(${ k })`).test(format)) {
        format = format.replace(RegExp.$1,
          RegExp.$1.length === 1 ? o[k] :
            (`00${ o[k]}`).substr((`${ o[k]}`).length)); 
      } 
    }
    return format;
  }
  return '';

}

/**
 * 获取最近 n 天的日期范围
 * @param {Number} n 天
 * @param {String} format 日期格式
 * @returns {[String, String]}
 */
export function getDateRangeForLastDay(n = 1, format = 'YYYY-MM-DD') {
  const myDayjs = dayjs();
  // n -1 是因为最近X天需要算上当天
  return [myDayjs.subtract(n - 1, 'day').format(format), myDayjs.format(format)];
}

/**
 * 根据 key 获取日期范围
 * @param {String | Number} key 关键词， 或最近 key 天
 * @param {String} format 日期格式
 * @returns {[String, String]}
 */
export function getDateRangeForKey(key, format = 'YYYY-MM-DD') {
  let dates = [];
  const myDayjs = dayjs();
  switch (key) {
  case 'yesterday':
    dates = [
      myDayjs.subtract(1, 'day').format(format),
      myDayjs.subtract(1, 'day').format(format),
    ];
    break;
  case 'thisWeek':
    dates = [
      myDayjs.startOf('week').add(1, 'days').format(format),
      myDayjs.endOf('week').add(1, 'days').format(format),
    ];
    break;
  case 'lastWeek':
    dates = [
      myDayjs.subtract(1, 'weeks').startOf('week').add(1, 'days').format(format),
      myDayjs.subtract(1, 'weeks').endOf('week').add(1, 'days').format(format),
    ];
    break;
  case 'thisMonth':
    dates = [
      myDayjs.startOf('month').format(format),
      myDayjs.endOf('month').format(format),
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
  // 如果不是关键词，则返回最近 key 天的范围
  default:
    dates = getDateRangeForLastDay(key);
    break;
  }
  return dates;
}
