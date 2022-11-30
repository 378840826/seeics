// 广告管理
import request from '@/router/axios';

// 各标签页的数量
export const queryTabsCellCount = params => {
  return request({
    url: '/api/seeics-ad/campaign/all_count',
    params,
  });
};

// 树
// 树-广告活动
export const queryTreeCampaign = params => {
  return request({
    url: '/api/seeics-ad/campaign/tree_list',
    params,
  });
};

// 树-广告组
export const queryTreeGroup = params => {
  return request({
    url: '/api/seeics-ad/group/tree_list',
    params,
  });
};

// 广告组合
// 广告组合-列表
export const queryPortfolioList = params => {
  return request({
    url: '/api/seeics-ad/campaign/portfolio/list',
    params,
  });
};

// 广告组合-添加
export const addPortfolio = params => {
  return request({
    url: '/api/seeics-ad/campaign//portfolio/add',
    method: 'post',
    data: params,
  });
};

// 广告组合-修改名称
export const updatePortfolio = params => {
  return request({
    url: '/api/seeics-ad/campaign//portfolio/update',
    method: 'post',
    data: params,
  });
};


// 数据分析
// 数据分析-统计数据
export const queryAnalyseStatistic = (pageType, data) => {
  const urls = {
    campaign: '/api/seeics-ad/campaign/analyse/summary',
    placement: '/api/seeics-ad/campaign/placement/analyse/summary',
    group: '/api/seeics-ad/group/analyse/summary',
    ad: '/api/seeics-ad/product/analyse/summary',
    keyword: '/api/seeics-ad/keyword/analyse/summary',
    targeting: '/api/seeics-ad/targeting/analyse/summary',
    targetingGroup: '/api/seeics-ad/targeting/analyse/summary',
    searchTerm: '/api/seeics-ad/searchTerm/analyse/summary',
  };
  return request({
    url: urls[pageType],
    method: 'post',
    data,
  });
};

// 数据分析-列表
export const queryAnalyseList = (pageType, data) => {
  const urls = {
    campaign: '/api/seeics-ad/campaign/analyse/list',
    placement: '/api/seeics-ad/campaign/placement/analyse/list',
    group: '/api/seeics-ad/group/analyse/list',
    ad: '/api/seeics-ad/product/analyse/list',
    keyword: '/api/seeics-ad/keyword/analyse/list',
    targeting: '/api/seeics-ad/targeting/analyse/list',
    targetingGroup: '/api/seeics-ad/targeting/analyse/list',
    searchTerm: '/api/seeics-ad/searchTerm/analyse/list',
  };
  return request({
    url: urls[pageType],
    method: 'post',
    data,
  });
};

// 数据分析-下载
export const downloadAnalysisTable = (pageType, data) => {
  const urls = {
    campaign: '/api/seeics-ad/campaign/analyse/download',
    placement: '/api/seeics-ad/campaign/placement/analyse/download',
    group: '/api/seeics-ad/group/analyse/download',
    ad: '/api/seeics-ad/product/analyse/download',
    keyword: '/api/seeics-ad/keyword/analyse/download',
    targeting: '/api/seeics-ad/targeting/analyse/download',
    targetingGroup: '/api/seeics-ad/targeting/analyse/download',
    searchTerm: '/api/seeics-ad/searchTerm/analyse/download',
  };
  return request({
    url: urls[pageType],
    method: 'post',
    data,
    responseType: 'blob',
  });
};


// 广告活动
// 广告活动-列表
export const queryCampaignList = (params, data) => {
  return request({
    url: '/api/seeics-ad/campaign/page',
    method: 'post',
    params,
    data,
  });
};

// 广告活动-修改状态(可批量)
export const modifyCampaignState = (data) => {
  return request({
    url: '/api/seeics-ad/campaign/batchSetting',
    method: 'post',
    data,
  });
};

// 广告活动-修改
export const modifyCampaign = (data) => {
  return request({
    url: '/api/seeics-ad/campaign/update',
    method: 'post',
    data,
  });
};

// 广告活动-简单结构列表
export const queryConciseCampaignList = (data) => {
  return request({
    url: '/api/seeics-ad/campaign/conciseList',
    method: 'post',
    data,
  });
};


// 广告位
// 广告位-列表
export const queryPlacementList = (params, data) => {
  return request({
    url: '/api/seeics-ad/campaign/placement/list',
    method: 'post',
    params,
    data,
  });
};


