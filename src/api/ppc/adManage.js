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
    url: '/api/seeics-ad/management/campaign/portfolio/list',
    params,
  });
};

// 广告组合-添加
export const addPortfolio = params => {
  return request({
    url: '/api/seeics-ad/management/campaign/portfolio/add',
    method: 'post',
    data: params,
  });
};

// 广告组合-修改名称
export const updatePortfolio = params => {
  return request({
    url: '/api/seeics-ad/management/campaign/portfolio/update',
    method: 'post',
    data: params,
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
