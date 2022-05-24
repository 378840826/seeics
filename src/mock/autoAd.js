/**
 * 智能广告
 */
import Mock from 'mockjs';

export default ({ mock }) => {
  if (!mock) {
    return;
  }

  // 店铺名称列表
  Mock.mock('/api/seeics-ad/store/shopNameList', 'get', {
    'data|1-20': ['@string'],
  });


  // 广告活动列表
  Mock.mock('/api/seeics-ad/campaign/list', 'post', {
    data: {
      total: 100,
      current: 2,
      size: 20,
      'records|0-50': [
        {
          campaignId: '1',
          // name: '广告活动名称-1',
          'name|1-5': '广告活动名称-1',
          state: 'enabled',
          campaignType: 'sponsoredProducts',
          targetingType: 'auto',
        }, 
      ],
    },
  });

};
