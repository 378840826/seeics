
import Mock, { Random } from 'mockjs';

Mock.setup({
  // 延迟
  timeout: '10-500',
});

const stateList = ['enabled', 'paused', 'archived'];
const targetingTypeList = ['manual', 'auto', 'T00020', 'T00030'];
const biddingStrategyList = ['legacyForSales', 'autoForSales', 'manual'];

export default ({ mock }) => {
  if (!mock) {
    return;
  }

  // 标签页数量
  Mock.mock('/api/seeics-ad/management/campaign/child-count', 'get', () => {
    return {
      data: {
        campaignCount: Random.integer(1, 200),
        groupCount: Random.integer(1, 1000),
        adCount: Random.integer(1, 5000),
        keywordCount: Random.integer(1, 1000),
        targetCount: Random.integer(1, 1000),
        neTargetCount: Random.integer(1, 1000),
      },
    };
  });

  // 树
  // 树-广告活动
  Mock.mock(RegExp('/api/seeics-ad/management/campaign/simple-list' + '.*?'), 'get', () => {
    const records = [{
      id: '0',
      name: '广告活动-B073DY9671 B073DXH4ZD B073DXX8PS B073CGP25H',
      state: 'enabled',
    }];
    for (let i = 1; i < 10; i++) {
      records.push({
        id: `${i}`,
        name: `广告活动-${i}-B073DY9671 B073DXH4ZD B073DXX8PS B073CGP25H`,
        state: stateList[i % 3],
      });
    }
    return { data: { records } };
  });

  // 树-广告组
  Mock.mock(RegExp('/api/seeics-ad/management/group/simple-list' + '.*?'), 'get', () => {
    const records = [{
      id: '0',
      name: '广告组-530091_12_B07T7LYSBV_190620_hoseclamps',
      state: 'enabled',
      groupType: 'keyword',
    }];
    for (let i = 1; i < 10; i++) {
      records.push({
        id: `${i}`,
        name: `广告组-${i}-530091_12_B07T7LYSBV_190620_hoseclamps`,
        state: stateList[i % 3],
        groupType: 'targeting',
      });
    }
    return { data: { records } };
  });

  // 广告组合
  // 广告组合-列表
  Mock.mock('/api/seeics-ad/management/campaign/portfolio/list', 'get', {
    'data|0-50': [
      {
        id: /\d{5,10}/,
        name: '@cword(2,20)',
      },
    ],
  });

  // 广告组合-添加
  Mock.mock('/api/seeics-ad/management/campaign/portfolio/add', 'post', (req) => {
    const body = JSON.parse(req.body);
    return {
      data: {
        id: '1',
        name: body.name,
      },
    };
  });

  // 广告组合-修改名称
  Mock.mock('/api/seeics-ad/management/campaign/portfolio/update', 'post', (req) => {
    const body = JSON.parse(req.body);
    return {
      data: {
        id: body.id,
        name: body.name,
      },
    };
  });

  // 广告活动
  // 广告活动-列表
  Mock.mock(RegExp('/api/seeics-ad/campaign/page' + '.*?'), 'get', {
    'records|1-20': [{
      id: /\d{5,10}/,
      name: '广告活动-' + '@string("upper", 1, 128)',
      'state|1': stateList,
      portfolioId: /\d{5,10}/,
      portfolioName: 'portfolio-' + '@cword(2,20)',
      'targetingType|1': targetingTypeList,
      createdTime: '@datetime',
      groupNumber: '@integer(0, 2000)',
      'biddingStrategy|1': biddingStrategyList,
      biddingPlacementTop: '@float(0, 100, 0, 2)',
      biddingPlacementProductPage: '@float(0, 100, 0, 2)',
      dailyBudget: '@float(0, 50, 0, 2)',
      negativeTargetingNumber: '@integer(0, 2000)',
      startDate: '@datetime',
      endDate: '@datetime',
      sales: '@float(0, 1000000, 0, 2)',
      orderNum: '@integer(0, 2000)',
    }]
  });

};
