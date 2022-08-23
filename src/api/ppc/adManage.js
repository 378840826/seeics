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
    url: '/api/seeics-ad/management/campaign/simple-list',
    params,
  });
};

// 树-广告组
export const queryTreeGroup = params => {
  return request({
    url: '/api/seeics-ad/management/group/simple-list',
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
