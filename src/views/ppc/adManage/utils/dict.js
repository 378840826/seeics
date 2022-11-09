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

export const stateNameList = Object.keys(stateNameDict);

// 右侧全部的标签页信息
export const allTabs = {
  campaign: { label: '广告活动', name: 'campaign', countKey: 'campaignCount', tabPane: 'Campaign' },
  group: { label: '广告组', name: 'group', countKey: 'groupCount', tabPane: 'Group' },
  ad: { label: '广告', name: 'ad', countKey: 'adCount', tabPane: 'Ad' },
  keyword: { label: '关键词', name: 'keyword', countKey: 'keywordCount', tabPane: 'Keyword' },
  targeting: { label: '分类/商品投放', name: 'targeting', countKey: 'targetCount', tabPane: 'Targeting' },
  negativeKeyword: {
    label: '否定关键词', name: 'negativeKeyword', countKey: 'neKeywordCount', tabPane: 'NegativeKeyword',
  },
  negativeTargeting: {
    label: '否定商品', name: 'negativeTargeting', countKey: 'neTargetingCount', tabPane: 'NegativeTargeting',
  },
  targetingGroups: { 
    label: '投放组', name: 'targetingGroups', countKey: 'autoTargetGroupCount', tabPane: 'TargetingGroups',
  },
};

// 右侧标签页的三个状态，根据当前选中的广告树节点来区分
export const tabsStateDict = {
  default: ['campaign', 'group', 'ad', 'keyword', 'negativeKeyword', 'targeting', 'negativeTargeting', 'targetingGroups'],
  campaign: ['group', 'ad', 'keyword', 'negativeKeyword', 'targeting', 'negativeTargeting'],
  // 自动广告活动，不显示 关键词和分类/商品投放， 显示投放组
  autoCampaign: ['group', 'ad', 'targetingGroups', 'negativeKeyword', 'negativeTargeting'],
  keywordGroup: ['ad', 'keyword', 'negativeKeyword'],
  targetingGroup: ['ad', 'targeting', 'negativeTargeting'],
  // 自动广告组，不显示 关键词和分类/商品投放，但显示否定关键词和否定targeting，显示投放组
  autoKeywordGroup: ['ad', 'targetingGroups', 'negativeKeyword', 'negativeTargeting'],
  autoTargetingGroup: ['ad', 'targetingGroups', 'negativeKeyword', 'negativeTargeting'],
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

// 匹配方式名称
export const matchTypeNameDict = {
  broad: '广泛',
  phrase: '词组',
  exact: '精准',
};

// 否定关键词的匹配方式名称
export const NegativeKeywordMatchTypeNameDict = {
  negativePhrase: '词组否定',
  negativeExact: '精准否定',
};

// Targeting 类型
export const deliveryMethodNameDict = {
  category: '分类',
  product: '商品',
};
