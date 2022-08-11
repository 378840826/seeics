// 广告管理
import request from '@/router/axios';

// 各标签页的数量
export const queryTabsCellCount = params => {
  return request({
    url: '/api/seeics-ad/management/campaign/child-count',
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
export const queryCampaignList = params => {
  return request({
    url: '/api/seeics-ad/campaign/page',
    params,
  });
};