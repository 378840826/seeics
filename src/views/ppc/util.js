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
  T00020: 'SD-受众',
  T00030: 'SD-商品投放',
};

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