// 广告组
// 广告组-列表
export const queryGroupList = (params, data) => {
  return request({
    url: '/api/seeics-ad/group/page',
    method: 'post',
    params,
    data,
  });
};

// 广告组-修改状态(可批量)
export const modifyGroupState = (data) => {
  return request({
    url: '/api/seeics-ad/group/batchSetting',
    method: 'post',
    data,
  });
};

// 广告组-修改
export const modifyGroup = (data) => {
  return request({
    url: '/api/seeics-ad/group/update',
    method: 'post',
    data,
  });
};

// 广告组-简单结构列表
export const queryConciseGroupList = (data) => {
  return request({
    url: '/api/seeics-ad/group/list',
    method: 'post',
    data,
  });
};


// 广告
// 广告-列表
export const queryAdList = (params, data) => {
  return request({
    url: '/api/seeics-ad/product/page',
    method: 'post',
    params,
    data,
  });
};

// 广告-修改状态(可批量)
export const modifyAdState = (data) => {
  return request({
    url: '/api/seeics-ad/product/batchSetting',
    method: 'post',
    data,
  });
};

// 关键词
// 关键词-列表
export const queryKwList = (params, data) => {
  return request({
    url: '/api/seeics-ad/keyword/page',
    method: 'post',
    params,
    data,
  });
};

// 关键词-获取建议竞价
export const queryKwSuggestedBid = (data) => {
  return request({
    url: '/api/seeics-ad/keyword/bid-recommendation',
    method: 'post',
    data,
  });
};

// 关键词-修改(可批量)
export const modifyKeyword = (data) => {
  return request({
    url: '/api/seeics-ad/keyword/batchSetting',
    method: 'post',
    data,
  });
};

// Targeting
// Targeting-列表
export const queryTargetingList = (params, data) => {
  return request({
    url: '/api/seeics-ad/targeting/page',
    method: 'post',
    params,
    data,
  });
};

// Targeting-获取建议竞价
export const queryTargetingSuggestedBid = (data) => {
  return request({
    url: '/api/seeics-ad/targeting/bid-recommendation',
    method: 'post',
    data,
  });
};

// Targeting-修改(可批量)
export const modifyTargeting = (data) => {
  return request({
    url: '/api/seeics-ad/targeting/batchSetting',
    method: 'post',
    data,
  });
};

// 否定关键词
// 否定关键词-列表
export const queryNeKeywordList = (params, data) => {
  return request({
    url: '/api/seeics-ad/nekeyword/page',
    method: 'post',
    params,
    data,
  });
};

// 否定关键词-归档
export const archiveNeKeyword = (data) => {
  /**
   * 归档否定关键词，后端一共给了3个接口，都需要区分
   * 1 广告活动下的否定关键词 (树选中广告活动时，广告活动下的否定关键词)
   * 2 广告活动下广告组的否定关键词 (树选中广告活动时，当前广告活动下的广告组下的否定关键词)
   * 3 广告组下的否定关键词 （树选中广告组时广告组的否定关键词）
   */
  const campaign = '/api/seeics-ad/nekeyword/ne-keyword/campaign/archive';
  const campaignGroup = '/api/seeics-ad/nekeyword/campaign/group/archive';
  const group = '/api/seeics-ad/nekeyword/ne-keyword/group/archive';
  let url = '';
  // 树选中广告组时，使用广告组下的归档
  if (data.groupId) {
    url = group;
  } else {
    // 树选中广告活动时， 区分当前显示的数据源是广告活动的还是广告组的
    url = data.dataSource === 'group' ? campaignGroup : campaign;
  }
  return request({
    url,
    method: 'post',
    data,
  });
};

// 否定Targeting
// 否定Targeting-列表
export const queryNeTargetingList = (params, data) => {
  return request({
    url: '/api/seeics-ad/negative_targeting/page',
    method: 'post',
    params,
    data,
  });
};

// 否定Targeting-归档
export const archiveNeTargeting = (data) => {
  // 区分广告活动和广告组
  const campaign = '/api/seeics-ad/negative_targeting/archived/campaign';
  const group = '/api/seeics-ad/negative_targeting/archived';
  const url = data.archiveIds ? campaign : group;
  return request({
    url,
    method: 'post',
    data,
  });
};

// 投放组
// 投放组-列表
export const queryTargetingGroupsList = (params, data) => {
  return request({
    url: '/api/seeics-ad/targeting/auto/page',
    method: 'post',
    params,
    data,
  });
};

