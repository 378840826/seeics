/**
 * 广告 
 */
import Mock, { Random } from 'mockjs';

export default ({ mock }) => {
  if (!mock) {
    return;
  }

  // 店铺列表
  Mock.mock('/api/seeics-mws/store/list', 'get', {
    // list: [],
    data: [
      {
        'id': '1',
        'userId': '1341696907904458754',
        'storeName': 'droking',
        'marketplace': 'US',
        'sellerId': 'A2E3VXFBA6RD5C',
        'token': 'amzn.mws.3cae3e68-4149-d567-124f-5c66f04b5db6',
        'timezone': 'America/Los_Angeles',
        'currency': '￥',
        'tokenInvalid': false,
        'email': 'Ktxy6u6tmXwf@lindafeng.com',
        'bindAdStore': true,
        'adStoreId': '1434823005936205825',
        'createTime': '2021-02-02 02:02:02',
      }, {
        'id': '2',
        'userId': '1341696907904458754',
        'storeName': 'DROK',
        'marketplace': 'CA',
        'sellerId': 'A2E3VXFBA6RD5C',
        'token': 'amzn.mws.3cae3e68-4149-d567-124f-5c66f04b5db6',
        'timezone': 'America/Los_Angeles',
        'currency': '￥',
        'tokenInvalid': true,
        'email': 'Ktxy6u6tmXwf@lindafeng.com',
        'bindAdStore': true,
        'adStoreId': '1434823005936205825',
        'createTime': '2021-05-02 02:02:02',
      }, {
        'id': '3',
        'userId': '1341696907904458754',
        'storeName': 'Enpoint',
        'marketplace': 'UK',
        'sellerId': 'A2E3VXFBA6RD5C',
        'token': 'amzn.mws.3cae3e68-4149-d567-124f-5c66f04b5db6',
        'timezone': 'America/Los_Angeles',
        'currency': '$',
        'tokenInvalid': true,
        'email': 'Ktxy6u6tmXwf@lindafeng.com',
        'bindAdStore': false,
        'adStoreId': '1434823005936205826',
        'createTime': '2022-02-02 02:02:02',
      }
    ]
  });

  // 修改店铺名称
  Mock.mock('/api/seeics-mws/store/modify/name', 'post', {
    msg: '修改成功',
  });

  // 取消广告授权
  Mock.mock('/api/api/seeics-analysis/ppc/shop/cancel', 'get', {
    msg: '取消授权成功',
  });

  // 解绑店铺
  Mock.mock('/api/seeics-mws/store/unbind', 'post', {
    msg: '解绑成功',
  });
  
  // 绑定店铺
  Mock.mock('/api/seeics-mws/store/bind', 'post', {
    msg: '绑定成功',
  });

  // 绑定店铺
  Mock.mock('/api/seeics-analysis/ppc/shop/authorize', 'post', {
    msg: '授权成功',
    adStoreId: '11111111',
  });

  // 获取店铺下广告活动列表
  Mock.mock('/api/seeics-analysis/ppc/campaigns', 'post', () => {
    const records = [{
      id: '0',
      name: '广告活动-B073DY9671 B073DXX8PS B073CGP25H',
    }];
    for (let i = 1; i < 50; i++) {
      records.push({
        id: String(i),
        name: `广告活动-${i}-B073DY9671 B073DXH4ZD B073DXX8PS B073CGP25H`,
      });
    }
    return records;
  });

  // 获取店铺下广告组列表
  Mock.mock('/api/seeics-analysis/ppc/groups', 'post', () => {
    const records = [{
      id: '0',
      name: '广告组-B073DY9671 B073DXX8PS B073CGP25H',
      campaignId: '1',
    }];
    for (let i = 1; i < 50; i++) {
      records.push({
        id: String(i),
        name: `广告组-${i}-B073DY9671 B073DXH4ZD B073DXX8PS B073CGP25H`,
        campaignId: String(i),
      });
    }
    return records;
  });

  // 获取广告组的投放词
  Mock.mock('/api/seeics-analysis/ppc/st/put-keyword', 'post', ({ body }) => {
    const ids = JSON.parse(body);
    const r = [];
    for (let i = 0; i < Math.random() * 100; i++) {
      r.push(`${ids.join()}-put-${Random.string()}`);
    }
    return r;
  });

  // 获取广告组的搜索词
  Mock.mock('/api/seeics-analysis/ppc/st/query-keyword', 'post', ({ body }) => {
    const ids = JSON.parse(body);
    const r = [];
    for (let i = 0; i < Math.random() * 100; i++) {
      r.push(`${ids.join()}-query-${Random.string()}`);
    }
    return r;
  });

  // 加载偏好
  Mock.mock('/api/seeics-analysis/ppc/st/preference', 'get', {
    deliveryStatus: 'alreadyLive',
    filter: {
      sales: {
        min: '1000',
        max: '',
      },
      spend: {
        min: '',
        max: '',
      },
      conversionsRate: {
        min: '10',
        max: '20',
      },
      clicks: { min: '12', max: '234324' },
      orderNum: { min: '23453425', max: '35463245' },
      acos: { min: '2345', max: '4526245645' },
      ctr: { min: '23452345', max: '23453425' },
      cpc: { min: '', max: '' },
      roas: { min: '23452345', max: '234523' },
      cpa: { min: '', max: '' },
      impressions: { min: '', max: '' },
      aba: { min: '', max: '' },
    }
  });

  // 保存偏好
  Mock.mock('/api/seeics-analysis/ppc/st/save-preference', 'post', {
    msg: '保存成功',
  });

  // 获取 st 列表
  Mock.mock('/api/seeics-analysis/ppc/st/list', 'get', {
    total: 100,
    current: 2,
    size: 20,
    records: [
      {
        updateTime: '2022-02-02 22:22:22',
        store: ['DROKING:US', '店铺1:站点'],
        filterCondition: '筛选条件',
        success: false,
      }, {
        updateTime: '2022-02-02 22:22:22',
        store: ['DROKING:US', '店铺1:站点'],
        filterCondition: '筛选条件',
        success: true,
      },
    ],
  });
};
