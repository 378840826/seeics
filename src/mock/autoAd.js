/**
 * 智能广告 和 广告日志
 */
import Mock from 'mockjs';

export default ({ mock }) => {
  if (!mock) {
    return;
  }

  // // 店铺名称列表
  // Mock.mock('/api/seeics-ad/store/shopNameList', 'get', {
  //   'data|1-20': ['@string'],
  // });


  // // 广告活动列表
  // Mock.mock('/api/seeics-ad/campaign/list', 'post', {
  //   data: {
  //     total: 100,
  //     current: 2,
  //     size: 20,
  //     'records|0-50': [
  //       {
  //         campaignId: '1',
  //         // name: '广告活动名称-1',
  //         'name|1-5': '广告活动名称-1',
  //         state: 'enabled',
  //         campaignType: 'sponsoredProducts',
  //         targetingType: 'auto',
  //       }, 
  //     ],
  //   },
  // });

  // 广告日志列表
  Mock.mock(RegExp('/api/seeics-ad/adjustment-log/list' + '.*?'), 'post', {
    data: {
      total: 100,
      current: 2,
      size: 20,
      'records|0-50': [
        {
          actionTime: '@datetime',
          shopName: '@cword(3,10)',
          'marketplace|1': ['US', 'CA', 'MX'],
          'adType|1': ['SP', 'SD', 'SB'],
          actionEntity: 'paraffin booties-广泛匹配',
          'entityType|1': ['关键词', '广告组', '广告活动'],
          'camName|1-5': '广告活动名称-1',
          'groupName|1-5': '广告组名称-1',
          'actionMode|1': ['手动', '自动'],
          'action|1': ['新增关键词', '新增否定商品投放'],
          'oldValue|1': ['oldValue', ''],
          'newValue|1': ['newValue', ''],
          'actionResult|1': ['成功', '失败'],
          actionUserName: '@cword(2,10)',
          automationTemplateName: '@cword(2,20)',
        },
      ],
    },
  });

};
