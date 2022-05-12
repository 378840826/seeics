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
        'dataSync': false,
        'email': 'Ktxy6u6tmXwf@lindafeng.com',
        'bindAdStore': true,
        'adStoreId': '1434823005936205825',
        'createTime': '2021-02-02 02:02:02',
        // 'refreshExpiresIn': '2022-02-02 10:02:02',
        'refreshExpiresIn': '2022-05-12 10:02:02',
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
        'dataSync': true,
        'email': 'Ktxy6u6tmXwf@lindafeng.com',
        'bindAdStore': true,
        'adStoreId': '1434823005936205825',
        'createTime': '2021-05-02 02:02:02',
        'refreshExpiresIn': '2022-05-02 02:02:02',
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
        'dataSync': true,
        'email': 'Ktxy6u6tmXwf@lindafeng.com',
        'bindAdStore': false,
        'adStoreId': '1434823005936205826',
        'createTime': '2022-02-02 02:02:02',
        'refreshExpiresIn': '2023-02-02 02:02:02',
      }
    ]
  });

  // 修改店铺名称
  Mock.mock('/api/seeics-mws/store/modify/name', 'post', {
    msg: '修改成功',
  });

  // 修改店铺同步开关
  Mock.mock('/api/seeics-mws/seeics-mws/store/modify/dataSync', 'post', {
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
  Mock.mock('/api/seeics-ad/campaign/list', 'post', () => {
    const records = [{
      campaignId: '0',
      name: '广告活动-B073DY9671 B073DXX8PS B073CGP25H',
    }];
    for (let i = 1; i < 50; i++) {
      records.push({
        campaignId: String(i),
        name: `广告活动-${i}-B073DY9671 B073DXH4ZD B073DXX8PS B073CGP25H`,
      });
    }
    return { data: { records } };
  });

  // 获取店铺下广告组列表
  Mock.mock('/api/seeics-ad/group/list', 'post', () => {
    const records = [{
      groupId: '0',
      name: '广告组-B073DY9671 B073DXX8PS B073CGP25H',
      campaignId: '1',
    }];
    for (let i = 1; i < 50; i++) {
      records.push({
        groupId: String(i),
        name: `广告组-${i}-B073DY9671 B073DXH4ZD B073DXX8PS B073CGP25H`,
        campaignId: String(i),
      });
    }
    return { data: { records } };
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

  // 获取广告组的搜索词或投放词
  Mock.mock('/api/seeics-analysis/searchTerm/queryKeywordList', 'post', ({ body }) => {
    const { groupIds, keywordType } = JSON.parse(body);
    const dict = {
      '1': '搜索词',
      '2': '投放词',
    };
    const r = [];
    for (let i = 0; i < Math.random() * 100; i++) {
      r.push(`${groupIds.join()}-${dict[keywordType]}-${Random.string()}`);
    }
    return r;
  });

  // 加载偏好
  Mock.mock('/api/seeics-analysis/searchTerm/queryPreference', 'get', {
    deliveryStatus: '1',
    salesVolumeMin: '1000',
    conversionMin: '10',
    conversionMax: '20',
    clicksMin: '12',
    clicksMax: '234324',
    abaMax: '123',
  });

  // 保存偏好
  Mock.mock('/api/seeics-analysis/searchTerm/savePreference', 'post', {
    msg: '保存成功',
  });

  // 获取 st 列表
  Mock.mock('/api/seeics-analysis/searchTerm/list', 'get', {
    total: 100,
    current: 2,
    size: 20,
    reportUpdateTime: '2022-02-02 02:02:02',
    records: [
      {
        id: '1',
        modifyTime: '2022-02-02 22:22:22',
        marketplaceVoList: [
          { storeName: '店铺1', marketplace: 'US' },
          { storeName: '店铺2', marketplace: 'DE' },
        ],
        filterConditionVo: {
          launchKeyword: '投放词-1',
          searchKeyword: '搜索词-1',
          asinMskuKeyword: 'B000000000 B000000000 B000000000 B000000000 B000000000',
          deliveryStatus: '1',
          cycleType: 30,
          abaMin: 10,
          abaMax: 20,
          conversionMin: 30,
          campaignNameList: ['广告活动-1', '广告活动-2', '广告活动-3广告活动-3广告活动-3广告活动-3广告活动-3', '广告活动-4'],
          groupNameList: ['广告组-1', '广告组-2', '广告组-3', '广告组-4'],
        },
      }, {
        id: '2',
        modifyTime: '2022-02-02 22:22:22',
        marketplaceVoList: [
          { storeName: '店铺1', marketplace: 'US' },
        ],
        filterConditionVo: {
          launchKeyword: '投放词-2',
          searchKeyword: '搜索词-2',
          asinMskuKeyword: 'B000000000',
          deliveryStatus: '0',
          cycleType: 7,
          abaMax: 20,
          conversionMin: 30,
          groupNameList: ['广告组-1'],
        },
      },
    ],
  });

  // 确定筛选
  Mock.mock('/api/seeics-analysis/searchTerm/search', 'post', {
    msg: '筛选成功',
  });
};
