// 状态
export const stateDict = {
  enabled: '运行中',
  paused: '已暂停',
  archived: '已归档',
};

export const stateExtendDict = {
  'enabled,paused': '运行中和已暂停',
  ...stateDict,
};

// 广告活动类型
export const campaignTypeDict = {
  sponsoredProducts: 'SP',
  sd: 'SD',
  sb: 'SB',
};

// 投放方式
export const targetingTypeDict = {
  manual: 'SP-手动投放',
  auto: 'SP-自动投放',
  T00030: 'SD-受众',
  T00020: 'SD-商品投放',
};

// 广告对象(现在用的是中文，预防以后会修改成英文)
export const adObjectTypeDict = {
  广告活动: '广告活动',
  广告组: '广告组',
  广告: '广告',
  广告组合: '广告组合',
  关键词: '关键词',
  否定关键词: '否定关键词',
  商品投放: '商品投放',
  否定商品投放: '否定商品投放',
  投放组: '投放组',
  用户搜索词: '用户搜索词',
};

// 广告执行操作
export const actionList = ['新增关键词', '新增否定关键词', '新增商品投放', '新增否定商品投放'];

// 表格排序参数转换（el-ui 自带格式转换为 接口所需格式）
export function formatTableSortParams(elementUiParams) {
  const dict = {
    ascending: true,
    descending: false,
    '': '',
  };
  return {
    sort: dict[elementUiParams.order],
    order: elementUiParams.prop,
  };
}
