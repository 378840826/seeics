// 状态图标 class 字典
export const stateIconDict = {
  enabled: 'el-icon-video-play',
  paused: 'el-icon-video-pause',
  archived: 'el-icon-folder-remove',
};

// 状态名称字典
export const stateNameDict = {
  enabled: '开启',
  paused: '暂停',
  archived: '归档',
};

// 右侧全部的标签页信息
export const allTabs = {
  campaign: { label: '广告活动', name: 'campaign', countKey: 'campaignCount', tabPane: 'Campaign' },
  group: { label: '广告组', name: 'group', countKey: 'groupCount', tabPane: 'Group' },
  ad: { label: '广告', name: 'ad', countKey: 'adCount', tabPane: 'Ad' },
};

// 右侧标签页的三个状态，根据当前选中的广告树节点来区分
export const tabsStateDict = {
  default: ['campaign', 'group', 'ad'],
  campaign: ['group', 'ad'],
  group: ['ad'],
};

// 投放方式字典
export const targetingTypeDict = {
  manual: '手动',
  auto: '自动',
  T00020: '分类/商品',
  T00030: '受众',
};

// 竞价策略下拉选择
export const biddingStrategyDict = {
  legacyForSales: 'Down Only',
  autoForSales: 'Up and Down',
  manual: 'Fixed Bid',
};

// 需要格式化为金额的字段 key
// export const moneyKeys = [];
