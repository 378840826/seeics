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
// export const defaultDateRange = getDateRangeForKey(60);

// 店铺选中本地存储的 key
export const currentShopKey = 'app-adMamage-currentShop';

// 生成合计行数据
export function summaryMethod(columns, tableTotalData, summaryTitleColIndex = 2){
  const keys = Object.keys(tableTotalData);
  const sums = ['', '', '', ''];
  sums[summaryTitleColIndex] = '合计';
  columns.forEach((column, index) => {
    if (keys.includes(column.property)) {
      sums[index] = tableTotalData[column.property];
    }
  });
  return sums;
}

// 各页面公共的自定义列项
const commonCustomColsOptions = [
  '销售额', '订单量', 'CPC', 'CPA', 'Spend', 'ACoS', 'RoAS', 'Impressions', 'Clicks', 'CTR', '转化率',
];

// 广告活动页的可自定义列
export const campaignCustomColsOptions = [
  '广告组合', '广告类型', '创建时间', '广告组数量', '竞价策略', '搜索结果顶部',
  '商品页面', '日预算', '智能预算', '否定关键词', '否定商品', '开始时间', '结束时间',
  ...commonCustomColsOptions,
];

// 广告组页的可自定义列
export const groupCustomColsOptions = [
  '广告活动', '创建时间', '默认竞价', '广告个数', '关键词', '商品', '否定关键词', '否定商品',
  ...commonCustomColsOptions,
];

// 广告页的可自定义列
export const adCustomColsOptions = [
  '投放资格', '广告活动', '广告组', '添加时间',
  ...commonCustomColsOptions,
];

// 关键词页的可自定义列
export const keywordCustomColsOptions = [
  '匹配方式', '广告活动', '广告组', '建议竞价', '竞价', '智能竞价', '添加时间',
  ...commonCustomColsOptions,
];

// targeting页的可自定义列
export const targetingCustomColsOptions = [
  '匹配方式', '广告活动', '广告组', '建议竞价', '竞价', '智能竞价', '添加时间',
  ...commonCustomColsOptions,
];

// 投放组页的可自定义列
export const targetingGroupsCustomColsOptions = [
  '所属广告组', '建议竞价', '竞价', '智能竞价', 
  ...commonCustomColsOptions,
];

// SearchTerm 页的可自定义列
export const searchTermCustomColsOptions = [
  '投放', '匹配类型', '广告活动', '广告组', 'ABA排名',
  ...commonCustomColsOptions,
];

// 广告位页的可自定义列
export const placementCustomColsOptions = [
  '竞价策略', '竞价调整', 
  ...commonCustomColsOptions,
];