// 投放组-批量调整竞价
export const modifyTargetingGroupsBitchBid = (data) => {
  return request({
    url: '/api/seeics-ad/targeting/update/bid',
    method: 'post',
    data,
  });
};


// SearchTerm
// SearchTerm-列表
export const querySearchTermList = (data) => {
  return request({
    url: '/api/seeics-ad/searchTerm/list',
    method: 'post',
    data,
  });
};

// SearchTerm-下载
export const downloadSearchTermTable = (data) => {
  return request({
    url: '/api/seeics-ad/searchTerm/list/download',
    method: 'post',
    data,
    responseType: 'blob',
  });
};


// 创建广告活动--------------------
//创建广告活动商品信息列表
export const queryPriceList = params => {
  return request({
    url: '/api/seeics-mws/product/list',
    method: 'post',
    params: {
      current: params.current,
      size: params.size
    },
    data: {
      storeId: params.storeId,
      keyword: params.keyword
    },
  });
};

// 查询建议关键词
export const querySuggestKeyword = params => {
  return request({
    url: '/api/seeics-ad/keyword/suggestedKeywordsByAsins',
    method: 'post',
    data: params,
  });
};

// 手动输入关键词查询列表
export const manualQueryKeyword = params => {
  return request({
    url: '/api/seeics-ad/keyword/queryKeywordSuggestedBid',
    method: 'post',
    data: params,
  });
};

//target 列表
export const queryTargeList = params => {
  return request({
    url: '/api/seeics-ad/targeting/autoTargetingSuggestedBid',
    method: 'post',
    data: params,
  });
};

//商品查询列表
export const getPriceList = params => {
  return request({
    url: '/api/seeics-ad/product/suggestedProductByAsins',
    method: 'post',
    data: params,
  });
};

// 创建广告活动
export const createAdManage = params => {
  return request({
    url: '/api/seeics-ad/campaign/create',
    method: 'post',
    data: params,
  });
};
// --------------------创建广告活动

// 创建广告组--------------------

export const createAdGroup = params => {
  return request({
    url: '/api/seeics-ad/group/create',
    method: 'post',
    data: params,
  });
};

export const queryCampaignSelectList = (params, data) => {
  return request({
    url: '/api/seeics-ad/campaign/conciseList',
    method: 'post',
    params,
    data,
  });
};

export const getGroupList = (params, data) => {
  return request({
    url: '/api/seeics-ad/group/list',
    method: 'post',
    params,
    data,
  });
};
// --------------------创建广告组

// 创建广告--------------------

export const createAd = params => {
  return request({
    url: '/api/seeics-ad/product/create',
    method: 'post',
    data: params,
  });
};

// --------------------创建广告

// 添加商品

export const createTargeting = params => {
  return request({
    url: '/api/seeics-ad/targeting/create',
    method: 'post',
    data: params,
  });
};

// 创建关键词--------------------

export const createKeyword = params => {
  return request({
    url: '/api/seeics-ad/keyword/create',
    method: 'post',
    data: params,
  });
};

//获取建议否定关键词

export const getSuggestKeyword = (params, data) => {
  return request({
    url: '/api/seeics-ad/nekeyword/suggested-negativeKeyword/list',
    method: 'post',
    params,
    data,
  });
};

//创建否定关键词

export const createNegativeKeyword = (data, type) => {
  const campaign = '/api/seeics-ad/nekeyword/campaign/create';
  const group = '/api/seeics-ad/nekeyword/group/create';
  const url = type === 'campaign' ? campaign : group;
  return request({
    url: url,
    method: 'post',
    data,
  });
};

// 添加否定商品
export const createDenyTargeting = data => {
  return request({
    url: '/api/seeics-ad/negative_targeting/create',
    method: 'post',
    data,
  });
};

// 广告组合下拉框数据
export const getAdConciseList = (params, data) => {
  return request({
    url: '/api/seeics-ad/campaign/portfolio/conciseList',
    method: 'post',
    params,
    data,
  });
};
export const getDenyCampaignList = (params, data) => {
  return request({
    url: '/api/seeics-ad/campaign/create_list',
    method: 'post',
    params,
    data,
  });
};

export const getDenyGroupList = data => {
  return request({
    url: '/api/seeics-ad/group/create_list',
    method: 'get',
    params: data,
  });
};
