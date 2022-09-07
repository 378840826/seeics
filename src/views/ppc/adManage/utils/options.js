import { getDateRangeForKey } from '@/util/date';

// 分页器初始配置
export const tablePageOption = {
  total: 0,
  currentPage: 1,
  pageSize: 20,
  pageSizes: [20, 50, 100],
};

// 默认日期范围
export const defaultDateRange = getDateRangeForKey(7);

// 生成合计行数据
export function summaryMethod(columns, tableTotalData){
  const keys = Object.keys(tableTotalData);
  const sums = ['', '', '', '合计'];
  columns.forEach((column, index) => {
    if (keys.includes(column.property)) {
      sums[index] = tableTotalData[column.property];
    }
  });
  return sums;
}
